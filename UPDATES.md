# Seven Chain — News & Updates

> Latest announcements, protocol changes, and upgrade notices for solver operators.

---

## [May 29, 2026] — v2.0.1: Docs & Accuracy Update

Documentation updated across all ecosystem repos to reflect the current state of the network accurately.

- README and UPDATES.md now reflect early-launch validator status
- All contract addresses verified against live production API
- Ecosystem links updated across solver, node, and developer hub repos

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
- Validator consensus threshold set to **9 validators**

---

## [May 2026] — Validator Applications Open

Seven Chain is actively growing its validator set. We are in early launch phase — **now is the best time to apply**. Early validators are the genesis set that shapes the network.

To apply as a validator:

1. Go to https://theseven.meme/staking — stake your SEVEN tokens
2. Go to https://theseven.meme/become-validator — register your node
3. Your node joins block production automatically after activation

Validators earn:
- Block rewards (0.0003 SEVEN per block with real user transactions)
- Bridge relay fee share (0.0004 BNB per settled trade)
- Staking multiplier up to 3× based on SEVEN staked

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

Seven Chain (ID: 70007) launched on mainnet. The genesis block was mined and the network has been running continuously since launch with zero unplanned downtime.

---

*Watch this repo (Watch → All Activity) to get notified of future updates.*
