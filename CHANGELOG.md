# Changelog

All notable changes to the Seven Chain Solver are documented here.

---

## [2.0.0] — May 2026

### 🚀 Major Release

This is the most significant update to the solver since initial deployment.
Multiple subsystems have been rewritten and the V3 bridge contract is now live.

### Added
- **V3 Bridge Contract** — `0x41A70A6bE222174D8369A90fE91017E8Fb74606f` (Seven Chain, non-upgradeable)
- **Dynamic price engine** — SEVEN price now moves $0.05 per SEVEN bought/sold (AMM-style)
- **Price persistence** — DYNAMIC_PRICE saved to `platform_config` table; no longer resets on restart
- **Heartbeat monitor** — solver emits a liveness signal every 30s for validator coordination
- **Real-time trade settlement** — spot_buy and spot_sell transactions now generate proper on-chain records
- **Validator threshold updated** — consensus now requires **9 active validators**
- `UPDATES.md` — new news and announcements file

### Fixed
- **Block reward self-reward bug** — bad transaction `0x5485c0f9` deleted; block rewards now only fire when a real user transaction is included in the batch (no more system-only block rewards)
- **Candle data gap** — candle API was filtering `tx_type='swap'` only, missing all `spot_buy`/`spot_sell` trades. Fixed to include all SEVEN pair trade types
- **Trade book invisibility** — same filter bug caused recent trades to not appear in the trade book
- **Price impact magnitude** — PRICE_IMPACT_PER_SEVEN raised from $0.0005 → $0.05 (100× increase; now visible on chart)
- **Price execution** — `getQuotePrice()` was returning hardcoded oracle price ($100); now returns live DYNAMIC_PRICE
- **change24h calculation** — was `(ORACLE_PRICE - open) / open`; now correctly `(DYNAMIC_PRICE - open) / open`

### Changed
- Stats queries (vol24h, high24h, low24h) now cover all trade types, not just swap
- All candle/trade queries now filter strictly to `pair IN ('SEVEN/sUSDT', 'SEVEN/sBNB')` to prevent cross-contamination from other trade types
- Solver version bumped to `2.0.0`

---

## [1.2.0] — April 2026

### Added
- Staking page integration — validators can now stake directly at https://theseven.meme/staking
- Blockchain explorer — block, transaction, and address detail views
- Become a Validator page with stake SEVEN CTA
- BecomeValidator → StakingPage navigation flow

### Fixed
- Bridge relayer stuck on stale blocks — added `bridge_last_block_bnb` tracking in platform_config
- P2P monitor timestamp drift

---

## [1.1.0] — March 2026

### Added
- Seven Chain mainnet launch (Chain ID: 70007)
- Initial bridge V1 deployment
- Solver permissionless intent claiming
- Docker support

---

## [1.0.0] — February 2026

### Added
- Initial solver client release
- BNB Chain → Seven Chain bridge poller
- Intent detection and settlement flow
- Fee claiming mechanism
