import { TrialStatus } from '../src/vero/types.js';

const COOLING_PERIOD_MS = 24 * 60 * 60 * 1000;
const MAX_FREE_DISTINCT_PRS = 3;

export default function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, x-client-session-id, x-user-github-token, x-user-typesafe-key'
    );
    return res.status(200).end();
  }

  const userGithubToken = (req.headers?.['x-user-github-token'] as string) || '';
  const userTypesafeKey = (req.headers?.['x-user-typesafe-key'] as string) || '';

  const hasUserToken = Boolean(userGithubToken && userGithubToken.trim().length > 0);
  const hasUserTypesafeKey = Boolean(userTypesafeKey && userTypesafeKey.trim().length > 0);

  const status: TrialStatus = {
    isUsingCustomToken: hasUserToken,
    trialsUsed: 0,
    trialsMax: MAX_FREE_DISTINCT_PRS,
    trialsRemaining: hasUserToken ? 999 : MAX_FREE_DISTINCT_PRS,
    coolingPeriodHours: 24,
    coolingResetMs: hasUserToken ? 0 : COOLING_PERIOD_MS,
    coolingStart: Date.now(),
    distinctPrsAnalyzed: [],
    usingDefaultTypeSafeKey: !hasUserTypesafeKey,
  };

  return res.status(200).json(status);
}
