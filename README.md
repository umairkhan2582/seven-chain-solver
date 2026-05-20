# Seven Chain Solver v2.0

> **Open-source bridge solver for Seven Chain (Chain ID: 70007)**
> Claim bridge intents, settle cross-chain transfers, and earn solver fees — permissionlessly.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Chain ID](https://img.shields.io/badge/Chain%20ID-70007-blue)](https://theseven.meme)
[![Solvers Active](https://img.shields.io/badge/Solvers-Active-green)](https://theseven.meme/staking)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange)](CHANGELOG.md)

---

## 🚨 v2.0 Major Update — May 2026

This release brings significant improvements to bridge settlement, validator coordination, and chain stability. See [CHANGELOG.md](CHANGELOG.md) and [UPDATES.md](UPDATES.md) for the full breakdown.

**Key highlights:**
- Dynamic price engine — SEVEN price now moves on every buy/sell (AMM-style impact)
- Block reward system hardened — only real user transactions trigger rewards
- Validator threshold raised to **9 active validators** for mainnet consensus
- V3 Bridge contract deployed at `0x41A70A6bE222174D8369A90fE91017E8Fb74606f`
- Real-time trade settlement with on-chain proof storage

---

## What is a Solver?

A solver is a permissionless participant that watches the Seven Chain bridge for pending **intent requests** — cross-chain transfers that users have submitted but not yet settled. When a solver detects a claimable intent, it:

1. Verifies the intent on the source chain (BNB Chain / Ethereum)
2. Submits the settlement proof to the V3 Bridge contract on Seven Chain
3. Releases funds to the recipient on Seven Chain
4. Collects the solver fee (paid by the bridge protocol from the relayer reserve)

Anyone can run a solver. No permission or staking required. You only need an RPC endpoint and a funded hot wallet.

---

## Bridge Contract — V3

| Network | Contract Address |
|---|---|
| **Seven Chain (ID 70007)** | `0x41A70A6bE222174D8369A90fE91017E8Fb74606f` |
| BNB Chain (source) | Detect via `BridgeInitiated` events on BSC |

The V3 contract is **non-upgradeable**. The bytecode at this address is final. There is no admin key, no pause function, and no upgrade proxy. Solvers interact with it directly.

**Why non-upgradeable?**
A bridge contract with an upgrade key is a honeypot. V3 removes that risk entirely — the security model is enforced by the code itself, not by a multisig.

---

## Validator Threshold

Seven Chain uses a BFT-style consensus with a dynamic validator set. The current threshold is:

> **9 validators required** for mainnet-grade block finality

There are currently 8 active validators. **One more validator slot is open.**

Validators stake SEVEN tokens to join the active set and earn block rewards proportional to their stake. If you want to become a validator:

- **Stake SEVEN:** https://theseven.meme/staking
- **Buy SEVEN:** https://theseven.meme/spot/seven
- **Become a Validator:** https://theseven.meme/become-validator

---

## Quick Start

### Prerequisites

- Node.js 18+
- A wallet with some BNB (for gas on BNB Chain side) or SEVEN (for gas on Seven Chain)
- RPC access to Seven Chain

### Install

```bash
git clone https://github.com/umairkhan2582/seven-chain-solver
cd seven-chain-solver
npm install
cp config.example.json config.json
```

### Configure

Edit `config.json`:

```json
{
  "sevenChain": {
    "rpc": "https://theseven.meme/api/seven-chain/jsonrpc",
    "chainId": 70007,
    "bridgeContract": "0x41A70A6bE222174D8369A90fE91017E8Fb74606f"
  },
  "bnbChain": {
    "rpc": "https://bsc-dataseed.binance.org/",
    "chainId": 56
  },
  "solver": {
    "privateKey": "YOUR_PRIVATE_KEY_HERE",
    "pollIntervalMs": 3000,
    "maxGasPrice": "5000000000"
  }
}
```

### Run

```bash
npm start
```

Or with Docker:

```bash
docker-compose up -d
```

---

## How Solver Fees Work

| Parameter | Value |
|---|---|
| Fee source | Bridge relayer reserve (funded by protocol) |
| Fee per settled intent | Protocol-defined (see bridge contract) |
| Payment token | SEVEN (on Seven Chain) |
| Claim method | Automatic — included in settlement TX |

---

## Architecture

```
┌─────────────────┐     poll intents      ┌──────────────────────┐
│   BNB Chain     │ ◄──────────────────── │                      │
│  (source txns)  │                       │   Seven Chain Solver  │
└─────────────────┘                       │                      │
                                          │  - Poller (src chain) │
┌─────────────────┐    settle + claim     │  - Settler (dst chain)│
│   Seven Chain   │ ◄──────────────────── │  - Fee claimer        │
│  ID: 70007      │                       │  - Heartbeat monitor  │
│  Bridge V3      │                       └──────────────────────┘
└─────────────────┘
```

---

## Security

- Never commit your private key to this repo
- Use a dedicated hot wallet with only the gas funds it needs
- The V3 bridge contract has been audited for reentrancy — solvers cannot double-claim
- See [SECURITY.md](SECURITY.md) for responsible disclosure policy

---

## Links

| Resource | URL |
|---|---|
| Platform | https://theseven.meme |
| Staking | https://theseven.meme/staking |
| Buy SEVEN | https://theseven.meme/spot/seven |
| Become Validator | https://theseven.meme/become-validator |
| Blockchain Explorer | https://theseven.meme/blockchain/explorer |
| Whitepaper | https://theseven.meme/whitepaper |

---

## License

MIT — see [LICENSE](LICENSE)
