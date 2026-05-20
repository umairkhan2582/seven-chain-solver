<div align="center">

  <img src="https://theseven.meme/logo.png" width="80" alt="Seven Chain" />

  # ⚡ seven-chain-solver

  **Run a Seven Chain Bridge Solver — Fill Cross-Chain Intents, Earn 0.3% Fees**

  [![Chain ID](https://img.shields.io/badge/Chain%20ID-70007-yellow?style=for-the-badge)](https://theseven.meme/developers)
  [![Mainnet](https://img.shields.io/badge/Status-Mainnet%20Live-brightgreen?style=for-the-badge)](https://theseven.meme/seven-network)
  [![Fee](https://img.shields.io/badge/Earn-0.3%25%20per%20intent-green?style=for-the-badge)](https://theseven.meme/developers)

  [**Developer Hub**](https://theseven.meme/developers) · [**Block Explorer**](https://theseven.meme/blockchain/explorer) · [**Bridge**](https://theseven.meme/bridge) · [**Telegram**](https://t.me/SevenBlockChain)

  </div>

  ---

  ## What is a Bridge Solver?

  When a user bridges assets from BSC → Seven Chain, they post a **bridge intent**. Solvers compete to fill that intent first. The solver that fills it earns **0.3% of the bridged amount** as a fee.

  | Metric | Value |
  |---|---|
  | **Fee per filled intent** | 0.3% of gross amount |
  | **Supported assets** | BNB, USDT |
  | **Source chain** | Binance Smart Chain (BSC) |
  | **Target chain** | Seven Chain (Chain ID 70007) |
  | **Avg fill time** | < 15 seconds |

  ## Quick Start

  ```bash
  # 1. Clone
  git clone https://github.com/umairkhan2582/seven-chain-solver
  cd seven-chain-solver

  # 2. Install
  npm install

  # 3. Configure
  cp .env.example .env
  # Add BNB_RPC_URL and SOLVER_WALLET_PRIVATE_KEY

  # 4. Run
  npm start
  # Solver watches for open intents and fills them automatically
  ```

  ## How It Works

  1. Solver polls `GET /api/bridge/intents/open` every 10 seconds
  2. For each open intent, solver sends BSC tx to fill the lock
  3. Solver calls `POST /api/bridge/submit` with proof
  4. Platform credits sBNB/sUSDT to the user and **0.3% fee to the solver**

  ```
  User locks BNB on BSC
      → Intent posted on Seven Chain
          → Solver fills intent (fastest wins)
              → User receives sBNB
              → Solver earns 0.3% fee
  ```

  ## Ecosystem

  | Repo | Description |
  |---|---|
  | [**sevenchain**](https://github.com/umairkhan2582/sevenchain) | Developer hub — quickstart, examples, hackathon |
  | [**seven-chain-node**](https://github.com/umairkhan2582/seven-chain-node) | Validator node — seal blocks, earn SEVEN |
  | [**seven-chain-solver**](https://github.com/umairkhan2582/seven-chain-solver) | ← You are here |

  ---

  <div align="center">
  ⚡ <a href="https://theseven.meme">theseven.meme</a> · <a href="https://t.me/SevenBlockChain">Telegram</a>
  </div>
  