# Seven Chain — News & Updates

> Latest announcements, protocol changes, and upgrade notices for solver operators.

---

## [May 20, 2026] — v2.0 Live: Dynamic Pricing + V3 Bridge

Seven Chain Solver v2.0 is now live on mainnet.

**What changed for solver operators:**

- The bridge V3 contract is now the canonical settlement target: `0x41A70A6bE222174D8369A90fE91017E8Fb74606f`
- If you are running a v1 solver pointing at the old contract, **update your config immediately**
- The heartbeat endpoint has moved — pull the latest `src/heartbeat.ts`

**What changed on the platform:**

- SEVEN price now moves in real-time with every buy/sell on https://theseven.meme/spot/seven
- The trade book and chart now show all live trade data — no more "no trades yet" placeholder
- Validator threshold updated to **9 validators** — one slot still open

---

## [May 2026] — Validator Slot Open

We currently have **8 active validators**. The consensus threshold is **9**.

If you hold SEVEN tokens and want to become a validator:

1. Go to https://theseven.meme/staking
2. Stake your SEVEN
3. Wait for activation (next epoch)
4. Your node joins block production

New validators receive block rewards from the moment they are activated.

**Buy SEVEN to stake:** https://theseven.meme/spot/seven

---

## [April 2026] — Staking Now Live

SEVEN token staking is now live at https://theseven.meme/staking.

Stakers earn:
- Block reward share (proportional to stake)
- Solver fee share (for validator-class stakers)

There is no lock-up period for the initial validator cohort.

---

## [March 2026] — Mainnet Launch

Seven Chain (ID: 70007) launched on mainnet. The genesis block was mined with 7 validators. The network has been running continuously since launch with zero unplanned downtime.

---

*Subscribe to this repo (Watch → All Activity) to get notified of future updates.*
