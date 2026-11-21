import { ethers } from 'ethers';
import { config } from '../config.js';
import { logger } from '../logger.js';

const BSC_RPC    = config.rpcUrls['BNB'];
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

/**
 * Send BNB or BEP-20 USDT on BSC.
 * Returns the tx hash of the delivery transaction.
 */
export async function sendTokens(
  token: string,
  to: string,
  amount: number,
  privateKey: string,
): Promise<string> {
  const p       = provider();
  const wallet  = new ethers.Wallet(privateKey, p);
  const feeData = await p.getFeeData();
  const gasPrice = feeData.gasPrice ?? ethers.parseUnits('5', 'gwei');

  if (token.toUpperCase() === 'USDT') {
    const contract  = new ethers.Contract(USDT_BEP20, ERC20_ABI, wallet);
    const decimals  = await contract.decimals() as number;
    const amountRaw = ethers.parseUnits(amount.toFixed(decimals), decimals);
    const tx = await contract.transfer(to, amountRaw, {
      gasPrice,
      gasLimit: 65_000n,
    });
    logger.info('BNB: USDT delivery tx sent', { txHash: tx.hash, to, amount });
    await tx.wait(1);
    return tx.hash;
  }

  // Native BNB
  const amountWei = ethers.parseEther(amount.toFixed(18));
  const tx = await wallet.sendTransaction({
    to,
    value:    amountWei,
    gasPrice,
    gasLimit: 21_000n,
  });
  logger.info('BNB: BNB delivery tx sent', { txHash: tx.hash, to, amount });
  await tx.wait(1);
  return tx.hash;
}

export async function getBlockNumber(): Promise<number | null> {
  try {
    return await provider().getBlockNumber();
  } catch {
    return null;
  }
}

/** Estimate gas cost in BNB for a standard BSC transfer at current gas prices */
export async function estimateGasCostBnb(): Promise<number> {
  try {
    const feeData  = await provider().getFeeData();
    const gasPrice = feeData.gasPrice ?? ethers.parseUnits('5', 'gwei');
    const gasLimit = 65_000n;
    return parseFloat(ethers.formatEther(gasPrice * gasLimit));
  } catch {
    return 0.0003; // fallback estimate ~$0.20 at $600/BNB
  }
}
