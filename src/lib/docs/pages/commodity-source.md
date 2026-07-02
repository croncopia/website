---
title: The commodity source
group: Commodity Prices
order: 5
method: GET
path: https://commodity.croncopia.com/latest/{category}/{series}.json
example: api/metals/gold.json
ids: metals
---

Commodity prices come from [croncopia/commodity-prices](https://github.com/croncopia/commodity-prices), an open-source pipeline that rebuilds aggregated energy and metal prices every 30 minutes and publishes them as static JSON — one file per commodity. Its purpose is the same as the exchange source: dependable market data with no API key, no rate limits, and no cost, with every refresh committed to git so the full history stays public and auditable.

## how it works

1. **Fetch** — each source module pulls the latest price from its provider; metals are normalised to a common unit of USD per troy ounce.
2. **Filter** — only commodities on a defined whitelist pass into the aggregate, a single choke point that keeps unexpected or malformed symbols from a source out of the dataset.
3. **Aggregate** — sources are fetched concurrently and may fail independently; the run continues as long as at least one delivers. Prices are averaged per commodity, and when 3+ sources report, anything deviating more than 10% from the median is discarded as an outlier.
4. **Distribute** — one JSON file is written per commodity. Metal prices are converted into six weight units (`troy_ounce` through `metric_ton`); energy prices are published as a single number in the market's conventional unit.

## other ways to access it

- **GitHub Pages** — `https://commodity.croncopia.com/latest/{category}/{series}.json` — stable endpoint with predictable caching.
- **jsDelivr** — `https://cdn.jsdelivr.net/gh/croncopia/commodity-prices/latest/{category}/{series}.json` — globally CDN-cached; may lag by hours unless you pin a commit.
- **GitHub raw** — `https://raw.githubusercontent.com/croncopia/commodity-prices/refs/heads/main/latest/{category}/{series}.json` — always the latest commit, subject to GitHub rate limits under heavy use.

## notes

- This site's [`/api/energy`](/docs/energy) and [`/api/metals`](/docs/metals) endpoints mirror the source, so most consumers never need to hit it directly.
- The `sources` field in every response tells you how many providers contributed to that price.
