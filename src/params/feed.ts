import type { ParamMatcher } from '@sveltejs/kit';
import { feedCategories } from '$lib/data/mirror';

export const match: ParamMatcher = (param) => feedCategories.includes(param);
