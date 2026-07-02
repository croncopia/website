import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDocPage } from '$lib/docs';
import { fetchIds } from '$lib/docs/ids';

export const load: PageLoad = async ({ params, fetch }) => {
	const page = getDocPage(params.slug);
	if (!page) error(404, 'no such docs page');

	// live example response via our own mirror; the panel hides if it fails
	const loadResponse = async () => {
		if (!page.example) return '';
		try {
			const res = await fetch(`/${page.example}`);
			if (!res.ok) return '';
			return JSON.stringify(await res.json(), null, 2);
		} catch {
			return '';
		}
	};

	const [response, ids] = await Promise.all([
		loadResponse(),
		page.ids ? fetchIds(page.ids, fetch) : Promise.resolve([])
	]);

	const exampleId = page.example.split('/').pop()?.replace(/\.json$/, '') ?? '';

	return { page, response, ids, exampleId };
};
