import { getConfig } from './config';
import { runGuardian } from './pipeline';
import { scanPortfolioRegistry } from './detector';

const config = getConfig();
console.log(`[guardian] mode=${config.mode} run started`);

const registrySummary = scanPortfolioRegistry();
console.log(`[guardian] Portfolio Registry Scan: ${registrySummary.total} projects tracked (${registrySummary.standaloneRepos} standalone repos, ${registrySummary.monorepoPaths} monorepo paths)`);

try {
  const result = await runGuardian(config);
  // Log execution status summary without exposing untrusted raw payloads
  console.log(`[guardian] pipeline status: ${result.status}, runId=${result.runId}`);
  process.exitCode = result.status === 'VALIDATION_FAILED' || result.status === 'REPAIR_REJECTED' ? 1 : 0;
} catch (error) {
  const safeMessage = error instanceof Error ? error.message.replace(/[\r\n]/g, ' ') : 'Unknown error';
  console.error(`[guardian] failed closed: ${safeMessage}`);
  process.exitCode = 1;
}
