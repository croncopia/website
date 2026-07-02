import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { mirrorHeaders, upstreamUrl } from '$lib/data/mirror';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const url = upstreamUrl(params.category, params.id);
	if (!url) error(404, 'not found');

	let upstream: Response;
	try {
		upstream = await fetch(url);
	} catch {
		error(502, 'upstream feed unavailable');
	}

	if (!upstream.ok) {
		error(upstream.status === 404 ? 404 : 502, 'not available upstream');
	}

	return new Response(upstream.body, {
		status: upstream.status,
		headers: mirrorHeaders(upstream.headers)
	});
};
