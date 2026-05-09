import 'dotenv/config';
import { config } from './config.js';
import { logger } from './logger.js';
import { fetchOpenIntents } from './poller.js';
import { processIntent } from './solver.js';
import { startHeartbeat } from './heartbeat.js';

async function poll(): Promise<void> {
  const intents = await fetchOpenIntents();
  if (intents.length === 0) {
    logger.debug('No eligible intents found');
    return;
  }

  logger.info(`Found ${intents.length} eligible intent(s) — processing top candidate`);

  // Process the top candidate (most profitable). Expand to parallel in Phase 2.
  const top = intents[0];
  await processIntent(top);
}

async function main(): Promise<void> {
  logger.info('Seven Chain Solver starting', {
    solverAddress: config.solverAddress,
    routes:        config.routes.map(r => `${r.fromChain}/${r.fromToken}→${r.toChain}`),
    apiUrl:        config.apiUrl,
    pollInterval:  `${config.pollIntervalMs / 1000}s`,
  });

  // Start heartbeat to stay listed as active
  startHeartbeat();

  // Start polling loop
  logger.info('Polling for open intents...', { intervalMs: config.pollIntervalMs });
  poll();
  setInterval(poll, config.pollIntervalMs);
}

main().catch(err => {
  logger.error('Fatal error — solver shutting down', { error: err.message });
  process.exit(1);
});
