import fetch from 'node-fetch';
import { config, type RouteConfig } from './config.js';
import { logger } from './logger.js';

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

function isProfitable(intent: BridgeIntent): boolean {
  return intent.feeAmount >= config.minProfitThreshold;
}

function isExpiringSoon(intent: BridgeIntent): boolean {
  // Skip intents that expire within 3 minutes (not enough time to fill)
  const msLeft = intent.deadline - Date.now();
  return msLeft < 3 * 60 * 1000;
}

export async function fetchOpenIntents(): Promise<BridgeIntent[]> {
  const url = `${config.apiUrl}/api/bridge/intents/open`;
  try {
    const resp = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!resp.ok) {
      logger.warn('Open intents fetch failed', { status: resp.status, url });
      return [];
    }
    const data = await resp.json() as { intents?: BridgeIntent[] };
    const all = data.intents ?? [];

    const candidates = all.filter(intent =>
      !isExpiringSoon(intent) &&
      isProfitable(intent) &&
      config.routes.some(r => routeMatches(intent, r))
    );

    // Sort by fee/amount ratio descending (most profitable first)
    candidates.sort((a, b) => (b.feeAmount / b.grossAmount) - (a.feeAmount / a.grossAmount));

    logger.debug('Polled open intents', {
      total: all.length,
      candidates: candidates.length,
    });

    return candidates;
  } catch (err) {
    logger.error('Error fetching open intents', { error: (err as Error).message });
    return [];
  }
}
