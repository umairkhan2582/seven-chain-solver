import fetch from 'node-fetch';
import { ethers } from 'ethers';
import { config } from '../config.js';
import { logger } from '../logger.js';

const SEVEN_RPC = config.rpcUrls['SEVEN'] ?? 'https://theseven.meme/api/seven-chain/jsonrpc';

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const resp = await fetch(SEVEN_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
  });
  const data = await resp.json() as { result?: unknown; error?: { message: string } };
  if (data.error) throw new Error(`Seven Chain RPC error: ${data.error.message}`);
  return data.result;
}

export async function getBlockNumber(): Promise<number | null> {
  try {
    const result = await rpcCall('eth_blockNumber', []);
    return parseInt(String(result), 16);
  } catch {
    return null;
  }
}

export async function checkBalance(token: string, address: string): Promise<number> {
  try {
    const result = await rpcCall('eth_getBalance', [address, 'latest']);
    const wei = BigInt(String(result));
    return parseFloat(ethers.formatEther(wei));
  } catch (err) {
    logger.error('SEVEN: checkBalance failed', { token, error: (err as Error).message });
    return 0;
  }
}

/**
 * Send tokens on Seven Chain to a recipient.
 * Returns the tx hash of the delivery transaction.
 */
export async function sendTokens(
  token: string,
  to: string,
  amount: number,
  privateKey: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(SEVEN_RPC);
  const wallet   = new ethers.Wallet(privateKey, provider);

  const amountWei = ethers.parseEther(amount.toFixed(18));
  const nonce     = await provider.getTransactionCount(wallet.address);
  const feeData   = await provider.getFeeData();

  const tx = await wallet.sendTransaction({
    to,
    value:    amountWei,
    nonce,
    gasLimit: 21_000n,
    gasPrice: feeData.gasPrice ?? ethers.parseUnits('5', 'gwei'),
  });

  logger.info('SEVEN: delivery tx sent', { txHash: tx.hash, to, amount, token });
  await tx.wait(1);
  return tx.hash;
}
