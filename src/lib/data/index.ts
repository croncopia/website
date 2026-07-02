import type { MarketData, MarketDataProvider } from './types';
import { dummyMarketData } from './dummy';
import { fetchCommodities } from './commodities';
import { fetchExchangeBases, fetchExchangeRates } from './exchange';

export type { CommoditySeries, CurrencyRate, MarketData, MarketDataProvider } from './types';
export { dummyMarketData, dummyProvider } from './dummy';
export { fetchCommodities, COMMODITY_API } from './commodities';
export { fetchExchangeRates, fetchExchangeBases, currencyName, EXCHANGE_API } from './exchange';

/**
 * Live commodities from commodity.croncopia.com and live exchange rates from
 * exchange.croncopia.com. Each feed falls back to dummy data independently if
 * unreachable, with a header note saying what's still placeholder.
 */
const liveProvider: MarketDataProvider = {
	async getMarketData(fetchFn = fetch) {
		const [commodities, exchange, bases] = await Promise.allSettled([
			fetchCommodities(fetchFn),
			fetchExchangeRates('USD', fetchFn),
			fetchExchangeBases(fetchFn)
		]);

		const notes: string[] = [];
		const data: MarketData = { ...dummyMarketData, dummyNote: undefined };

		if (commodities.status === 'fulfilled') {
			data.energy = commodities.value.energy;
			data.metals = commodities.value.metals;
			data.commoditiesUpdated = commodities.value.lastUpdated;
		} else {
			notes.push('commodity prices are dummy data');
		}

		if (exchange.status === 'fulfilled') {
			data.fx = exchange.value.rates;
			data.fxBase = exchange.value.base;
			data.fxUpdated = exchange.value.lastUpdated;
		} else {
			notes.push('exchange rates are dummy data');
		}

		if (bases.status === 'fulfilled') {
			data.fxBases = bases.value;
		} else if (exchange.status === 'fulfilled') {
			data.fxBases = exchange.value.rates.map((r) => r.code);
		}

		if (notes.length > 0) data.dummyNote = notes.join(' · ');
		return data;
	}
};

/** The provider the site reads from — swap implementations here. */
export const marketData: MarketDataProvider = liveProvider;
