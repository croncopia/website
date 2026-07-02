/** A single commodity price series, e.g. energy/brent_crude.json */
export interface CommoditySeries {
	/** Endpoint path relative to the site root, e.g. "energy/brent_crude.json" */
	file: string;
	name: string;
	price: number;
	unit: string;
}

/** A single exchange rate, quoted as units per 1 USD. */
export interface CurrencyRate {
	code: string;
	name: string;
	rate: number;
}

export interface MarketData {
	energy: CommoditySeries[];
	metals: CommoditySeries[];
	/** Human-readable commodity feed timestamp, e.g. "2026-07-02 06:00 UTC" */
	commoditiesUpdated: string;
	fx: CurrencyRate[];
	/** Base currency the fx rates are quoted against. */
	fxBase: string;
	/** All currency codes available as a base. */
	fxBases: string[];
	/** Human-readable exchange feed timestamp. */
	fxUpdated: string;
	/** Header note describing any values that are still placeholders. */
	dummyNote?: string;
}

/**
 * Anything that can supply market data. The dummy provider implements this
 * today; a live provider fetching the croncopia.com JSON endpoints replaces
 * it in src/lib/data/index.ts without touching any component.
 */
export interface MarketDataProvider {
	/** Pass SvelteKit's `fetch` from a load function so SSR requests are handled properly. */
	getMarketData(fetchFn?: typeof globalThis.fetch): Promise<MarketData>;
}
