import { describe, expect, it } from 'vitest';
import { match } from '../../params/feed';
import { mirrorHeaders, upstreamUrl } from './mirror';

describe('upstreamUrl', () => {
	it('maps commodity paths to the commodity CDN', () => {
		expect(upstreamUrl('energy', 'brent_crude')).toBe(
			'https://commodity.croncopia.com/latest/energy/brent_crude.json'
		);
		expect(upstreamUrl('metals', 'gold')).toBe(
			'https://commodity.croncopia.com/latest/metals/gold.json'
		);
	});

	it('maps exchange paths to the exchange CDN', () => {
		expect(upstreamUrl('exchange', 'USD')).toBe('https://exchange.croncopia.com/latest/USD.json');
		expect(upstreamUrl('exchange', 'index')).toBe(
			'https://exchange.croncopia.com/latest/index.json'
		);
	});

	it('rejects unknown categories and unsafe ids', () => {
		expect(upstreamUrl('stocks', 'aapl')).toBeNull();
		expect(upstreamUrl('energy', '../secrets')).toBeNull();
		expect(upstreamUrl('energy', 'a/b')).toBeNull();
		expect(upstreamUrl('energy', '')).toBeNull();
	});
});

describe('feed param matcher', () => {
	it('matches only mirrored categories', () => {
		expect(match('energy')).toBe(true);
		expect(match('metals')).toBe(true);
		expect(match('exchange')).toBe(true);
		expect(match('admin')).toBe(false);
	});
});

describe('mirrorHeaders', () => {
	it('passes through upstream content-type and caching', () => {
		const headers = mirrorHeaders(
			new Headers({ 'content-type': 'application/json', 'cache-control': 'max-age=600' })
		);
		expect(headers).toMatchObject({
			'content-type': 'application/json',
			'cache-control': 'max-age=600',
			'access-control-allow-origin': '*'
		});
	});

	it('falls back to sane defaults', () => {
		expect(mirrorHeaders(new Headers())).toMatchObject({
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'public, max-age=300'
		});
	});
});
