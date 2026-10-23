import { parseGitHubPrUrl, fetchPullRequestData } from '../server/github.js';
import { runSonarQubeAnalysis } from '../server/sonarEngine.js';
import { runJevInference } from '../server/jevEngine.js';
import { runDeterministicDecisionEngine } from '../server/decisionEngine.js';
import { AnalysisResult, TrialStatus } from '../types.js';

const STORAGE_KEY = 'prs_client_trial_session_v1';
const COOLING_PERIOD_MS = 24 * 60 * 60 * 1000; // 24-hour cooling window
const MAX_FREE_DISTINCT_PRS = 3;

interface ClientSessionData {
  coolingStart: number;
  distinctPrs: string[];
}

function loadOrResetClientSession(): ClientSessionData {
  const now = Date.now();
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as ClientSessionData;
      if (
        typeof parsed.coolingStart === 'number' &&
        Array.isArray(parsed.distinctPrs) &&
        now - parsed.coolingStart < COOLING_PERIOD_MS
      ) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }

  const fresh: ClientSessionData = {
    coolingStart: now,
    distinctPrs: [],
  };
  saveClientSession(fresh);
  return fresh;
}

function saveClientSession(session: ClientSessionData): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    }
  } catch {
    // Ignore storage write errors
  }
}

export function getClientTrialStatus(
  userGithubToken?: string,
  userTypesafeKey?: string
): TrialStatus {
  const hasUserToken = Boolean(userGithubToken && userGithubToken.trim().length > 0);
  const hasUserTypesafeKey = Boolean(userTypesafeKey && userTypesafeKey.trim().length > 0);
  const session = loadOrResetClientSession();
  const coolingResetMs = Math.max(0, session.coolingStart + COOLING_PERIOD_MS - Date.now());

  return {
    isUsingCustomToken: hasUserToken,
    trialsUsed: hasUserToken ? 0 : session.distinctPrs.length,
    trialsMax: MAX_FREE_DISTINCT_PRS,
    trialsRemaining: hasUserToken
      ? 999
      : Math.max(0, MAX_FREE_DISTINCT_PRS - session.distinctPrs.length),
    coolingPeriodHours: 24,
    coolingResetMs: hasUserToken ? 0 : coolingResetMs,
    coolingStart: session.coolingStart,
    distinctPrsAnalyzed: session.distinctPrs,
    usingDefaultTypeSafeKey: !hasUserTypesafeKey,
  };
}

export class TrialQuotaExceededError extends Error {
  trialsUsed: number;
  coolingResetMs: number;

  constructor(message: string, trialsUsed: number, coolingResetMs: number) {
    super(message);
    this.name = 'TrialQuotaExceededError';
    this.trialsUsed = trialsUsed;
    this.coolingResetMs = coolingResetMs;
  }
}

export async function runClientPrAnalysis(
  prUrl: string,
  userGithubToken?: string,
  userTypesafeKey?: string
): Promise<AnalysisResult> {
  const startTime = Date.now();
  const hasUserGithubToken = Boolean(userGithubToken && userGithubToken.trim().length > 0);
  const hasUserTypesafeKey = Boolean(userTypesafeKey && userTypesafeKey.trim().length > 0);

  if (!prUrl || typeof prUrl !== 'string') {
    throw new Error('Please provide a valid public GitHub Pull Request URL.');
  }

  const parsed = parseGitHubPrUrl(prUrl);
  if (!parsed) {
    throw new Error(
      'Invalid GitHub Pull Request URL format. Expected format: https://github.com/owner/repository/pull/123 or owner/repository#123'
    );
  }

  const session = loadOrResetClientSession();
  const canonicalKey = parsed.canonicalUrl.toLowerCase();
  const alreadyAnalyzedThisPr = session.distinctPrs.includes(canonicalKey);

  if (!hasUserGithubToken) {
    if (!alreadyAnalyzedThisPr && session.distinctPrs.length >= MAX_FREE_DISTINCT_PRS) {
      const coolingResetMs = Math.max(0, session.coolingStart + COOLING_PERIOD_MS - Date.now());
      const remainingHours = Math.ceil(coolingResetMs / (1000 * 60 * 60));
      throw new TrialQuotaExceededError(
        `24-Hour Free Trial Limit Reached: You have analyzed ${MAX_FREE_DISTINCT_PRS} distinct Pull Requests using the shared demo quota. Please provide your own GitHub Personal Access Token in Settings for unlimited analyses, or wait ${remainingHours} hours for the 24-hour cooling window to reset.`,
        session.distinctPrs.length,
        coolingResetMs
      );
    }
  }

  // Step 1: GitHub PR Ingestion (Live GitHub REST API with fixture fallback)
  const ghStart = Date.now();
  const { metadata, files, source } = await fetchPullRequestData(
    parsed,
    hasUserGithubToken ? userGithubToken!.trim() : undefined
  );
  const ghMs = Date.now() - ghStart;

  // Step 2: SonarQube Deterministic Static Analysis
  const sonarStart = Date.now();
  const sonarQube = runSonarQubeAnalysis(files);
  const sonarMs = Date.now() - sonarStart;

  // Step 3: TypeSafe Jev Structured Probabilistic Inference
  const jevStart = Date.now();
  const jev = await runJevInference(
    metadata,
    files,
    hasUserTypesafeKey ? userTypesafeKey!.trim() : undefined
  );
  const jevMs = Date.now() - jevStart;

  // Step 4: Deterministic Decision Engine ("Jev judges. Code decides.")
  const decisionStart = Date.now();
  const assessment = runDeterministicDecisionEngine(metadata, files, sonarQube, jev);
  const decisionMs = Date.now() - decisionStart;

  const totalMs = Date.now() - startTime;

  if (!hasUserGithubToken && !alreadyAnalyzedThisPr) {
    if (session.distinctPrs.length === 0) {
      session.coolingStart = Date.now();
    }
    session.distinctPrs.push(canonicalKey);
    saveClientSession(session);
  }

  const trialStatus = getClientTrialStatus(userGithubToken, userTypesafeKey);

  return {
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
}
