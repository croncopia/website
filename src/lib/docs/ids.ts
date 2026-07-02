import { COMMODITY_API } from '$lib/data/commodities';
import { EXCHANGE_API } from '$lib/data/exchange';
import { getJson, type Fetch } from '$lib/data/http';

/**
 * Rules for pulling "all possible ids" out of the upstream index files.
 * A docs page opts in with `ids: <rule name>` in its frontmatter; the id
 * picker in the code panel is populated from the rule and `pathFor` builds
 * the mirrored file path for whichever id is selected.
 */
export interface IdRule {
	indexUrl: string;
	pick: (index: unknown) => string[];
	pathFor: (id: string) => string;
}

interface CommodityIndex {
	energy?: Record<string, string>;
	metals?: Record<string, string>;
}

interface ExchangeIndex {
	symbols?: string[];
}

export const idRules: Record<string, IdRule> = {
	energy: {
		indexUrl: `${COMMODITY_API}/latest/index.json`,
		pick: (index) => Object.keys((index as CommodityIndex).energy ?? {}),
		pathFor: (id) => `api/energy/${id}.json`
	},
	metals: {
		indexUrl: `${COMMODITY_API}/latest/index.json`,
		pick: (index) => Object.keys((index as CommodityIndex).metals ?? {}),
		pathFor: (id) => `api/metals/${id}.json`
	},
	exchange: {
		indexUrl: `${EXCHANGE_API}/latest/index.json`,
		pick: (index) => (index as ExchangeIndex).symbols ?? [],
		pathFor: (id) => `api/exchange/${id}.json`
	}
};

/** All ids for a rule, or [] when the rule is unknown or the index is down. */
export async function fetchIds(rule: string, fetchFn: Fetch = fetch): Promise<string[]> {
	const r = idRules[rule];
	if (!r) return [];
	try {
		return r.pick(await getJson(fetchFn, r.indexUrl));
	} catch {
		return [];
	}
}
