import { getConfig } from './config';
import { runGuardian } from './pipeline';
import { scanPortfolioRegistry } from './detector';

const config = getConfig();
console.log(`[guardian] mode=${config.mode} run started`);

const registrySummary = scanPortfolioRegistry();
console.log(`[guardian] Portfolio Registry Scan: ${registrySummary.total} projects tracked (${registrySummary.standaloneRepos} standalone repos, ${registrySummary.monorepoPaths} monorepo paths)`);

try {
  const result = await runGuardian(config);
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.status === 'VALIDATION_FAILED' || result.status === 'REPAIR_REJECTED' ? 1 : 0;
} catch (error) {
  console.error(`[guardian] failed closed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
