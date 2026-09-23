import { getConfig } from './config';
import { runGuardian } from './pipeline';
const config = getConfig();
console.log(`[guardian] mode=${config.mode} run started`);
try { const result = await runGuardian(config); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.status === 'VALIDATION_FAILED' || result.status === 'REPAIR_REJECTED' ? 1 : 0; } catch (error) { console.error(`[guardian] failed closed: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; }