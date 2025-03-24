import { error, redirect } from '@sveltejs/kit';

const expiresIn = 1000 * 60 * 60 * 27 * 7;

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	try {
		return { user: locals.user };
	} catch (err) {
		console.log('Error:', err);
		error(500);
	}
};

/** @type {import('./$types').Actions} */
export const actions = {
	loginWithEmailAndPassword: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			cookies.set('session', body.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'none',
				secure: true,
				maxAge: expiresIn
			});

			cookies.set('refreshToken', body.refreshToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'none',
				secure: true,
				maxAge: expiresIn
			});
		} catch (error) {
			console.log(error);
		}
		redirect(303, '/orders');
	},
	loginWithGoogle: async ({ request, cookies }) => {
		const body = Object.fromEntries(await request.formData());

		try {
			cookies.set('session', body.token, {
				path: '/',
				httpOnly: true,
				sameSite: 'none',
				secure: true,
				maxAge: expiresIn
			});
		} catch (error) {
			console.log(error);
		}
		redirect(303, '/orders');
	}
};
