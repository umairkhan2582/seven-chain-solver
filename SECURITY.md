# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 2.0.x | ✅ Active |
| 1.2.x | ⚠️  Security patches only |
| < 1.2 | ❌ End of life |

## Bridge Contract Security

The V3 Bridge contract (`0x41A70A6bE222174D8369A90fE91017E8Fb74606f`) is:

- **Non-upgradeable** — no proxy, no admin key, no pause function
- **Reentrancy-safe** — uses checks-effects-interactions pattern throughout
- **Intent-based** — solvers can only claim intents they did not create (prevents self-dealing)
- **Time-locked claims** — intents expire after 24h if unclaimed, returning funds to the sender

## Private Key Safety

- Never commit your solver private key to this repository
- Use a dedicated hot wallet with only the minimum gas needed
- Rotate keys immediately if you suspect exposure
- The solver wallet needs no special permissions — it just pays gas

## Reporting a Vulnerability

If you discover a security issue in this solver client or the Seven Chain bridge contracts, please report it privately:

1. **Do not** open a public GitHub issue
2. Email: security@theseven.meme
3. Include: description, reproduction steps, potential impact
4. We respond within 48 hours

We do not currently have a formal bug bounty program, but significant discoveries will be rewarded at our discretion.

## Known Non-Issues

- The solver private key is stored in `config.json` (plaintext) — this is intentional for simplicity. Use environment variables or a secrets manager in production.
- Docker images do not pin base image digests — if this is a concern for your deployment, pin them manually in the Dockerfile.
