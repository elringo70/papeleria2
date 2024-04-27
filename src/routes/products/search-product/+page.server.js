import { error } from '@sveltejs/kit';
import { Product } from '$models/products';
import { dbConnect, dbDisconnect } from '$utils/db';

/** @type {import('./$types').Actions} */
export const actions = {
	searchProduct: async ({ request }) => {
		try {
			await dbConnect();

			const { product } = Object.fromEntries(await request.formData());

			const findProducts = await Product.find({ product: { $regex: product, $options: 'i' } });

			return { products: JSON.parse(JSON.stringify(findProducts)) };
		} catch (err) {
			console.log('Error: ', err);
			error(500);
		} finally {
			await dbDisconnect();
		}
	}
};
