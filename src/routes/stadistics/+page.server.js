import { Order } from '$models/orders';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const date = new Date(),
		y = date.getFullYear(),
		m = date.getMonth();
	const firstDay = new Date(y, m, 1);

	try {
		const orders = await Order.find(/*{ createdAt: { $gte: firstDay, $lt: date } }*/);

		return {
			orders: JSON.parse(JSON.stringify(orders))
		};
	} catch (err) {
		console.log(err);
		error(500);
	}
}
