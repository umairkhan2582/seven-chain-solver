import { ethers } from 'ethers';
import { config } from '../config.js';
import { logger } from '../logger.js';

const BSC_RPC  = config.rpcUrls['BNB'] ?? 'https://bsc-dataseed.binance.org/';
const USDT_BEP20 = '0x55d398326f99059fF775485246999027B3197955';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

let _provider: ethers.JsonRpcProvider | null = null;
function provider(): ethers.JsonRpcProvider {
  if (!_provider) _provider = new ethers.JsonRpcProvider(BSC_RPC);
  return _provider;
}

export async function checkBnbBalance(address: string): Promise<number> {
  try {
    const raw = await provider().getBalance(address);
    return parseFloat(ethers.formatEther(raw));
  } catch (err) {
    logger.error('BNB: checkBnbBalance failed', { error: (err as Error).message });
    return 0;
  }
}

export async function checkUsdtBalance(address: string): Promise<number> {
  try {
    const contract = new ethers.Contract(USDT_BEP20, ERC20_ABI, provider());
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(address) as Promise<bigint>,
      contract.decimals() as Promise<number>,
    ]);
    return parseFloat(ethers.formatUnits(raw, decimals));
  } catch (err) {
    logger.error('BNB: checkUsdtBalance failed', { error: (err as Error).message });
    return 0;
  }
}

export async function checkBalance(token: string, address: string): Promise<number> {
  return token.toUpperCase() === 'USDT'
    ? checkUsdtBalance(address)
    : checkBnbBalance(address);
}

export async function getBlockNumber(): Promise<number | null> {
  try {
    return await provider().getBlockNumber();
  } catch {
    return null;
  }
}
