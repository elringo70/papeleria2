import { error } from '@sveltejs/kit';
import { dbConnect, dbDisconnect } from '$utils/db';

export const load = async () => {
	const cashiers = [
		{
			name: 'Luis Alvarez'
		},
		{ name: 'Jessica Toscano' }
	];

	return { cashiers: JSON.parse(JSON.stringify(cashiers)) };
};

/** @type {import('./$types').Actions} */
export const actions = {
	cashProof: async ({ request }) => {
		try {
			await dbConnect();

			const { date, cashier } = Object.fromEntries(await request.formData());

			return { cashProof: JSON.parse(JSON.stringify({ date, cashier })) };
		} catch (err) {
			console.log('Error: ', err);
			error(500);
		} finally {
			await dbDisconnect();
		}
	}
};
