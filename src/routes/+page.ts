import type { PageLoad } from './$types';
import { marketData } from '$lib/data';

export const load: PageLoad = async ({ fetch }) => {
	return { market: await marketData.getMarketData(fetch) };
};
