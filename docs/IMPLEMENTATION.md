# Sumit's Stock & Options Workspace

Searchable NSE equity catalogue, a browser-local stock list, synchronized stock and option candlesticks, option-chain selection, and per-stock paper positions with lots, ATP and P&L.

## Run and check

Run `node server.cjs` and open http://127.0.0.1:4173, or open `dist/index.html` directly in a modern browser. Run `node verify.cjs` for the pricing, accounting, candle and interaction checks.

## Current implementation

- 3,556 equity symbols in EQ/BE/BZ/SM/ST/SZ series from the public Upstox NSE instrument snapshot; 218 have stock option contracts. Search by symbol/company, optionally filter for options, and add stocks to your saved list. This is a downloaded snapshot, not an automatically refreshed complete live exchange master.
- Expiry, strike, CE/PE, contract keys and lot sizes come from that snapshot. Expired contracts are excluded relative to the simulation clock. Stocks without options show an explicit empty state and disabled order buttons.
- All prices, IV, candles and changes are synthetic. There is no live broker connection or live order functionality. The user chose to build the workspace first, with Upstox as a possible later provider.
- Both candle charts use actual price axes and the same 1/5/15-minute aggregation and cursor timestamp. Underlying chart includes EMA 9; above/below is descriptive, not a buy/sell recommendation. Each 2-second tick advances the synthetic clock 10 seconds. The latest bucket updates until it closes. The session can continue beyond exchange hours; this is not exchange replay.
- Option prices use a European Black–Scholes model, illustrative 6% interest rate and no dividends. Demo starting spots are examples or derived from available strikes; they are not quotes. OI, volume and spreads are not fabricated.
- Paper trades use units = lots × the selected contract's lot size. Repeated same-side entries in the same contract are combined using quantity-weighted ATP. Opposite-side paper positions are tracked separately, without broker netting or hedged-margin modeling. Closing a position realizes its entire P&L. Total = realized + unrealized, before charges, margin and slippage.
- Stocks retain separate positions and contract marks while switching views. Watchlist shows per-stock totals; the positions view can show one stock or all stocks. CSV exports the complete paper portfolio.
- Version 2 data is in `localStorage` under `stock-workspace-v2`. It retains watchlists, positions and synthetic paths across reloads on this browser/origin. No cross-device synchronization. A catalogue replacement resets synthetic paths, which can revalue existing paper positions. Original version data is retained under its old localStorage keys but not imported because its unit-based demo contracts differ.

## Instrument catalogue

Source: https://assets.upstox.com/market-quote/instruments/exchange/NSE.json.gz

Documentation: https://upstox.com/developer/api-documentation/instruments/

The UI displays the retrieval date from `dist/catalog.js`. Refresh by downloading the public gzipped master to ignored `nse-master.json.gz`, then run `node build-catalog.cjs`. Confirm the snapshot's validity before connecting live trading. A download timestamp is not an exchange publication timestamp.

## Live stage still required

Upstox advertises free trading and market-data API access at https://upstox.com/trading-api/; this does not remove trading charges or the need for an authenticated broker account. The user currently has no Upstox account and requested the workspace first.

Before live operation implement an authenticated server-side service with securely stored credentials, supported OAuth login, historical candle APIs, market-data WebSocket decoding/subscriptions, exchange-time handling, stale feed and reconnect logic, current contract resolution, broker order/fill/position synchronization, and broker-supported order/risk controls. Verify current broker requirements, API entitlements and order execution rules before deployment. Never put API secrets into client-side code or browser storage. The present static Site is not a live trading backend.

## Checks

`node verify.cjs` checks pricing parity and numerical delta; weighted entry ATP; long/short and closed/open P&L; candle aggregation; HTML bindings; initial rendering; repeated paper entries; ticking; stock switching; cross-stock position views; search; and stocks without options. Its DOM/canvas stub is a smoke check, not visual browser QA.

## Embedded market chart

The stock workspace now includes the official TradingView Advanced Chart embed. It follows the selected NSE stock using a guarded MutationObserver and has its own interval selector (1/5/15/60 minutes or daily). The widget is rebuilt only when stock or interval changes, or when Reload chart is clicked. Script errors show a fallback message; a TradingView link remains available for unavailable symbols. Widget attribution and branding are retained. No TradingView account or API key is required to view supported embedded data. Delays and instrument coverage depend on TradingView and exchange permissions; the UI makes no real-time guarantee. The widget is independent of demo charts, quotes, option chains, ATP and paper P&L and cannot feed their calculations. Existing paper data is unchanged.

Official integration documentation: https://www.tradingview.com/widget-docs/tutorials/iframe/build-page/dynamic-symbols/
Data limitations: https://www.tradingview.com/widget-docs/faq/data/

## Appearance and layouts

Use Customize in the header to choose six themes, four accents, chart height/style/interval, density, page width and panel visibility. Market focus hides all simulated quotes and practice panels. Options practice restores a compact paper workspace. The accessible candle palette uses blue/orange on local demo charts and P&L. TradingView uses its own light/dark palette. Preferences save in this browser under options-desk-appearance-v1; resetting appearance preserves trade and watchlist data. Run node verify-customize.cjs for customization smoke checks. See ROADMAP.md for suggested next features.

## Installable app

Run `Start-OptionsDesk.ps1` in PowerShell to start the local server and open a dedicated Edge app window. Node.js is required. Alternatively, open http://127.0.0.1:4173/ in Edge or Chrome and choose **Install app**. The Codex embedded browser may not offer browser installation; use Edge or Chrome for installation.

The manifest and service worker support standalone launch and cached offline practice after the first successful online load. External TradingView content still needs internet. Saved positions and appearance belong to this exact browser profile and origin; switching from localhost to 127.0.0.1 uses different browser storage. This is an installable web app, not a packaged native executable or a live broker integration.
