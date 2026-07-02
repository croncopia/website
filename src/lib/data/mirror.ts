import { COMMODITY_API } from '$lib/data/commodities';
import { EXCHANGE_API } from '$lib/data/exchange';

/**
 * Mirror of the upstream feed CDNs:
 *   /energy/{id}.json   → commodity.croncopia.com/latest/energy/{id}.json
 *   /metals/{id}.json   → commodity.croncopia.com/latest/metals/{id}.json
 *   /exchange/{id}.json → exchange.croncopia.com/latest/{id}.json
 * Add a feed here and it's served automatically by the [category=feed] route.
 */
const upstreams: Record<string, (id: string) => string> = {
	energy: (id) => `${COMMODITY_API}/latest/energy/${id}.json`,
	metals: (id) => `${COMMODITY_API}/latest/metals/${id}.json`,
	exchange: (id) => `${EXCHANGE_API}/latest/${id}.json`
};

export const feedCategories = Object.keys(upstreams);

/** Upstream URL for a mirrored path, or null if the category/id is invalid. */
export function upstreamUrl(category: string, id: string): string | null {
	const build = upstreams[category];
	if (!build || !/^[A-Za-z0-9_]+$/.test(id)) return null;
	return build(id);
}

/** Headers for a mirrored response: keep upstream caching, stay CORS-open. */
export function mirrorHeaders(upstream: Headers): HeadersInit {
	return {
		'content-type': upstream.get('content-type') ?? 'application/json; charset=utf-8',
		'cache-control': upstream.get('cache-control') ?? 'public, max-age=300',
		'access-control-allow-origin': '*'
	};
}
