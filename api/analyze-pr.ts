import { parseGitHubPrUrl, fetchPullRequestData } from '../src/vero/server/github.js';
import { runSonarQubeAnalysis } from '../src/vero/server/sonarEngine.js';
import { runJevInference } from '../src/vero/server/jevEngine.js';
import { runDeterministicDecisionEngine } from '../src/vero/server/decisionEngine.js';
import { AnalysisResult, TrialStatus } from '../src/vero/types.js';

interface SessionUsage {
  coolingStart: number;
  distinctPrs: Set<string>;
}

const sessionStore = new Map<string, SessionUsage>();
const COOLING_PERIOD_MS = 24 * 60 * 60 * 1000;
const MAX_FREE_DISTINCT_PRS = 3;

function getOrUpdateSession(sessionId: string): SessionUsage {
  let session = sessionStore.get(sessionId);
  const now = Date.now();
  if (!session) {
    session = {
      coolingStart: now,
      distinctPrs: new Set<string>(),
    };
    sessionStore.set(sessionId, session);
    return session;
  }
  if (now - session.coolingStart >= COOLING_PERIOD_MS) {
    session.coolingStart = now;
    session.distinctPrs.clear();
  }
  return session;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, x-client-session-id, x-user-github-token, x-user-typesafe-key'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST /api/analyze-pr.' });
  }

  const startTime = Date.now();
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { prUrl } = body;

  const userGithubToken = (req.headers?.['x-user-github-token'] as string) || '';
  const userTypesafeKey = (req.headers?.['x-user-typesafe-key'] as string) || '';
  const sessionId =
    (req.headers?.['x-client-session-id'] as string) ||
    (req.headers?.['x-forwarded-for'] as string) ||
    'anonymous-client';

  const hasUserGithubToken = Boolean(userGithubToken && userGithubToken.trim().length > 0);
  const hasUserTypesafeKey = Boolean(userTypesafeKey && userTypesafeKey.trim().length > 0);

  if (!prUrl || typeof prUrl !== 'string') {
    return res.status(400).json({ error: 'Please provide a valid public GitHub Pull Request URL.' });
  }

  const parsed = parseGitHubPrUrl(prUrl);
  if (!parsed) {
    return res.status(400).json({
      error:
        'Invalid GitHub Pull Request URL format. Expected format: https://github.com/owner/repository/pull/123 or owner/repository#123',
    });
  }

  const session = getOrUpdateSession(sessionId);
  const canonicalKey = parsed.canonicalUrl.toLowerCase();
  const alreadyAnalyzedThisPr = session.distinctPrs.has(canonicalKey);

  if (!hasUserGithubToken && !alreadyAnalyzedThisPr && session.distinctPrs.size >= MAX_FREE_DISTINCT_PRS) {
    const remainingHours = Math.ceil(
      Math.max(0, session.coolingStart + COOLING_PERIOD_MS - Date.now()) / (1000 * 60 * 60)
    );
    return res.status(429).json({
      error: `24-Hour Free Trial Limit Reached: You have analyzed ${MAX_FREE_DISTINCT_PRS} distinct Pull Requests using the shared demo token. Please provide your own GitHub Personal Access Token in Settings for unlimited analyses, or wait ${remainingHours} hours for the 24-hour cooling window to reset.`,
      trialLimitReached: true,
      coolingResetMs: Math.max(0, session.coolingStart + COOLING_PERIOD_MS - Date.now()),
      trialsUsed: session.distinctPrs.size,
      trialsMax: MAX_FREE_DISTINCT_PRS,
    });
  }

  try {
    const ghStart = Date.now();
    const { metadata, files, source } = await fetchPullRequestData(
      parsed,
      hasUserGithubToken ? userGithubToken.trim() : undefined
    );
    const ghMs = Date.now() - ghStart;

    const sonarStart = Date.now();
    const sonarQube = runSonarQubeAnalysis(files);
    const sonarMs = Date.now() - sonarStart;

    const jevStart = Date.now();
    const jev = await runJevInference(
      metadata,
      files,
      hasUserTypesafeKey ? userTypesafeKey.trim() : undefined
    );
    const jevMs = Date.now() - jevStart;

    const decisionStart = Date.now();
    const assessment = runDeterministicDecisionEngine(metadata, files, sonarQube, jev);
    const decisionMs = Date.now() - decisionStart;

    const totalMs = Date.now() - startTime;

    if (!hasUserGithubToken && !alreadyAnalyzedThisPr) {
      if (session.distinctPrs.size === 0) {
        session.coolingStart = Date.now();
      }
      session.distinctPrs.add(canonicalKey);
    }

    const coolingResetMs = Math.max(0, session.coolingStart + COOLING_PERIOD_MS - Date.now());
    const trialStatus: TrialStatus = {
      isUsingCustomToken: hasUserGithubToken,
      trialsUsed: hasUserGithubToken ? 0 : session.distinctPrs.size,
      trialsMax: MAX_FREE_DISTINCT_PRS,
      trialsRemaining: hasUserGithubToken ? 999 : Math.max(0, MAX_FREE_DISTINCT_PRS - session.distinctPrs.size),
      coolingPeriodHours: 24,
      coolingResetMs: hasUserGithubToken ? 0 : coolingResetMs,
      coolingStart: session.coolingStart,
      distinctPrsAnalyzed: Array.from(session.distinctPrs),
      usingDefaultTypeSafeKey: !hasUserTypesafeKey,
    };

    const result: AnalysisResult = {
      pullRequest: metadata,
      files,
      sonarQube,
      jev,
      assessment,
      trialStatus,
      telemetry: {
        githubApiMs: ghMs,
        sonarAnalysisMs: sonarMs,
        jevInferenceMs: jevMs,
        decisionEngineMs: decisionMs,
        totalMs,
        analyzedAt: new Date().toISOString(),
        dataSource: source,
      },
    };

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Failed to analyze Pull Request. Please verify the URL is public and accessible.',
    });
  }
}
