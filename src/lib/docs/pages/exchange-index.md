---
title: List currencies
group: Exchange Rates
order: 4
method: GET
path: https://croncopia.com/api/exchange/index.json
example: api/exchange/index.json
---

Returns every currency code available as a base, plus the upstream location of each rate file.

## response fields

| field       | type     | description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `symbols`   | string[] | All available currency codes.                    |
| `locations` | object   | Map of code → upstream URL of the raw rate file. |
