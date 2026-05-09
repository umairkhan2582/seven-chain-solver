import fetch from 'node-fetch';
import { ethers } from 'ethers';
import { config } from '../config.js';
import { logger } from '../logger.js';

const SEVEN_RPC = config.rpcUrls['SEVEN'] ?? 'https://theseven.meme/api/seven-chain/jsonrpc';

/**
 * Token contract addresses on Seven Chain (chain ID 7777).
 * Operators can override these via config.tokenContracts.
 */
const DEFAULT_TOKEN_CONTRACTS: Record<string, string> = {
  SBNB:  '0x0000000000000000000000000000000000000101',
  SUSDT: '0x0000000000000000000000000000000000000102',
};

function tokenContracts(): Record<string, string> {
  return { ...DEFAULT_TOKEN_CONTRACTS, ...(config.tokenContracts ?? {}) };
}

function resolveContract(token: string): string | null {
  return tokenContracts()[token.toUpperCase()] ?? null;
}

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

let _provider: ethers.JsonRpcProvider | null = null;
function provider(): ethers.JsonRpcProvider {
  if (!_provider) _provider = new ethers.JsonRpcProvider(SEVEN_RPC);
  return _provider;
}

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

/**
 * Check balance of a token on Seven Chain.
 * - SEVEN / native: uses eth_getBalance
 * - wBNB, wUSDT, other wrapped tokens: reads ERC-20 balanceOf
 */
export async function checkBalance(token: string, address: string): Promise<number> {
  const tk = token.toUpperCase();
  try {
    const contractAddr = resolveContract(tk);
    if (!contractAddr) {
      // Native SEVEN
      const result = await rpcCall('eth_getBalance', [address, 'latest']);
      const wei = BigInt(String(result));
      return parseFloat(ethers.formatEther(wei));
    }

    // ERC-20 wrapped token
    const contract = new ethers.Contract(contractAddr, ERC20_ABI, provider());
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(address) as Promise<bigint>,
      contract.decimals() as Promise<number>,
    ]);
    return parseFloat(ethers.formatUnits(raw, decimals));
  } catch (err) {
    logger.error('SEVEN: checkBalance failed', { token, error: (err as Error).message });
    return 0;
  }
}

/**
 * Send tokens on Seven Chain.
 * - SEVEN / native: plain ETH-style value transfer
 * - wBNB, wUSDT, other wrapped tokens: ERC-20 transfer() call
 * Returns the delivery tx hash.
 */
export async function sendTokens(
  token: string,
  to: string,
  amount: number,
  privateKey: string,
): Promise<string> {
  const tk           = token.toUpperCase();
  const p            = provider();
  const wallet       = new ethers.Wallet(privateKey, p);
  const feeData      = await p.getFeeData();
  const gasPrice     = feeData.gasPrice ?? ethers.parseUnits('5', 'gwei');
  const contractAddr = resolveContract(tk);

  if (!contractAddr) {
    // Native SEVEN transfer
    const amountWei = ethers.parseEther(amount.toFixed(18));
    const tx = await wallet.sendTransaction({
      to,
      value:    amountWei,
      gasPrice,
      gasLimit: 21_000n,
    });
    logger.info('SEVEN: native delivery tx sent', { txHash: tx.hash, to, amount, token: tk });
    await tx.wait(1);
    return tx.hash;
  }

  // ERC-20 wrapped token transfer (wBNB / wUSDT)
  const contract  = new ethers.Contract(contractAddr, ERC20_ABI, wallet);
  const decimals  = await contract.decimals() as number;
  const amountRaw = ethers.parseUnits(amount.toFixed(decimals), decimals);
  const tx = await contract.transfer(to, amountRaw, { gasPrice, gasLimit: 80_000n });
  logger.info('SEVEN: ERC-20 delivery tx sent', {
    txHash: tx.hash, to, amount, token: tk, contract: contractAddr,
  });
  await tx.wait(1);
  return tx.hash;
}
