<div align="center">

  <img src="https://theseven.meme/logo.png" width="100" alt="Seven Chain" />

  # ⚡ seven-chain-solver

  **Run a Seven Chain Bridge Solver — Fill Cross-Chain Intents, Earn 0.0004 BNB Per Relay**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
  [![Chain ID](https://img.shields.io/badge/Chain%20ID-70007-FFD700?style=for-the-badge&logo=ethereum&logoColor=black)](https://theseven.meme)
  [![Version](https://img.shields.io/badge/Version-2.0.1-orange?style=for-the-badge)](CHANGELOG.md)
  [![Status](https://img.shields.io/badge/Mainnet-Live-brightgreen?style=for-the-badge)](https://theseven.meme)
  [![GitHub Topic](https://img.shields.io/badge/Topic-seven--chain-yellow?style=for-the-badge)](https://github.com/topics/seven-chain)

  [**Platform**](https://theseven.meme) · [**Block Explorer**](https://theseven.meme/blockchain/explorer) · [**Bridge**](https://theseven.meme/bridge) · [**Become a Validator**](https://theseven.meme/become-validator) · [**Telegram**](https://t.me/SevenBlockChain)

</div>

---

## What is a Bridge Solver?

A **solver** is a permissionless relay node that watches the Seven Chain bridge for pending cross-chain transfer intents — assets a user has locked on BNB Chain but not yet received on Seven Chain. When a solver detects a claimable intent, it:

1. **Verifies** the source-chain lock on BNB Chain
2. **Submits** a settlement proof to the V3 Bridge contract on Seven Chain
3. **Releases** the bridged assets (sBNB or sUSDT) to the recipient on Seven Chain
4. **Collects** the solver fee automatically — **0.0004 BNB per settled intent**, paid in the same transaction

**No permission required. No staking. No approval.** You need a wallet funded with BNB (for gas on BNB Chain) and a running Node.js process. That's it.

---

## How the Relay Fee Works

Seven Chain uses a **micro-relay-fee** model instead of traditional gas auctions. Here is the exact flow:

```
User locks BNB on BNB Chain
        │
        ▼
Bridge intent created (open, waiting for a solver)
        │
        ▼
Your solver detects it (polls every 3 seconds)
        │
        ▼
Solver verifies source-chain lock
        │
        ▼
Solver submits settlement proof → V3 contract on Seven Chain (Chain ID 70007)
        │
        ├─→ User receives sBNB / sUSDT on Seven Chain ✅
        └─→ Solver receives 0.0004 BNB automatically ✅
```

- **Fee source:** Bridge relayer reserve (protocol-funded, not user-paid on top)
- **Fee token:** BNB (paid on BNB Chain)
- **Fee per intent:** 0.0004 BNB — fixed, no bidding, no competition
- **Claim method:** Automatic — included in the settlement transaction itself
- **Gas cost:** ~0.00003 BNB per settlement on BSC — net profit margin is very high

There are no gas wars because the fee is fixed and automatic. Every solver who reaches the intent first wins the fee — first-to-settle wins.

---

## Quick Start

### Prerequisites

- Node.js 20+
- A wallet funded with BNB (for settlement gas on BNB Chain)
- ~$2–5 worth of BNB to start (covers many settlements before needing a top-up)

### Install & Run

```bash
# 1. Clone
git clone https://github.com/umairkhan2582/seven-chain-solver
cd seven-chain-solver

# 2. Install
npm install

# 3. Configure
cp config.example.json config.json
# Add your wallet private key to config.json

# 4. Run
npm start
# Solver starts polling for open intents immediately
```

### Docker (Recommended for Production)

```bash
docker-compose up -d
```

The Docker image handles automatic restarts so your solver stays online 24/7 and never misses a claimable intent.

---

## Configuration

Edit `config.json` after copying from `config.example.json`:

```json
{
  "sevenChain": {
    "rpc": "https://theseven.meme/api/seven-chain/jsonrpc",
    "chainId": 70007,
    "bridgeContract": "0x968A78d10C7A8b05822FA4ED2F6ECC46a9102afE"
  },
  "bnbChain": {
    "rpc": "https://bsc-dataseed.binance.org/",
    "chainId": 56,
    "bridgeContract": "0x41A70A6bE222174D8369A90fE91017E8Fb74606f"
  },
  "solver": {
    "privateKey": "YOUR_PRIVATE_KEY_HERE",
    "pollIntervalMs": 3000,
    "maxGasPrice": "5000000000"
  }
}
```

**Security note:** Never commit `config.json` to version control. The `.gitignore` already excludes it.

---

## Bridge Contract — V3 (Non-Upgradeable)

| Network | Contract Address | Role |
|---|---|---|
| **BNB Chain** | `0x41A70A6bE222174D8369A90fE91017E8Fb74606f` | Source lock — user deposits here |
| **Seven Chain (ID 70007)** | `0x968A78d10C7A8b05822FA4ED2F6ECC46a9102afE` | Receiver — solver submits proof here |

The V3 contract is **non-upgradeable** — no admin key, no pause function, no upgrade proxy. The bytecode is final. Security is enforced by code, not a multisig.

---

## Architecture

```
BNB Chain (Chain ID 56)          Your Solver              Seven Chain (ID 70007)
         │                           │                              │
         │   poll open intents ◄─────┤                              │
         │                           │                              │
         │   verify lock tx ─────────►                              │
         │                           │                              │
         │                           │   submit proof + claim ─────►│
         │                           │                              │
         │                           │                              ├─► user receives sBNB/sUSDT
         │                           │◄─────────────────────────────┤
         │                           │   solver fee (0.0004 BNB)    │
```

### API Endpoints Used by Solver

| Endpoint | Method | Description |
|---|---|---|
| `/api/bridge/intents/open` | GET | Poll for pending, unresolved bridge intents |
| `/api/bridge/submit` | POST | Submit settlement proof + claim solver fee |
| `/api/bridge/status/:id` | GET | Check status of a specific intent |

---

## Earnings Potential

| Metric | Value |
|---|---|
| Fee per settled intent | 0.0004 BNB |
| Gas cost per settlement (BSC) | ~0.00003 BNB |
| Net profit per intent | ~0.00037 BNB |
| Poll interval | 3 seconds (configurable) |

As bridge volume grows, solver income scales proportionally. Running this alongside a [validator node](https://github.com/umairkhan2582/seven-chain-node) on the same server gives you both SEVEN block rewards and BNB relay fees.

---

## Become a Validator (Optional — Stack Your Earnings)

Running this solver alongside a [Seven Chain validator node](https://github.com/umairkhan2582/seven-chain-node) gives you two income streams from one server:

| Stream | Token | Source |
|---|---|---|
| Block rewards | SEVEN (0.0003 per block) | Sealing blocks as a validator |
| Relay fees | BNB (0.0004 per intent) | Settling bridge intents as a solver |
| Staking bonus | SEVEN multiplier (1×–3×) | Staking SEVEN as a validator |

Seven Chain is in early launch — apply as a genesis validator now at [theseven.meme/become-validator](https://theseven.meme/become-validator).

---

## Network Details

| Parameter | Value |
|---|---|
| **Network Name** | Seven Chain |
| **Chain ID** | 70007 |
| **RPC URL** | `https://theseven.meme/api/seven-chain/jsonrpc` |
| **Currency Symbol** | SEVEN |
| **Block Explorer** | https://theseven.meme/blockchain/explorer |

---

## Seven Chain Ecosystem

| Repo | Description |
|---|---|
| [**sevenchain**](https://github.com/umairkhan2582/sevenchain) | Developer hub — network config, Hardhat/Foundry quickstart, API docs |
| [**seven-chain-node**](https://github.com/umairkhan2582/seven-chain-node) | Validator node client — seal blocks, earn SEVEN block rewards |
| [**seven-chain-solver**](https://github.com/umairkhan2582/seven-chain-solver) | ← You are here — bridge solver client |
| [**seven-creator-kit**](https://github.com/umairkhan2582/seven-creator-kit) | Token launch toolkit — deploy meme tokens, migrate from pump.fun/four.meme |
| [**seven-gaming-sdk**](https://github.com/umairkhan2582/seven-gaming-sdk) | Gaming SDK — 1s finality on-chain games, session keys, Unreal Engine plugin |

All repositories: [`github.com/topics/seven-chain`](https://github.com/topics/seven-chain)

---

## Links

| Resource | URL |
|---|---|
| Platform | https://theseven.meme |
| Bridge UI | https://theseven.meme/bridge |
| Block Explorer | https://theseven.meme/blockchain/explorer |
| Become a Validator | https://theseven.meme/become-validator |
| Staking | https://theseven.meme/staking |
| Buy SEVEN | https://theseven.meme/spot/seven |
| Developer Hub | https://theseven.meme/developers |
| Whitepaper | https://theseven.meme/whitepaper |
| Telegram | https://t.me/SevenBlockChain |
| Twitter / X | [@thesevendotmeme](https://x.com/thesevendotmeme) |

---

## License

MIT
