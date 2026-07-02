import { redirect } from '@sveltejs/kit';
import { docPages } from '$lib/docs';

export const load = () => {
	redirect(307, `/docs/${docPages[0].slug}`);
};
