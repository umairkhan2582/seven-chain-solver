import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  logLevel: string;
  logFormat: 'pretty' | 'json';
}

function loadConfig(): SolverConfig {
  const configPath = path.resolve(process.cwd(), 'config.json');

  if (!existsSync(configPath)) {
    console.error(
      `\n❌  config.json not found.\n` +
      `   Copy config.example.json → config.json and fill in your values:\n` +
      `   cp config.example.json config.json\n`
    );
    process.exit(1);
  }

  let raw: Partial<SolverConfig>;
  try {
    raw = JSON.parse(readFileSync(configPath, 'utf8'));
  } catch (e) {
    console.error('❌  config.json is not valid JSON:', (e as Error).message);
    process.exit(1);
  }

  if (!raw.apiUrl)         throw new Error('config.json: apiUrl is required');
  if (!raw.solverAddress)  throw new Error('config.json: solverAddress is required');
  if (!raw.privateKey)     throw new Error('config.json: privateKey is required');
  if (!raw.routes?.length) throw new Error('config.json: routes array must have at least one entry');

  // Apply defaults — no duplicate keys; spread comes first, overrides come after
  return {
    ...raw,
    apiUrl:              raw.apiUrl!.replace(/\/$/, ''),
    solverAddress:       raw.solverAddress!.toLowerCase(),
    privateKey:          raw.privateKey!,
    pollIntervalMs:      raw.pollIntervalMs      ?? 10_000,
    heartbeatIntervalMs: raw.heartbeatIntervalMs ?? 60_000,
    claimTimeoutMs:      raw.claimTimeoutMs      ?? 170_000,
    minProfitThreshold:  raw.minProfitThreshold  ?? 0,
    liquidityReserve:    raw.liquidityReserve    ?? 0.1,
    logLevel:            raw.logLevel            ?? 'info',
    logFormat:           (raw.logFormat          ?? 'pretty') as 'pretty' | 'json',
    rpcUrls:             raw.rpcUrls             ?? {},
    routes:              raw.routes!,
  } satisfies SolverConfig;
}

export const config = loadConfig();
