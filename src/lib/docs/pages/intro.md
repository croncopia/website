---
title: Introduction
group: Getting Started
order: 1
method: GET
path: https://croncopia.com/api/{category}/{id}.json
example: api/energy/brent_crude.json
---

Croncopia serves free, open source data as plain JSON, refreshed hourly by GitHub Actions. There is no authentication, no API keys, and no rate limiting — every endpoint is a static file you can fetch directly from a browser or any backend.

## path parameters

| name       | type   | description                                                             |
| ---------- | ------ | ----------------------------------------------------------------------- |
| `category` | string | Data group: `exchange`, `energy`, or `metals`.                           |
| `id`       | string | Series name (`brent_crude`, `gold`) or uppercase currency code (`EUR`). |

## notes

- Data is refreshed hourly via GitHub Actions; responses are cached for up to 10 minutes.
- Every endpoint sends `Access-Control-Allow-Origin: *`, so browser fetches work from any origin.
- The same files are also served without the `/api` prefix, e.g. `croncopia.com/energy/brent_crude.json`.
- These endpoints mirror the upstream feeds at `commodity.croncopia.com` and `exchange.croncopia.com` — you can hit those directly too.
- Data is provided as-is, with no warranty. Not investment advice.
