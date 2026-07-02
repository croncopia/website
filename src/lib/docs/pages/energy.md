---
title: Get energy price
group: Commodity Prices
order: 6
method: GET
path: https://croncopia.com/api/energy/{series}.json
example: api/energy/brent_crude.json
ids: energy
---

Returns the latest price for an energy series: crude oil benchmarks, refined products, natural gas hubs, LNG, coal, and marine fuels. 17 series available — every one of them is in the id picker on the right, with its live response.

## path parameters

| name     | type   | description                                                                  |
| -------- | ------ | ----------------------------------------------------------------------------- |
| `series` | string | Series name, lowercase — e.g. `brent_crude`, `natural_gas_ttf`, `coal_capp`. |

## response fields

| field       | type   | description                                    |
| ----------- | ------ | ---------------------------------------------- |
| `base`      | string | Currency the price is quoted in. Always `USD`. |
| `price`     | number | Latest price for the series.                   |
| `sources`   | number | How many upstream sources were aggregated.     |
| `timestamp` | string | ISO 8601 time of the last refresh.             |

## notes

- The quote unit varies by series — USD/bbl for crude, USD/MMBtu for gas hubs, USD/t for coal and marine fuels. The [dashboard](/) lists the unit for every series.
