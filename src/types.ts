export interface BridgeIntent {
  id: string;
  user_address: string;
  from_chain: string;
  to_chain: string;
  from_token: string;
  to_token: string;
  gross_amount: string;
  fee_amount: string;
  net_amount: string;
  status: 'open' | 'claimed' | 'fulfilled' | 'expired' | 'cancelled';
  solver_address: string | null;
  claim_expires_at: string | null;
  source_lock_tx: string | null;
  dest_delivery_tx: string | null;
  deadline: string;
  created_at: string;
  fulfilled_at: string | null;
}

export interface OpenIntentsResponse {
  intents: BridgeIntent[];
  total: number;
  page: number;
  limit: number;
}

export interface ClaimResponse {
  success: boolean;
  intentId: string;
  claimExpiresAt: string;
  message: string;
}

export interface FulfillResponse {
  success: boolean;
  feeEarned: number;
  sevenTxHash: string;
  message: string;
}

export interface SolverConfig {
  apiBase: string;
  solverAddress: string;
  solverName: string;
  country: string;
  rpcUrl: string;
  minFeeThreshold: number;
  pollIntervalMs: number;
  supportedChains: string[];
  supportedTokens: string[];
}
