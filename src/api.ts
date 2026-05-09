import { BridgeIntent, ClaimResponse, FulfillResponse, OpenIntentsResponse } from './types';

export class SevenBridgeAPI {
  constructor(private readonly base: string) {}

  private async request<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const url = `${this.base}/api${path}`;
    const res = await fetch(url, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json() as any;
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data as T;
  }

  async getOpenIntents(page = 1, limit = 20): Promise<OpenIntentsResponse> {
    return this.request<OpenIntentsResponse>(`/bridge/intents/open?page=${page}&limit=${limit}`);
  }

  async claimIntent(intentId: string, solverAddress: string): Promise<ClaimResponse> {
    return this.request<ClaimResponse>('/bridge/intent/claim', {
      method: 'POST',
      body: JSON.stringify({ intentId, solverAddress }),
    });
  }

  async fulfillIntent(intentId: string, solverAddress: string, destTxHash: string): Promise<FulfillResponse> {
    return this.request<FulfillResponse>('/bridge/intent/fulfill', {
      method: 'POST',
      body: JSON.stringify({ intentId, solverAddress, destTxHash }),
    });
  }

  async sendHeartbeat(solverAddress: string, supportedRoutes: string[], blockHeights: Record<string, number>): Promise<void> {
    await this.request('/bridge/solver/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ solverAddress, supportedRoutes, blockHeights }),
    });
  }

  async registerSolver(name: string, rpcUrl: string, walletAddress: string, country: string): Promise<any> {
    return this.request('/node-register', {
      method: 'POST',
      body: JSON.stringify({ name, rpc_url: rpcUrl, wallet_address: walletAddress, country }),
    });
  }

  async getLeaderboard(): Promise<any[]> {
    return this.request('/bridge/solvers/leaderboard');
  }
}
