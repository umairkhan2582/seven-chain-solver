import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { config } from './config.js';
import { logger } from './logger.js';
import { type BridgeIntent } from './poller.js';
import { sendTokens as sendSevenTokens, checkBalance as checkSevenBalance } from './chains/seven.js';
import { checkBalance as checkBnbBalance } from './chains/bnb.js';

let wallet: ethers.Wallet | null = null;

function getWallet(): ethers.Wallet {
  if (!wallet) wallet = new ethers.Wallet(config.privateKey);
  return wallet;
}

async function signMessage(msg: string): Promise<string> {
  return getWallet().signMessage(msg);
}

async function apiPost(path: string, body: object): Promise<{ ok: boolean; data: any }> {
  const resp = await fetch(`${config.apiUrl}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  const data = await resp.json();
  return { ok: resp.ok, data };
}

// ─── Step 1: Check we have enough liquidity on destination chain ──────────────

async function hasLiquidity(intent: BridgeIntent): Promise<boolean> {
  const required = intent.netAmount * (1 + config.liquidityReserve);
  const balance  = await checkSevenBalance(intent.toToken, config.solverAddress);
  if (balance < required) {
    logger.warn('Insufficient liquidity — skipping intent', {
      intentId: intent.id,
      required,
      available: balance,
      token: intent.toToken,
    });
    return false;
  }
  return true;
}

// ─── Step 2: Claim the intent ─────────────────────────────────────────────────

async function claimIntent(intent: BridgeIntent): Promise<boolean> {
  const sig = await signMessage(`SEVEN_BRIDGE_CLAIM:${intent.id}`);
  const { ok, data } = await apiPost('/api/bridge/intent/claim', {
    intentId:       intent.id,
    solverAddress:  config.solverAddress,
    solverSignature: sig,
  });

  if (!ok) {
    if (data?.error?.includes('already claimed') || data?.error?.includes('409')) {
      logger.debug('Intent already claimed by another solver', { intentId: intent.id });
    } else {
      logger.warn('Claim failed', { intentId: intent.id, error: data?.error });
    }
    return false;
  }

  logger.info('Intent claimed', {
    intentId:   intent.id,
    amount:     intent.grossAmount,
    fromChain:  intent.fromChain,
    fee:        intent.feeAmount,
  });
  return true;
}

// ─── Step 3: Deliver tokens on Seven Chain ────────────────────────────────────

async function deliverTokens(intent: BridgeIntent): Promise<string | null> {
  try {
    const txHash = await sendSevenTokens(
      intent.toToken,
      intent.userAddress,
      intent.netAmount,
      config.privateKey,
    );
    logger.info('Delivery complete', {
      intentId: intent.id,
      destTxHash: txHash,
      to: intent.userAddress,
      amount: intent.netAmount,
    });
    return txHash;
  } catch (err) {
    logger.error('Delivery failed', { intentId: intent.id, error: (err as Error).message });
    return null;
  }
}

// ─── Step 4: Submit proof and collect fee ────────────────────────────────────

async function fulfillIntent(intent: BridgeIntent, destTxHash: string): Promise<boolean> {
  const sig = await signMessage(`SEVEN_BRIDGE_FULFILL:${intent.id}:${destTxHash}`);
  const { ok, data } = await apiPost('/api/bridge/intent/fulfill', {
    intentId:        intent.id,
    solverAddress:   config.solverAddress,
    solverSignature: sig,
    destTxHash,
  });

  if (!ok) {
    logger.error('Fulfill failed', { intentId: intent.id, error: data?.error });
    return false;
  }

  logger.info('Intent fulfilled — fee earned', {
    intentId:  intent.id,
    feeEarned: data?.feeEarned ?? intent.feeAmount,
    token:     intent.toToken,
  });
  return true;
}

// ─── Step 5: Release if we can't deliver ─────────────────────────────────────

async function releaseIntent(intentId: string): Promise<void> {
  try {
    const sig = await signMessage(`SEVEN_BRIDGE_CANCEL:${intentId}`);
    await apiPost('/api/bridge/intent/cancel', {
      intentId,
      solverAddress:   config.solverAddress,
      solverSignature: sig,
    });
    logger.info('Intent released back to open', { intentId });
  } catch (err) {
    logger.warn('Could not release intent', { intentId, error: (err as Error).message });
  }
}

// ─── Main: process one intent end-to-end ─────────────────────────────────────

const inProgress = new Set<string>();

export async function processIntent(intent: BridgeIntent): Promise<void> {
  if (inProgress.has(intent.id)) return;
  inProgress.add(intent.id);

  try {
    if (!(await hasLiquidity(intent))) return;
    if (!(await claimIntent(intent)))  return;

    const destTxHash = await deliverTokens(intent);
    if (!destTxHash) {
      await releaseIntent(intent.id);
      return;
    }

    await fulfillIntent(intent, destTxHash);
  } finally {
    inProgress.delete(intent.id);
  }
}
