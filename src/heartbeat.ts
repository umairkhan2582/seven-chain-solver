import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { config } from './config.js';
import { logger } from './logger.js';
import { getBlockNumber as getBnbBlock } from './chains/bnb.js';
import { getBlockNumber as getSevenBlock } from './chains/seven.js';

let wallet: ethers.Wallet | null = null;

function getWallet(): ethers.Wallet {
  if (!wallet) wallet = new ethers.Wallet(config.privateKey);
  return wallet;
}

async function signHeartbeat(): Promise<string> {
  const minute = Math.floor(Date.now() / 60_000);
  return getWallet().signMessage(`SEVEN_BRIDGE_HEARTBEAT:${minute}`);
}

async function sendHeartbeat(): Promise<void> {
  try {
    const [bnbBlock, sevenBlock, signature] = await Promise.all([
      getBnbBlock(),
      getSevenBlock(),
      signHeartbeat(),
    ]);

    const body = {
      solverAddress:  config.solverAddress,
      solverSignature: signature,
      supportedRoutes: config.routes,
      blockHeights: {
        BNB:   bnbBlock,
        SEVEN: sevenBlock,
      },
    };

    const resp = await fetch(`${config.apiUrl}/api/bridge/solver/heartbeat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (resp.ok) {
      logger.debug('Heartbeat sent', { bnbBlock, sevenBlock });
    } else {
      const text = await resp.text();
      logger.warn('Heartbeat rejected', { status: resp.status, body: text });
    }
  } catch (err) {
    logger.error('Heartbeat failed', { error: (err as Error).message });
  }
}

export function startHeartbeat(): void {
  logger.info('Starting heartbeat', { intervalMs: config.heartbeatIntervalMs });
  sendHeartbeat();
  setInterval(sendHeartbeat, config.heartbeatIntervalMs);
}
