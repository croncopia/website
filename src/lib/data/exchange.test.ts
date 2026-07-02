import { describe, expect, it } from 'vitest';
import { currencyName, fetchExchangeRates, toCurrencyRates } from './exchange';

describe('currencyName', () => {
	it('resolves ISO 4217 names', () => {
		expect(currencyName('EUR')).toBe('Euro');
		expect(currencyName('XAU')).toBe('Gold');
	});

	it('falls back to the code for non-ISO currencies', () => {
		expect(currencyName('CNH')).toBe('CNH');
	});
});

describe('toCurrencyRates', () => {
	it('maps and sorts rates by code', () => {
		const rows = toCurrencyRates({ JPY: 154.85, EUR: 0.9124, CNH: 7.2485 });
		expect(rows.map((r) => r.code)).toEqual(['CNH', 'EUR', 'JPY']);
		expect(rows[1]).toEqual({ code: 'EUR', name: 'Euro', rate: 0.9124 });
	});
});

describe('fetchExchangeRates', () => {
	it('fetches the base file and formats the snapshot', async () => {
		const fakeFetch = (async (url: string | URL | Request) => {
			expect(String(url)).toBe('https://exchange.croncopia.com/latest/EUR.json');
			return new Response(
				JSON.stringify({
					base: 'EUR',
					timestamp: '2026-07-02T20:50:02.967Z',
					rates: { USD: 1.096, GBP: 0.8599 }
				})
			);
		}) as typeof fetch;

		const snap = await fetchExchangeRates('EUR', fakeFetch);
		expect(snap.base).toBe('EUR');
		expect(snap.lastUpdated).toBe('2026-07-02 20:50 UTC');
		expect(snap.rates.map((r) => r.code)).toEqual(['GBP', 'USD']);
	});
});
