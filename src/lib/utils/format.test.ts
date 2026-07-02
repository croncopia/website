import { describe, expect, it } from 'vitest';
import { fmtPrice, fmtRate, fmtTimestamp } from './format';

describe('fmtTimestamp', () => {
	it('formats ISO timestamps as a compact UTC string', () => {
		expect(fmtTimestamp('2026-07-02T20:02:11.812Z')).toBe('2026-07-02 20:02 UTC');
	});

	it('returns an empty string for missing input', () => {
		expect(fmtTimestamp('')).toBe('');
	});
});

describe('fmtPrice', () => {
	it('always shows two decimals', () => {
		expect(fmtPrice(74.32)).toBe('74.32');
		expect(fmtPrice(81.6)).toBe('81.60');
		expect(fmtPrice(246)).toBe('246.00');
	});

	it('adds thousands separators', () => {
		expect(fmtPrice(2384.6)).toBe('2,384.60');
		expect(fmtPrice(32410)).toBe('32,410.00');
	});
});

describe('fmtRate', () => {
	it('rounds large rates to one decimal with separators', () => {
		expect(fmtRate(89500)).toBe('89,500');
		expect(fmtRate(1182.5)).toBe('1,182.5');
	});

	it('keeps three significant figures for tiny rates', () => {
		expect(fmtRate(0.000419)).toBe('0.000419');
		expect(fmtRate(0.001014)).toBe('0.00101');
	});

	it('shows up to the requested precision otherwise', () => {
		expect(fmtRate(1.5124)).toBe('1.5124');
		expect(fmtRate(1.0)).toBe('1.00');
		expect(fmtRate(3.6725, 2)).toBe('3.67');
	});
});
