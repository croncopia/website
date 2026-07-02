---
title: The exchange source
group: Exchange Rates
order: 2
method: GET
path: https://exchange.croncopia.com/latest/{CODE}.json
example: api/exchange/USD.json
ids: exchange
---

Exchange rates come from [croncopia/exchange-rate](https://github.com/croncopia/exchange-rate), an open-source pipeline that rebuilds aggregated fiat exchange rates every 30 minutes and publishes them as static JSON — one file per currency. Its purpose is to make dependable exchange data free: no API key, no rate limits, no cost, and because every refresh is a git commit, the entire price history is public and auditable.

## how it works

1. **Fetch** — each source module pulls the latest rates from its provider and normalises them to a common convention: units of currency per 1 USD.
2. **Filter** — an ISO 4217 whitelist is enforced at a single choke point, which also keeps crypto tokens with fiat-looking tickers out of the dataset.
3. **Aggregate** — sources are fetched concurrently and may fail independently; the run continues as long as at least one delivers. Rates are averaged per currency, and when 3+ sources report, anything deviating more than 10% from the median is discarded as an outlier.
4. **Distribute** — one JSON file is written per currency. Every rate is USD-based, so any cross rate is a single division away, and every currency gets its own file as a base.

## other ways to access it

- **GitHub Pages** — `https://exchange.croncopia.com/latest/{CODE}.json` — stable endpoint with predictable caching.
- **jsDelivr** — `https://cdn.jsdelivr.net/gh/croncopia/exchange-rate/latest/{CODE}.json` — globally CDN-cached; may lag by hours unless you pin a commit.
- **GitHub raw** — `https://raw.githubusercontent.com/croncopia/exchange-rate/refs/heads/main/latest/{CODE}.json` — always the latest commit, subject to GitHub rate limits under heavy use.

## notes

- This site's [`/api/exchange` endpoints](/docs/exchange) mirror the source, so most consumers never need to hit it directly.
- Need up-to-the-minute data? Use GitHub raw. Optimising for speed and uptime? Use a CDN option.
