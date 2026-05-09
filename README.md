# Seven Chain Solver

An open-source solver client for the [Seven Chain Bridge](https://theseven.meme). Run this to compete for bridge intents and earn **0.3% fees** on every fill.

## What Is a Solver?

The Seven Chain Bridge uses an **intent-based architecture**:

1. A user submits a bridge intent (e.g. "bridge 1 BNB → Seven Chain")
2. Open intents are published to a public API
3. **Solvers** (like you) race to claim and fill the intent
4. The first solver to deliver tokens on the destination chain earns the fee
5. The bridge platform verifies delivery and credits the fee to the solver's balance

The more solvers competing, the faster fills happen and the better the experience for users.

## Hardware Requirements

| Resource | Minimum |
|----------|---------|
| CPU      | 1 vCPU  |
| RAM      | 512 MB  |
| Disk     | 2 GB    |
| Network  | 10 Mbps |
| Cost     | ~$5/mo VPS (e.g. Hetzner CX11, DigitalOcean Droplet) |

## Quick Start

### Option A — Docker (recommended)

```bash
git clone https://github.com/umairkhan2582/seven-chain-solver.git
cd seven-chain-solver
cp config.example.json config.json
# Edit config.json with your wallet address and private key
docker compose up -d
```

### Option B — Node.js directly

```bash
git clone https://github.com/umairkhan2582/seven-chain-solver.git
cd seven-chain-solver
npm install
cp config.example.json config.json
# Edit config.json
npm run build
npm start
```

### Option C — Dev mode (no build step)

```bash
npm install
cp config.example.json config.json
npm run dev
```

## Configuration

Copy `config.example.json` → `config.json` and fill in your values:

```json
{
  "apiUrl": "https://theseven.meme",
  "solverAddress": "0xYOUR_WALLET_ADDRESS",
  "privateKey": "0xYOUR_PRIVATE_KEY",
  "solverName": "My Solver Node",
  "country": "US",
  "minProfitThreshold": 0.001,
  "liquidityReserve": 0.1,
  "routes": [
    { "fromChain": "BNB", "fromToken": "BNB", "toChain": "SEVEN", "toToken": "SEVEN" }
  ],
  "rpcUrls": {
    "BNB": "https://bsc-dataseed.binance.org/",
    "SEVEN": "https://theseven.meme/api/seven-chain/jsonrpc"
  }
}
```

### Config Reference

| Field | Required | Description |
|-------|----------|-------------|
| `apiUrl` | ✅ | Seven platform API base URL |
| `solverAddress` | ✅ | Your wallet address (must match `privateKey`) |
| `privateKey` | ✅ | Your wallet private key (0x-prefixed) |
| `solverName` | ❌ | Display name on the solver leaderboard |
| `country` | ❌ | Your country code (shown on leaderboard) |
| `minProfitThreshold` | ❌ | Minimum fee (in token units) to bother filling. Default: `0` |
| `liquidityReserve` | ❌ | Keep this fraction as a buffer. Default: `0.1` (10%) |
| `pollIntervalMs` | ❌ | How often to poll for intents. Default: `10000` (10s) |
| `heartbeatIntervalMs` | ❌ | How often to send heartbeat. Default: `60000` (60s) |
| `claimTimeoutMs` | ❌ | How long to wait before considering a claim lost. Default: `170000` |
| `routes` | ✅ | Array of routes you support |
| `rpcUrls` | ❌ | RPC URLs per chain. Defaults to public endpoints |
| `logLevel` | ❌ | `debug`, `info`, `warn`, `error`. Default: `info` |
| `logFormat` | ❌ | `pretty` (human) or `json` (machine). Default: `pretty` |

## Supported Routes (Phase 1)

| From Chain | From Token | To Chain | Description |
|------------|-----------|----------|-------------|
| BNB | BNB | SEVEN | Bridge native BNB to Seven Chain |
| BNB | USDT | SEVEN | Bridge BEP-20 USDT to Seven Chain |

More routes will be added in Phase 2 (ETH, SOLANA).

## How Fees Work

- Bridge fee: **0.3%** of the gross amount
- Example: user bridges 10 BNB → solver earns **0.03 BNB**
- Fee is credited to your `seven_usdt` balance on the platform after each successful fill
- View your earnings at: `https://theseven.meme/api/bridge/solvers/leaderboard`

## Solver Lifecycle

```
Poll open intents (every 10s)
       │
       ▼
Filter by your supported routes + min profit
       │
       ▼
Claim top intent (3-min exclusive window)
  → Signs: personal_sign("SEVEN_BRIDGE_CLAIM:<intentId>")
       │
       ▼
Check your liquidity on Seven Chain
       │
       ▼
Deliver tokens to user on Seven Chain
  → Sends tx via Seven Chain JSON-RPC
       │
       ▼
Submit proof + collect fee
  → Signs: personal_sign("SEVEN_BRIDGE_FULFILL:<intentId>:<destTxHash>")
       │
       ▼
Fee credited to your seven_usdt balance ✅
```

If delivery fails, the intent is **released back to open** for another solver to claim.

## Heartbeat

The solver sends a heartbeat every 60 seconds to stay listed as active on the solver registry. The heartbeat includes:
- Your supported routes
- Current block heights from each chain
- A time-bound signature proving you control the wallet

Heartbeat signature: `personal_sign("SEVEN_BRIDGE_HEARTBEAT:<Math.floor(Date.now()/60000)>")`

## Registering Your Solver

To appear on the public solver leaderboard, register your node:

```bash
curl -X POST https://theseven.meme/api/node-register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Solver",
    "rpc_url": "https://your-node-rpc.example.com",
    "wallet_address": "0xYOUR_ADDRESS",
    "country": "US"
  }'
```

## Troubleshooting

**"Insufficient liquidity" warnings**
→ Your Seven Chain wallet doesn't have enough tokens to fill intents. Top up via the platform.

**"Intent already claimed by another solver"**
→ Normal — another solver was faster. The poller will find the next available intent.

**"Heartbeat rejected"**
→ Check your `solverAddress` matches your `privateKey` exactly.

**Solver not appearing on leaderboard**
→ You must have at least one fulfilled intent. The leaderboard only shows solvers who have filled intents.

## API Reference

All endpoints are on `https://theseven.meme`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/bridge/intents/open` | Fetch open intents (sorted by fee) |
| GET | `/api/bridge/intent/:id` | Get intent detail |
| POST | `/api/bridge/intent/claim` | Claim an intent |
| POST | `/api/bridge/intent/fulfill` | Submit proof + collect fee |
| POST | `/api/bridge/intent/cancel` | Release a claimed intent |
| POST | `/api/bridge/solver/heartbeat` | Send liveness heartbeat |
| GET | `/api/bridge/solvers/leaderboard` | View solver rankings |
| POST | `/api/node-register` | Register as a solver node |

## Bridge Contract

The Seven Chain Bridge contract is deployed and verified on BNB Chain:

- **Address:** [`0x17A9740598D817c08Ba44DaA39f2a4ef7F9B3851`](https://bscscan.com/address/0x17A9740598D817c08Ba44DaA39f2a4ef7F9B3851)
- **Verified:** ✅ Sourcify
- **Network:** BNB Smart Chain (chainId 56)

## License

MIT — see [LICENSE](LICENSE)

## Contributing

PRs welcome. Please open an issue first for major changes.

---

Built by [theseven.meme](https://theseven.meme) — the meme token trading platform on Seven Chain.
