import fetch from 'node-fetch';
import { config, type RouteConfig } from './config.js';
import { logger } from './logger.js';
import { estimateGasCostBnb } from './chains/bnb.js';
import { estimateGasCostEth } from './chains/eth.js';

export interface BridgeIntent {
  id: string;
  userAddress: string;
  fromChain: string;
  toChain: string;
  fromToken: string;
  toToken: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  status: string;
  deadline: number;
  createdAt: number;
  sourceLockTx: string | null;
}

function routeMatches(intent: BridgeIntent, route: RouteConfig): boolean {
  return (
    intent.fromChain.toUpperCase() === route.fromChain.toUpperCase() &&
    intent.fromToken.toUpperCase() === route.fromToken.toUpperCase() &&
    intent.toChain.toUpperCase()   === route.toChain.toUpperCase()
  );
}

/** Minimum milliseconds left on the intent before we bother claiming (must beat claim window) */
const MIN_TIME_LEFT_MS = 3 * 60 * 1000;

function isExpiringSoon(intent: BridgeIntent): boolean {
  return intent.deadline - Date.now() < MIN_TIME_LEFT_MS;
}

/** Estimate gas cost in the same unit as feeAmount for the given source chain */
async function estimateGasCost(fromChain: string): Promise<number> {
  switch (fromChain.toUpperCase()) {
    case 'BNB': return estimateGasCostBnb();
    case 'ETH': return estimateGasCostEth();
    default:    return 0;
  }
}

/** Returns true if the fee more than covers estimated gas + min profit threshold */
async function isProfitable(intent: BridgeIntent): Promise<boolean> {
  const gasCost  = await estimateGasCost(intent.fromChain);
  const netProfit = intent.feeAmount - gasCost;

  if (netProfit < config.minProfitThreshold) {
    logger.debug('Skipping unprofitable intent', {
      intentId:   intent.id,
      fee:        intent.feeAmount,
      gasCost,
      netProfit,
      threshold:  config.minProfitThreshold,
    });
    return false;
  }
  return true;
}

export async function fetchOpenIntents(): Promise<BridgeIntent[]> {
  const url = `${config.apiUrl}/api/bridge/intents/open`;
  try {
    const resp = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!resp.ok) {
      logger.warn('Open intents fetch failed', { status: resp.status, url });
      return [];
    }
    const data = await resp.json() as { intents?: BridgeIntent[] };
    const all  = data.intents ?? [];

    // Filter: supported route, not expiring, route match
    const routeFiltered = all.filter(intent =>
      !isExpiringSoon(intent) &&
      config.routes.some(r => routeMatches(intent, r))
    );

    // Filter: gas-aware profitability (async per intent)
    const profitable: BridgeIntent[] = [];
    for (const intent of routeFiltered) {
      if (await isProfitable(intent)) profitable.push(intent);
    }

    // Sort by net profit descending (fee - estimated gas)
    profitable.sort((a, b) => b.feeAmount - a.feeAmount);

    logger.debug('Polled open intents', {
      total: all.length,
      routeMatch: routeFiltered.length,
      profitable: profitable.length,
    });

    return profitable;
  } catch (err) {
    logger.error('Error fetching open intents', { error: (err as Error).message });
    return [];
  }
}
