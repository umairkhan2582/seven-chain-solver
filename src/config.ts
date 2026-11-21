import 'dotenv/config';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { ethers } from 'ethers';

export interface RouteConfig {
  fromChain: string;
  fromToken: string;
  toChain: string;
  toToken: string;
}

export interface SolverConfig {
  apiUrl: string;
  solverAddress: string;
  privateKey: string;
  solverName?: string;
  country?: string;
  minProfitThreshold: number;
  claimTimeoutMs: number;
  pollIntervalMs: number;
  heartbeatIntervalMs: number;
  liquidityReserve: number;
  routes: RouteConfig[];
  rpcUrls: Record<string, string>;
  tokenContracts?: Record<string, string>;
  logLevel: string;
  logFormat: 'pretty' | 'json';
}

type PublicConfig = Omit<SolverConfig, 'privateKey'>;

function readPrivateKey(): string {
  const keyFile = process.env.SOLVER_PRIVATE_KEY_FILE || path.resolve(process.cwd(), 'secrets/solver_private_key');
  if (!existsSync(keyFile)) {
    throw new Error(`Solver signing key file not found at ${keyFile}. Provide it through a private file or container secret; never put it in config.json.`);
  }
  const value = readFileSync(keyFile, 'utf8').trim();
  const normalized = value.startsWith('0x') ? value : `0x${value}`;
  if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
    throw new Error('Solver signing key file must contain one 32-byte hexadecimal key.');
  }
  return normalized;
}

function loadConfig(): SolverConfig {
  const configPath = path.resolve(process.cwd(), 'config.json');
  if (!existsSync(configPath)) {
    throw new Error('config.json not found. Copy config.example.json to config.json and fill the non-secret settings.');
  }

  let raw: Partial<PublicConfig>;
  try {
    raw = JSON.parse(readFileSync(configPath, 'utf8')) as Partial<PublicConfig>;
  } catch (e) {
    throw new Error(`config.json is not valid JSON: ${(e as Error).message}`);
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('config.json must contain a JSON object.');
  if (typeof raw.apiUrl !== 'string' || !raw.apiUrl) throw new Error('config.json: apiUrl is required for the current intent coordination API.');
  if (typeof raw.solverAddress !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(raw.solverAddress)) {
    throw new Error('config.json: solverAddress must be a 20-byte 0x-prefixed address.');
  }
  if (!Array.isArray(raw.routes) || raw.routes.length === 0) throw new Error('config.json: routes array must contain at least one verified route.');
  for (const route of raw.routes) {
    if (!route || typeof route.fromChain !== 'string' || typeof route.fromToken !== 'string' || typeof route.toChain !== 'string' || typeof route.toToken !== 'string') {
      throw new Error('config.json: each route needs string fromChain, fromToken, toChain, and toToken fields.');
    }
  }
  if (!raw.rpcUrls || typeof raw.rpcUrls !== 'object' || Array.isArray(raw.rpcUrls)) {
    throw new Error('config.json: rpcUrls is required; use operator-selected endpoints rather than a hard-coded default.');
  }

  for (const route of raw.routes) {
    for (const [chain, token] of [[route.fromChain, route.fromToken], [route.toChain, route.toToken]]) {
      if (chain.toUpperCase() === 'SEVEN' && token.toUpperCase() !== 'SEVEN') {
        const address = raw.tokenContracts?.[token.toUpperCase()];
        if (typeof address !== 'string' || !ethers.isAddress(address)) {
          throw new Error(`config.json: tokenContracts.${token.toUpperCase()} must contain a verified contract address for the configured route.`);
        }
      }
    }
  }

  for (const chain of new Set(raw.routes.flatMap(route => [route.fromChain.toUpperCase(), route.toChain.toUpperCase()]))) {
    const endpoint = raw.rpcUrls[chain];
    if (typeof endpoint !== 'string' || !endpoint) throw new Error(`config.json: rpcUrls.${chain} is required for the configured routes.`);
    let parsed: URL;
    try { parsed = new URL(endpoint); } catch { throw new Error(`config.json: rpcUrls.${chain} must be an absolute HTTP(S) URL.`); }
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error(`config.json: rpcUrls.${chain} must use HTTP or HTTPS.`);
  }

  let apiUrl: URL;
  try { apiUrl = new URL(raw.apiUrl); } catch { throw new Error('config.json: apiUrl must be an absolute HTTP(S) URL.'); }
  if (!['http:', 'https:'].includes(apiUrl.protocol)) throw new Error('config.json: apiUrl must use HTTP or HTTPS.');

  const privateKey = readPrivateKey();
  const derivedAddress = new ethers.Wallet(privateKey).address.toLowerCase();
  if (derivedAddress !== raw.solverAddress.toLowerCase()) {
    throw new Error('Solver key does not match solverAddress in config.json. No key was logged.');
  }

  return {
    ...raw,
    apiUrl: raw.apiUrl.replace(/\/$/, ''),
    solverAddress: raw.solverAddress.toLowerCase(),
    privateKey,
    pollIntervalMs: raw.pollIntervalMs ?? 10_000,
    heartbeatIntervalMs: raw.heartbeatIntervalMs ?? 60_000,
    claimTimeoutMs: raw.claimTimeoutMs ?? 170_000,
    minProfitThreshold: raw.minProfitThreshold ?? 0,
    liquidityReserve: raw.liquidityReserve ?? 0.1,
    logLevel: raw.logLevel ?? 'info',
    logFormat: (raw.logFormat ?? 'pretty') as 'pretty' | 'json',
    routes: raw.routes,
    rpcUrls: raw.rpcUrls,
  } satisfies SolverConfig;
}

export const config = loadConfig();
