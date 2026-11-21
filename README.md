# Seven Chain Bridge Solver

This repository contains the bridge-solver service only. Do not run validator keys or validator client processes in this service. Configure independent RPC endpoints and keep the solver signing key in a local secret file mounted only into the solver container.

## Important current limitation

The current code still uses the configured `apiUrl` for intent discovery, claiming, fulfillment, and solver heartbeat. It also sends assets from the solver wallet in its current delivery path. Therefore this repository is **not yet a trustless, fully decentralized bridge solver**; changing an RPC URL alone does not change that. Do not treat the API as a non-authoritative indexer until the settlement path is replaced with a verified, permissionless on-chain flow and tested against the deployed bridge contracts.

## Configure

```bash
npm ci
cp config.example.json config.json
```

Edit `config.json` with the actual solver address, at least one supported route, contract addresses verified for the correct network, and RPC URLs you operate or independently trust. The example deliberately has no routes or token contracts, so it cannot start or send assets until you fill in verified values. The Seven Chain RPC has no hard-coded platform default; set `rpcUrls.SEVEN` to your own node or chosen endpoint. Configure every chain used by the selected routes.

The example file follows the runtime schema and contains no signing key. The solver reads its key only from `SOLVER_PRIVATE_KEY_FILE` (default: `./secrets/solver_private_key`). For local use, create that file with restrictive permissions and set `chmod 600`. Never put a key in `config.json`, `.env`, a command line, a commit, or a container image. Startup verifies that the public `solverAddress` matches the wallet derived from the key and fails without logging the key if they differ. Unverified token addresses are not supplied; the solver fails closed unless a configured token contract is a valid address.

## Docker Compose

Create the secret file locally, excluded by `.gitignore`, then run:

```bash
docker compose up --build -d
```

Compose mounts the key at `/run/secrets/solver_private_key` into the solver service only. Do not mount the validator keystore into this container. A host administrator can still access container files and secrets; use a dedicated host/service account and restrict host access.

## Operation

```bash
npm run typecheck
npm run build
npm start
```

The configured API remains a central coordination dependency in this version. The independent RPC endpoints are used for chain reads and transactions, but they do not make intent claims or bridge settlement decentralized. A safe production migration requires audited permissionless contracts, authenticated source-chain proof/finality rules, replay protection, bridge-liquidity accounting, and testnet verification before any live funds are used.

## License

MIT
