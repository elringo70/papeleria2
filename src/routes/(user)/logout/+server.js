import { redirect } from '@sveltejs/kit';
import { signOut } from 'firebase/auth';
import { auth } from '../../../utils/firebase';

/** @type {import('./$types').RequestHandler} */
export async function GET({ cookies }) {
	cookies.delete('session', { path: '/' });
	cookies.delete('refreshToken', { path: '/' });
	await signOut(auth);
	redirect(303, '/');
}
