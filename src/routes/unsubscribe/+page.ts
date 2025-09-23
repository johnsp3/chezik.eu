import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const email = url.searchParams.get('email') || '';
	const token = url.searchParams.get('token') || '';
	
	return {
		email,
		token
	};
};
