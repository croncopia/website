import cc from 'currency-codes';
import type { CurrencyRate } from './types';
import { getJson, type Fetch } from './http';
import { fmtTimestamp } from '$lib/utils/format';

export const EXCHANGE_API = 'https://exchange.croncopia.com';

/** /latest/{BASE}.json */
interface ExchangePayload {
	base: string;
	timestamp: string;
	rates: Record<string, number>;
}

/** /latest/index.json */
interface ExchangeIndex {
	symbols: string[];
	locations: Record<string, string>;
}

export interface ExchangeSnapshot {
	base: string;
	lastUpdated: string;
	rates: CurrencyRate[];
}

/** ISO 4217 name for a currency code; non-ISO codes (CNH, GGP, …) fall back to the code. */
export function currencyName(code: string): string {
	return cc.code(code)?.currency ?? code;
}

export function toCurrencyRates(rates: Record<string, number>): CurrencyRate[] {
	return Object.entries(rates)
		.map(([code, rate]) => ({ code, name: currencyName(code), rate }))
		.sort((a, b) => a.code.localeCompare(b.code));
}

export async function fetchExchangeRates(
	base = 'USD',
	fetchFn: Fetch = fetch
): Promise<ExchangeSnapshot> {
	const payload = await getJson<ExchangePayload>(fetchFn, `${EXCHANGE_API}/latest/${base}.json`);
	return {
		base: payload.base,
		lastUpdated: fmtTimestamp(payload.timestamp),
		rates: toCurrencyRates(payload.rates)
	};
}

/** All currency codes that can be used as a base. */
export async function fetchExchangeBases(fetchFn: Fetch = fetch): Promise<string[]> {
	const index = await getJson<ExchangeIndex>(fetchFn, `${EXCHANGE_API}/latest/index.json`);
	return index.symbols;
}
