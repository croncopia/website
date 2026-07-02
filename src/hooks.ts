import type { Reroute } from '@sveltejs/kit';
import { feedCategories } from '$lib/data/mirror';

// The mirror handler lives under /api; the public contract is the root paths
// (croncopia.com/energy/brent_crude.json), so reroute those onto it.
export const reroute: Reroute = ({ url }) => {
	const [, first] = url.pathname.split('/');
	if (feedCategories.includes(first)) return `/api${url.pathname}`;
};
