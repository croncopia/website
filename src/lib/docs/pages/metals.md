---
title: Get metal price
group: Commodity Prices
order: 7
method: GET
path: https://croncopia.com/api/metals/{series}.json
example: api/metals/gold.json
ids: metals
---

Returns the latest price for a metal series: precious metals, base metals, battery materials, and specialty metals. 23 series available — every one of them is in the id picker on the right, with its live response. Unlike energy, metal prices come pre-converted into six weight units.

## path parameters

| name     | type   | description                                                            |
| -------- | ------ | ----------------------------------------------------------------------- |
| `series` | string | Series name, lowercase — e.g. `gold`, `copper`, `lithium`, `uranium`.  |

## response fields

| field       | type   | description                                                                              |
| ----------- | ------ | ----------------------------------------------------------------------------------------- |
| `base`      | string | Currency the prices are quoted in. Always `USD`.                                          |
| `price`     | object | Price per weight unit: `troy_ounce`, `gram`, `kilogram`, `ounce`, `pound`, `metric_ton`. |
| `sources`   | number | How many upstream sources were aggregated.                                                |
| `timestamp` | string | ISO 8601 time of the last refresh.                                                        |

## notes

- Pick the unit that matches the market convention: `troy_ounce` for precious metals, `metric_ton` for base metals, `kilogram` or `pound` for the rest.
- Two series ids keep their historical spellings: `steal` (Steel) and `colbalt` (Cobalt).
