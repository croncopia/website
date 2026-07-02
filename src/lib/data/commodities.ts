import type { CommoditySeries } from './types';
import { getJson, type Fetch } from './http';
import { fmtTimestamp } from '$lib/utils/format';
import map from '$lib/assets/map.json';

export const COMMODITY_API = 'https://commodity.croncopia.com';

/**
 * Display metadata for a commodity id, from src/lib/assets/map.json.
 * All fields are optional — anything missing falls back to what the
 * API payload itself provides (label → id, unit label → base currency).
 */
interface MapEntry {
	label?: string;
	/** For payloads with per-unit prices: which unit key to display. */
	unit?: string;
	/** Unit column text, e.g. "USD/ozt". */
	unitLabel?: string;
}

/** /latest/index.json: category → id → endpoint path */
type CommodityIndex = Record<string, Record<string, string>>;

export interface CommodityPayload {
	base: string;
	/** Flat price, or a price per unit keyed by unit name. */
	price: number | Record<string, number>;
	sources: number;
	timestamp: string;
}

export interface CommoditySnapshot {
	energy: CommoditySeries[];
	metals: CommoditySeries[];
	lastUpdated: string;
}

const entries = map as Record<string, MapEntry>;

export function toCommoditySeries(
	id: string,
	path: string,
	payload: CommodityPayload
): CommoditySeries {
	const entry = entries[id] ?? {};
	let price: number;
	let unit: string;

	if (typeof payload.price === 'number') {
		price = payload.price;
		unit = entry.unitLabel ?? payload.base;
	} else {
		const unitKey =
			entry.unit && entry.unit in payload.price ? entry.unit : Object.keys(payload.price)[0];
		price = payload.price[unitKey];
		unit = entry.unitLabel ?? `${payload.base}/${unitKey}`;
	}

	return { file: path.replace(/^\//, ''), name: entry.label ?? id, price, unit };
}

export async function fetchCommodities(fetchFn: Fetch = fetch): Promise<CommoditySnapshot> {
	const index = await getJson<CommodityIndex>(fetchFn, `${COMMODITY_API}/latest/index.json`);
	let latest = '';

	const loadCategory = async (category: Record<string, string> = {}) => {
		const rows = await Promise.all(
			Object.entries(category).map(async ([id, path]) => {
				try {
					const payload = await getJson<CommodityPayload>(fetchFn, COMMODITY_API + path);
					if (payload.timestamp > latest) latest = payload.timestamp;
					return toCommoditySeries(id, path, payload);
				} catch {
					// one flaky endpoint shouldn't take the whole table down
					return null;
				}
			})
		);
		return rows.filter((row) => row !== null);
	};

	const [energy, metals] = await Promise.all([
		loadCategory(index.energy),
		loadCategory(index.metals)
	]);

	if (energy.length === 0 && metals.length === 0) {
		throw new Error('commodity API returned no usable data');
	}

	return { energy, metals, lastUpdated: fmtTimestamp(latest) };
}
