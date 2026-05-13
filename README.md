<div align="center">

  ![Seven Chain Bridge Solver](https://raw.githubusercontent.com/umairkhan2582/seven-chain-node/main/images/banner.svg)

  # 🌉 Seven Chain — Bridge Solver

  ### **🟢 BRIDGE NETWORK IS LIVE — BOTH DIRECTIONS — EARN FEES NOW 🟢**

  [![Chain ID](https://img.shields.io/badge/Chain%20ID-70007-22c55e?style=for-the-badge&logo=ethereum)](https://theseven.meme)
  [![Solver Fees](https://img.shields.io/badge/Solver%20Fee-1%25%20Per%20Fill-gold?style=for-the-badge)](https://theseven.meme)
  [![Telegram](https://img.shields.io/badge/Telegram-Join%20Us-2CA5E0?style=for-the-badge&logo=telegram)](https://t.me/thesevenmeme)
  [![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)](LICENSE)

  **Earn passive income by running a bridge solver node on the Seven Chain network.**

  [🌐 Exchange](https://theseven.meme) · [📋 Become a Solver](https://theseven.meme) · [🏆 Leaderboard](https://theseven.meme) · [💬 Telegram](https://t.me/thesevenmeme) · [📞 Contact](#-contact)

  </div>

  ---

  ## 🟢 BRIDGE NETWORK IS LIVE

  > **Seven Chain Bridge launched alongside Mainnet on April 25, 2026.**
  >
  > Solver slots are **OPEN**. Run a solver node and earn 1% on every bridge intent you fill.
  > The earlier you join, the more volume you capture while the network is growing.

  The Seven Chain Bridge is the official cross-chain gateway for [TheSeven.meme](https://theseven.meme). Users bridge tokens between BSC and Seven Chain — in **both directions**. BSC→SEVEN for deposits and SEVEN→BSC for withdrawals. You fill those intents and collect **1% per fill** either way.

  ---

  ## ⚡ START EARNING — ONE COMMAND

  **The fastest way to run your solver:**

  ```bash
  git clone https://github.com/umairkhan2582/seven-chain-solver
  cd seven-chain-solver && npm install && cp .env.example .env
  # Set SOLVER_ADDRESS in .env, then:
  npm run dev
  ```

  > No account creation needed. No web form. Configure your wallet address, start the solver, and it begins polling for intents immediately.

  ---

  ## 💬 JOIN THE SOLVER COMMUNITY

  > **Ready to run a solver? Start here:**

  ### 📣 [Join our Telegram → t.me/thesevenmeme](https://t.me/thesevenmeme)

  Connect with the Seven Chain team and active solvers on Telegram. Get:
  - 🔔 Real-time bridge volume and intent announcements
  - 🛠️ Technical support from the core team
  - 💰 Fee distribution updates and reward announcements
  - 🤝 Direct access to the solver community
  - 📊 Volume data and leaderboard notifications

  ### 📧 Email Us for Full Support

  | Purpose | Email |
  |---------|-------|
  | General & Solver Inquiries | **info@theseven.meme** |
  | Technical Support & Node Help | **support@theseven.meme** |
  | SEVEN OTC Purchases | **info@theseven.meme** |
  | Strategic Partnerships | **info@theseven.meme** |

  > 📧 Email with subject **"Solver Inquiry"** — a team member will reach out personally to guide you through setup and registration.

  ---

  ## 💰 SOLVER EARNINGS — COMPLETE BREAKDOWN

  ### 🔷 How You Earn

  Every bridge intent pays a **1% solver fee** — credited instantly to your Seven Chain wallet in **sUSDT** after each fill. No lockups. No vesting. Instant.

  ```
  User submits bridge intent: 10,000 USDT BNB → Seven Chain
  ├── Net to user:   9,970 USDT   (99.7%)
  └── Your fee:         100 USDT  (1%) ← paid to you instantly
  ```

  ### 🔷 Earnings Potential by Volume

  | Daily Intents Filled | Avg. Intent Size | Daily Fee (1%) | Monthly Earnings |
  |---------------------|-----------------|-----------------|-----------------|
  | 10 intents / day | $1,000 each | **$100 / day** | **~$3,000 / month** |
  | 50 intents / day | $1,000 each | **$500 / day** | **~$15,000 / month** |
  | 20 intents / day | $10,000 each | **$600 / day** | **~$18,000 / month** |
  | 100 intents / day | $10,000 each | **$3,000 / day** | **~$90,000 / month** |

  > 💡 The solver runtime runs 24/7 automatically. Once configured, it claims, fills, and collects fees with no manual intervention.

  ### 🔷 Leaderboard Bonuses

  Top solvers receive **additional rewards** from the platform treasury each month:

  | Rank | Bonus |
  |------|-------|
  | 🥇 #1 Solver | 2× fee multiplier for the month |
  | 🥈 #2 Solver | 1.5× fee multiplier for the month |
  | 🥉 #3 Solver | 1.25× fee multiplier for the month |

  Rankings are by **total sUSDT fees earned** — visible at [theseven.meme](https://theseven.meme).

  ### 🔷 sUSDT Trading Rewards (Stacked)

  Solvers using their wallet to trade on [TheSeven.meme](https://theseven.meme) can **stack trading rewards on top of solver fees** — the same sUSDT incentive pool available to all traders.

  ### 🔷 Airdrop & Incentive Programs

  Active solver nodes are **first in line** for:
  - 🎁 SEVEN token airdrops to long-running solvers
  - 💎 Early governance NFT drops
  - 🏆 Monthly bonus rewards for top-ranked solvers

  ---

  ## 🔄 HOW IT WORKS

  ### 🔀 Supported Routes

  | From Chain | From Token | To Chain | To Token | Direction |
  |------------|------------|----------|----------|-----------|
  | BSC | BNB | Seven Chain | sBNB | BSC → SEVEN |
  | BSC | USDT | Seven Chain | sUSDT | BSC → SEVEN |
  | Seven Chain | sUSDT | BSC | USDT | SEVEN → BSC |
  | Seven Chain | sBNB | BSC | BNB | SEVEN → BSC |

  > Your solver handles all four routes automatically. The config file controls which routes you want to fill.


  ```
  User submits a bridge intent
            │
            ▼
  ┌────────────────────────┐
  │   Intent Queue (API)   │  ← GET /api/bridge/intents/open
  │   Sorted by fee: high  │     (highest fee first)
  └──────────┬─────────────┘
             │
             ▼  Is it profitable? Supported chain/token? Not claimed yet?
  ┌────────────────────────┐
  │   Your solver claims   │  ← POST /api/bridge/intent/claim
  │   it (3-min lock)      │     Other solvers cannot claim while locked
  └──────────┬─────────────┘
             │
             ▼
  ┌────────────────────────┐
  │  Deliver on dest chain │  ← Execute the transaction on destination
  │  (BSC or Seven Chain)  │
  └──────────┬─────────────┘
             │
             ▼
  ┌────────────────────────┐
  │  Submit proof & collect│  ← POST /api/bridge/intent/fulfill
  │  your fee ✅ (sUSDT)   │     Fee credited instantly to your wallet
  └────────────────────────┘
  ```

  ---

  ## ⚙️ CONFIGURATION

  Copy `.env.example` to `.env` and fill in your values:

  ```env
  # Required — your registered wallet address
  SOLVER_ADDRESS=0xYourWalletAddress

  # Your solver display name on the leaderboard
  SOLVER_NAME=My Solver Node

  # Country code for leaderboard display
  SOLVER_COUNTRY=US

  # Seven Chain API (do not change)
  API_BASE=https://theseven.meme

  # Your node's public RPC URL (used for registration)
  SOLVER_RPC_URL=https://your-node.example.com:8545

  # Minimum fee to bother filling (sUSDT) — skip tiny intents
  MIN_FEE_THRESHOLD=0.01

  # How often to poll for open intents (milliseconds)
  POLL_INTERVAL_MS=10000

  # Which source chains to fill
  SUPPORTED_CHAINS=ETH,BNB,SEVEN

  # Which tokens to accept
  SUPPORTED_TOKENS=ETH,BNB,USDT,sBNB,sUSDT
  ```

  ---

  ## 📦 QUICK START — FULL GUIDE

  **Step 1 — Clone and Install**
  ```bash
  git clone https://github.com/umairkhan2582/seven-chain-solver
  cd seven-chain-solver
  npm install
  ```

  **Step 2 — Configure Your Solver**
  ```bash
  cp .env.example .env
  nano .env
  # Set SOLVER_ADDRESS to your wallet address
  ```

  **Step 3 — Run in Development Mode**
  ```bash
  npm run dev
  # Solver starts, registers your node, begins polling for intents
  ```

  **Step 4 — Production (PM2 — Recommended)**
  ```bash
  npm run build
  pm2 start dist/index.js --name seven-solver
  pm2 save
  pm2 startup
  # Solver now runs 24/7 and auto-restarts on reboot
  ```

  **Step 5 — Monitor Your Solver**
  ```bash
  pm2 logs seven-solver     # Live logs
  pm2 monit                 # CPU + memory dashboard
  ```

  **Step 6 — Get Listed on the Leaderboard**

  Email **info@theseven.meme** with subject **"Solver Registration — ${YOUR_ADDRESS}"** and our team will verify and feature your node.

  ---

  ## 🐳 DOCKER (Optional)

  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build
  CMD ["node", "dist/index.js"]
  ```

  ```bash
  docker build -t seven-solver .
  docker run -d --env-file .env --restart=always --name seven-solver seven-solver
  ```

  ---

  ## 📡 FULL API REFERENCE

  All endpoints served at `https://theseven.meme/api`

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | `GET` | `/bridge/intents/open` | List open intents — sorted by fee (highest first) |
  | `GET` | `/bridge/intent/:id` | Get full intent details and current status |
  | `POST` | `/bridge/intent/submit` | Submit a new user bridge intent |
  | `POST` | `/bridge/intent/claim` | Claim an intent (exclusive 3-min window) |
  | `POST` | `/bridge/intent/fulfill` | Submit delivery proof and collect your fee |
  | `POST` | `/bridge/intent/cancel` | Cancel an open intent |
  | `GET` | `/bridge/solvers/leaderboard` | Global solver rankings |
  | `POST` | `/bridge/solver/heartbeat` | Keep your node marked active |
  | `POST` | `/node-register` | Register your solver node |

  ### Example: Get open intents

  ```bash
  curl https://theseven.meme/api/bridge/intents/open
  ```

  ```json
  {
    "intents": [
      {
        "id": "a5b61667-62be-40b2-9998-f25fff16d276",
        "from_chain": "BNB",
        "from_token": "USDT",
        "gross_amount": "10000",
        "fee_amount": "30",
        "net_amount": "9970",
        "status": "open",
        "deadline": "2026-05-09T21:17:24Z"
      }
    ],
    "total": 1
  }
  ```

  ### Example: Claim an intent

  ```bash
  curl -X POST https://theseven.meme/api/bridge/intent/claim \
    -H "Content-Type: application/json" \
    -d '{"intentId":"a5b61667-...","solverAddress":"0xYourAddress"}'
  ```

  ### Example: Fulfill and collect fee

  ```bash
  curl -X POST https://theseven.meme/api/bridge/intent/fulfill \
    -H "Content-Type: application/json" \
    -d '{"intentId":"a5b61667-...","solverAddress":"0xYourAddress","destTxHash":"0xYourTxHash"}'
  ```

  ---

  ## 🛠️ SERVER REQUIREMENTS

  ```
  Minimum:     1 vCPU | 512 MB RAM | 10 GB SSD | Ubuntu 22.04 LTS
  Recommended: 2 vCPU | 2 GB RAM   | 40 GB SSD
  Providers:   DigitalOcean ($6/mo), Hetzner ($4/mo), Vultr, Linode
  ```

  The solver is extremely lightweight — it does nothing but poll the API and submit transactions. A $6/month VPS runs it perfectly.

  ---

  ## 📅 TIMELINE

  | Date | Milestone |
  |------|-----------|
  | ✅ **April 25, 2026** | 🟢 **Seven Chain Mainnet launched** |
  | ✅ **April 25, 2026** | Bridge intent network live — fees flowing |
  | **Now** | Solver onboarding open — run the quick start above |
  | **Now** | Join Telegram for community access → [t.me/thesevenmeme](https://t.me/thesevenmeme) |
  | **May 2026** | $SEVEN token public launch |
  | **May 2026** | Leaderboard bonus multipliers activate |
  | **Q3 2026** | Multi-chain expansion: Solana, Arbitrum, Base |

  ---

  ## 🔑 SEVEN TOKEN — OTC ACCESS (Pre-Launch)

  > **$SEVEN has not launched publicly yet.**
  >
  > Active solver operators are among the **ONLY groups with OTC access** to purchase SEVEN tokens before the public launch.

  **To access OTC purchasing:**
  1. 💬 [Join Telegram → t.me/thesevenmeme](https://t.me/thesevenmeme) and message the team
  2. 📧 Or email **info@theseven.meme** with subject: **"SEVEN OTC — Solver Interest"**

  ---

  ## 🟢 LIVE BRIDGE ENDPOINTS

  | Field | Value |
  |-------|-------|
  | **Network** | Seven Chain Mainnet |
  | **Chain ID** | `70007` |
  | **Bridge API** | `https://theseven.meme/api/bridge` |
  | **RPC Endpoint** | `https://theseven.meme/api/seven-chain/jsonrpc` |
  | **Explorer** | `https://theseven.meme/blockchain/explorer` |
  | **Status** | 🟢 Live |

  ---

  ## 📋 SOLVER RULES

  1. **Claim window:** You have 3 minutes after claiming an intent to fulfill it — or it reopens to other solvers
  2. **Delivery proof:** You must provide the destination transaction hash when fulfilling
  3. **No front-running:** Each intent can only be claimed by one solver at a time
  4. **Uptime:** More uptime = more intents seen = more fees earned
  5. **Heartbeat:** Send heartbeats so your node appears active on the leaderboard
  6. **Fair competition:** Do not attempt to spam or grief the claim queue

  ---

  ## 🤝 CONTRIBUTING

  Pull requests are welcome! Great areas for contribution:

  - 🚀 Faster intent detection strategies
  - ⛓️ Additional chain support (Arbitrum, Base, Solana)
  - 📊 Local analytics and fee tracking dashboard
  - 🔒 Additional security checks before filling
  - 🐳 Docker Compose multi-solver setups

  1. Fork the repo
  2. Create a feature branch (`git checkout -b feature/faster-fills`)
  3. Commit your changes
  4. Open a PR — the team reviews within 48 hours

  ---

  ## 📬 CONTACT {#-contact}

  | Purpose | Contact |
  |---------|---------|
  | 💬 Solver & Validator Community | [t.me/thesevenmeme](https://t.me/thesevenmeme) |
  | 📧 General & Solver Inquiries | info@theseven.meme |
  | 🛠️ Technical Support & Node Help | support@theseven.meme |
  | 💎 SEVEN OTC Purchases | info@theseven.meme |
  | 🏛️ Strategic Partnerships | info@theseven.meme |

  ---

  ## 🔗 LINKS

  | Resource | URL |
  |----------|-----|
  | Exchange | [theseven.meme](https://theseven.meme) |
  | Bridge | [theseven.meme](https://theseven.meme) |
  | Solver Leaderboard | [theseven.meme](https://theseven.meme) |
  | Block Explorer | [theseven.meme/blockchain/explorer](https://theseven.meme/blockchain/explorer) |
  | Telegram | [t.me/thesevenmeme](https://t.me/thesevenmeme) |
  | Validator Node Repo | [github.com/umairkhan2582/seven-chain-node](https://github.com/umairkhan2582/seven-chain-node) |

  ---

  <div align="center">

  ### 💬 Join the community — [t.me/thesevenmeme](https://t.me/thesevenmeme)
  ### 📧 Full support — support@theseven.meme · info@theseven.meme

  **Built with ❤️ by the TheSeven.meme team**

  ![TheSeven.meme](https://raw.githubusercontent.com/umairkhan2582/seven-chain-node/main/images/logo.png)

  </div>