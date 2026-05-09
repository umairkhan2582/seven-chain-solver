import { ethers } from 'ethers';
import { config } from '../config.js';
import { logger } from '../logger.js';

const ETH_RPC    = config.rpcUrls['ETH'] ?? 'https://ethereum.publicnode.com';
const USDT_ERC20 = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // Mainnet USDT

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

let _provider: ethers.JsonRpcProvider | null = null;
function provider(): ethers.JsonRpcProvider {
  if (!_provider) _provider = new ethers.JsonRpcProvider(ETH_RPC);
  return _provider;
}

export async function checkEthBalance(address: string): Promise<number> {
  try {
    const raw = await provider().getBalance(address);
    return parseFloat(ethers.formatEther(raw));
  } catch (err) {
    logger.error('ETH: checkEthBalance failed', { error: (err as Error).message });
    return 0;
  }
}

export async function checkUsdtBalance(address: string): Promise<number> {
  try {
    const contract = new ethers.Contract(USDT_ERC20, ERC20_ABI, provider());
    const [raw, decimals] = await Promise.all([
      contract.balanceOf(address) as Promise<bigint>,
      contract.decimals() as Promise<number>,
    ]);
    return parseFloat(ethers.formatUnits(raw, decimals));
  } catch (err) {
    logger.error('ETH: checkUsdtBalance failed', { error: (err as Error).message });
    return 0;
  }
}

export async function checkBalance(token: string, address: string): Promise<number> {
  return token.toUpperCase() === 'USDT'
    ? checkUsdtBalance(address)
    : checkEthBalance(address);
}

/**
 * Send ETH or ERC-20 USDT on Ethereum mainnet.
 * Returns the tx hash of the delivery transaction.
 */
export async function sendTokens(
  token: string,
  to: string,
  amount: number,
  privateKey: string,
): Promise<string> {
  const p      = provider();
  const wallet = new ethers.Wallet(privateKey, p);
  const feeData = await p.getFeeData();

  if (token.toUpperCase() === 'USDT') {
    const contract = new ethers.Contract(USDT_ERC20, ERC20_ABI, wallet);
    const decimals  = await contract.decimals() as number;
    const amountRaw = ethers.parseUnits(amount.toFixed(decimals), decimals);
    const tx = await contract.transfer(to, amountRaw, {
      maxFeePerGas:         feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      gasLimit:             65_000n,
    });
    logger.info('ETH: USDT delivery tx sent', { txHash: tx.hash, to, amount });
    await tx.wait(1);
    return tx.hash;
  }

  // Native ETH
  const amountWei = ethers.parseEther(amount.toFixed(18));
  const tx = await wallet.sendTransaction({
    to,
    value:                amountWei,
    maxFeePerGas:         feeData.maxFeePerGas,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    gasLimit:             21_000n,
  });
  logger.info('ETH: ETH delivery tx sent', { txHash: tx.hash, to, amount });
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

/** Estimate gas cost in ETH for a standard transfer at current gas prices */
export async function estimateGasCostEth(): Promise<number> {
  try {
    const feeData = await provider().getFeeData();
    const gasPrice = feeData.maxFeePerGas ?? feeData.gasPrice ?? ethers.parseUnits('30', 'gwei');
    const gasLimit = 65_000n; // ERC-20 transfer upper bound
    return parseFloat(ethers.formatEther(gasPrice * gasLimit));
  } catch {
    return 0.003; // fallback estimate ~$10 at $3000/ETH
  }
}
