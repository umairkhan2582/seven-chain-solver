<div align="center">

  <img src="https://theseven.meme/logo.png" width="80" alt="Seven Chain" />

  # ⚡ seven-chain-solver

  **Run a Seven Chain Bridge Solver — Fill Cross-Chain Intents, Earn Fees**

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
  [![Chain ID](https://img.shields.io/badge/Chain%20ID-70007-yellow?style=for-the-badge)](https://theseven.meme)
  [![Version](https://img.shields.io/badge/Version-2.0.1-orange?style=for-the-badge)](CHANGELOG.md)
  [![Status](https://img.shields.io/badge/Mainnet-Live-brightgreen?style=for-the-badge)](https://theseven.meme)

  [**Platform**](https://theseven.meme) · [**Block Explorer**](https://theseven.meme/blockchain/explorer) · [**Bridge**](https://theseven.meme/bridge) · [**Telegram**](https://t.me/SevenBlockChain)

</div>

---

## What is a Bridge Solver?

A solver is a permissionless participant that watches the Seven Chain bridge for pending **intent requests** — cross-chain transfers users have submitted but not yet settled. When a solver detects a claimable intent, it:

1. Verifies the intent on the source chain (BNB Chain)
2. Submits settlement proof to the V3 Bridge contract on Seven Chain
3. Releases funds to the recipient on Seven Chain
4. Collects the solver fee automatically

Anyone can run a solver. **No permission, no staking required.** You only need an RPC endpoint and a funded wallet.

---

## Bridge Contract — V3

| Network | Contract Address |
|---|---|
| **BNB Chain — source lock** | `0x41A70A6bE222174D8369A90fE91017E8Fb74606f` |
| **Seven Chain ID 70007 — receiver** | `0x968A78d10C7A8b05822FA4ED2F6ECC46a9102afE` |

The V3 contract is **non-upgradeable**. The bytecode is final — no admin key, no pause function, no upgrade proxy. Security is enforced by the code itself, not a multisig.

---

## Quick Start

### Prerequisites
- Node.js 20+
- A wallet funded with BNB (for gas on BNB Chain)

### Install & Run

```bash
# 1. Clone
git clone https://github.com/umairkhan2582/seven-chain-solver
cd seven-chain-solver

# 2. Install
npm install

# 3. Configure
cp config.example.json config.json
# Open config.json and add your wallet private key

# 4. Run
npm start
```

### Docker

```bash
docker-compose up -d
```

---

## Configuration

Edit `config.json` after copying from `config.example.json`:

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

---

## How It Works

1. Solver polls `GET /api/bridge/intents/open` every few seconds
2. For each open intent, solver verifies the source lock on BSC
3. Solver submits `POST /api/bridge/submit` with settlement proof
4. User receives sBNB/sUSDT — solver fee paid automatically

---

## Solver Fees

| Parameter | Value |
|---|---|
| Fee source | Bridge relayer reserve |
| Fee per settled intent | Protocol-defined (see bridge contract) |
| Payment token | SEVEN (on Seven Chain) |
| Claim method | Automatic — included in settlement TX |

---

## Architecture

```
BNB Chain (source)          Seven Chain Solver          Seven Chain (target)
        |                          |                              |
        |<-- poll open intents ----|                              |
        |                          |                              |
        |-- verify lock tx ------->|                              |
        |                          |-- submit proof + claim ----->|
        |                          |                              |-- release funds to user
        |                          |<-- solver fee paid ----------|
```

---

## Becoming a Validator

Seven Chain is **actively growing its validator network**. We are in early launch phase and onboarding validators now — this is the best time to join.

| What you need | Requirement |
|---|---|
| Server | Linux VPS, 2+ vCPU, 4 GB RAM, 60 GB SSD |
| Stake | SEVEN tokens |
| Apply | [theseven.meme/nodes](https://theseven.meme/nodes) |

Validators seal blocks and earn SEVEN rewards proportional to their stake.

- **Buy SEVEN:** https://theseven.meme/spot/seven
- **Apply as Validator:** https://theseven.meme/nodes

---

## Security

- Never commit your private key
- Use a dedicated hot wallet with minimum gas funds
- The V3 bridge contract has been audited for reentrancy — solvers cannot double-claim
- See [SECURITY.md](SECURITY.md) for responsible disclosure

---

## Ecosystem

| Repo | Description |
|---|---|
| [seven-chain-solver](https://github.com/umairkhan2582/seven-chain-solver) | You are here — bridge solver client |
| [seven-chain-node](https://github.com/umairkhan2582/seven-chain-node) | Validator node — seal blocks, earn SEVEN |
| [sevenchain](https://github.com/umairkhan2582/sevenchain) | Developer hub — API docs, quickstart, examples |

---

## Links

| Resource | URL |
|---|---|
| Platform | https://theseven.meme |
| Block Explorer | https://theseven.meme/blockchain/explorer |
| Bridge | https://theseven.meme/bridge |
| Become a Validator | https://theseven.meme/nodes |
| Buy SEVEN | https://theseven.meme/spot/seven |
| Whitepaper | https://theseven.meme/whitepaper |
| Telegram | https://t.me/SevenBlockChain |

---

## License

MIT — see [LICENSE](LICENSE)
