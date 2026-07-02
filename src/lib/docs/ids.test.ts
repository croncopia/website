import { describe, expect, it } from 'vitest';
import { fetchIds, idRules } from './ids';

const commodityIndex = {
	energy: { brent_crude: '/latest/energy/brent_crude.json', diesel: '/latest/energy/diesel.json' },
	metals: { gold: '/latest/metals/gold.json' }
};

describe('idRules', () => {
	it('picks category keys from the commodity index', () => {
		expect(idRules.energy.pick(commodityIndex)).toEqual(['brent_crude', 'diesel']);
		expect(idRules.metals.pick(commodityIndex)).toEqual(['gold']);
	});

	it('picks symbols from the exchange index', () => {
		expect(idRules.exchange.pick({ symbols: ['EUR', 'USD'], locations: {} })).toEqual([
			'EUR',
			'USD'
		]);
	});

	it('builds mirrored /api paths for an id', () => {
		expect(idRules.energy.pathFor('diesel')).toBe('api/energy/diesel.json');
		expect(idRules.metals.pathFor('gold')).toBe('api/metals/gold.json');
		expect(idRules.exchange.pathFor('EUR')).toBe('api/exchange/EUR.json');
	});

	it('returns [] for malformed indexes', () => {
		expect(idRules.energy.pick({})).toEqual([]);
		expect(idRules.exchange.pick({})).toEqual([]);
	});
});

describe('fetchIds', () => {
	it('fetches the index and applies the rule', async () => {
		const fakeFetch = (async () => new Response(JSON.stringify(commodityIndex))) as typeof fetch;
		expect(await fetchIds('energy', fakeFetch)).toEqual(['brent_crude', 'diesel']);
	});

	it('returns [] for unknown rules and failed fetches', async () => {
		const failingFetch = (async () => new Response('nope', { status: 503 })) as typeof fetch;
		expect(await fetchIds('stocks')).toEqual([]);
		expect(await fetchIds('energy', failingFetch)).toEqual([]);
	});
});
