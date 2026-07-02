import { describe, expect, it } from 'vitest';
import { toCommoditySeries, type CommodityPayload } from './commodities';

const flat = (price: number): CommodityPayload => ({
	base: 'USD',
	price,
	sources: 1,
	timestamp: '2026-07-02T20:00:34.085Z'
});

const perUnit: CommodityPayload = {
	base: 'USD',
	price: { troy_ounce: 4115.44, gram: 132.31, kilogram: 132314.62, metric_ton: 132314618.5 },
	sources: 5,
	timestamp: '2026-07-02T20:02:11.812Z'
};

describe('toCommoditySeries', () => {
	it('uses the label and unit label from map.json', () => {
		const row = toCommoditySeries('brent_crude', '/latest/energy/brent_crude.json', flat(71.59));
		expect(row).toEqual({
			file: 'latest/energy/brent_crude.json',
			name: 'Brent Crude',
			price: 71.59,
			unit: 'USD/bbl'
		});
	});

	it('falls back to the id and base currency for unmapped commodities', () => {
		const row = toCommoditySeries('unobtainium', '/latest/metals/unobtainium.json', flat(9999));
		expect(row.name).toBe('unobtainium');
		expect(row.unit).toBe('USD');
	});

	it('picks the mapped unit key from per-unit prices', () => {
		const row = toCommoditySeries('gold', '/latest/metals/gold.json', perUnit);
		expect(row.price).toBe(4115.44);
		expect(row.unit).toBe('USD/ozt');
	});

	it('falls back to the first unit key when unmapped', () => {
		const row = toCommoditySeries('unobtainium', '/latest/metals/unobtainium.json', perUnit);
		expect(row.price).toBe(4115.44);
		expect(row.unit).toBe('USD/troy_ounce');
	});
});
