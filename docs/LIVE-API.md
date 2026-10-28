# Bring your own live market-data API

Options Desk can be extended to use your own authenticated broker or licensed data-provider API. Live integration is development work: it is not currently enabled by pasting a token into the app.

## Architecture

Browser workspace → your authenticated backend → provider REST/WebSocket API.

Keep API secrets, OAuth refresh tokens, and broker access tokens on the backend. Never commit them, place them in frontend JavaScript, or save them in localStorage. Use environment variables or a suitable server-side secret store. A static GitHub Pages deployment cannot safely host a secret-bearing broker backend.

## Integration steps

1. Choose a provider supporting NSE F&O option chains, historical candles, and streaming quotes. Verify current documentation, access entitlements, subscription limits, and permitted redistribution.
2. Implement the provider's supported authentication flow on your backend. Authenticate browser clients to your service too; use HTTPS for remote deployments and restrict cross-origin access.
3. Refresh the current instrument master. Resolve instrument keys, expiry dates, strike, CE/PE, lot size, tick size, and exchange timezone from the provider rather than hardcoding them.
4. Implement backend endpoints for instruments, expiries, option chains, and historical candles, plus a streaming transport for timestamped updates.
5. Normalize quotes to include instrument key, exchange timestamp, underlying price, premium LTP, bid/ask, volume, OI, and available Greeks/IV. Missing fields should be marked unavailable; do not fill them with simulated numbers.
6. Refactor dist/workspace.js to replace synthetic history creation and simulation ticks with provider snapshots and streaming updates. Inspect its seed, renderChain, spotCandles, optionCandles, and tick paths. dist/engine.js contains the illustrative pricing/accounting helpers. server.cjs currently only serves static files and needs a separate authenticated API service or a deliberate backend implementation.
7. Seed candles with historical data and aggregate live ticks using exchange timestamps. Add reconnect/backoff, duplicate/out-of-order handling, stale-feed indicators, and explicit live/paper mode labels. Keep existing paper positions separate from any live portfolio.
8. Test with a sandbox or paper portfolio. A live data feed does not implement real order placement. Broker execution requires a separate authorized order flow, risk checks, order/fill reconciliation, and current provider/exchange requirements.

## Suggested application-facing API (not implemented)

- GET /api/instruments
- GET /api/expiries?underlying=...
- GET /api/option-chain?underlying=...&expiry=...
- GET /api/candles?instrument=...&interval=...
- WebSocket /api/stream for timestamped quotes and connection status

These are proposed routes for your backend, not actual broker endpoints or existing app functionality. Do not cache authentication responses or live account data in the offline service worker. Update dist/sw.js to exclude all /api/ routes before introducing a backend on the same origin.

## References

- [Upstox developer documentation](https://upstox.com/developer/api-documentation/)
- [NSE real-time market data](https://www.nseindia.com/static/market-data/real-time-data-subscription)

Consult your chosen provider's current official documentation before implementing authentication or data subscriptions.
