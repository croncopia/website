---
title: Get exchange rates
group: Exchange Rates
order: 3
method: GET
path: https://croncopia.com/api/exchange/{CODE}.json
example: api/exchange/EUR.json
ids: exchange
---

Returns every exchange rate quoted against a base currency, in one file. 177 codes are available as a base: ISO 4217 currencies, a few extras like `CNH`, and metal proxies (`XAU`, `XAG`, `XPT`, `XPD`). Pick any code in the panel on the right to see its live response.

## path parameters

| name   | type   | description                                          |
| ------ | ------ | ---------------------------------------------------- |
| `CODE` | string | Currency code, uppercase — e.g. `USD`, `EUR`, `JPY`. |

## response fields

| field       | type   | description                                                                  |
| ----------- | ------ | ----------------------------------------------------------------------------- |
| `base`      | string | The base currency you requested.                                              |
| `timestamp` | string | ISO 8601 time of the last refresh.                                            |
| `rates`     | object | Map of currency code → units per 1 unit of `base`. Includes the base at `1`. |

## notes

- The full list of available codes is at [`/api/exchange/index.json`](/api/exchange/index.json).
- Cross rates come for free: every currency is available as a base, so fetch the file for whichever base you need instead of converting through USD.
