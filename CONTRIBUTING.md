# Contributing to Seven Chain Bridge Solver

  Thank you for contributing! Every improvement helps solver operators earn more efficiently.

  ## Getting Started

  1. Fork this repository
  2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/seven-chain-solver`
  3. Install: `npm install`
  4. Configure: `cp .env.example .env`
  5. Create a branch: `git checkout -b feature/your-feature`

  ## What We Are Looking For

  ### High Priority
  - Faster fill strategies and smarter prioritization
  - Additional chain support (Arbitrum, Base, Solana, Polygon)
  - Analytics dashboard for fee tracking and profit reporting
  - Security improvements for claim/fulfill flows

  ### Good First Issues
  - Documentation improvements
  - Bug fixes
  - Additional token support
  - Better error messages

  ## Development

      npm run dev      # development with hot-reload
      npm run build    # compile TypeScript
      npm start        # run compiled output

  ## Coding Standards

  - TypeScript with strict mode enabled
  - Always handle async errors with try/catch
  - No console.log — use the built-in logger
  - Comment non-obvious logic
  - Optimize for reliability — this runs 24/7 on cheap VPS hardware

  ## Submitting a Pull Request

  1. Keep your branch up to date with main
  2. Run `npm run build` — must compile without errors
  3. Open a PR with a clear title and description
  4. Reference related issues: Closes #123
  5. PRs reviewed within 48 hours

  ## Related Repositories

  - [seven-chain-node](https://github.com/umairkhan2582/seven-chain-node) — Run a Seven Chain validator node

  ## Community

  | Channel | Contact |
  |---------|---------|
  | Telegram (fastest) | t.me/thesevenmeme |
  | Technical support | support@theseven.meme |
  | General inquiries | info@theseven.meme |

  Built with love by the TheSeven.meme team