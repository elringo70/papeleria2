import { error, fail } from '@sveltejs/kit';
import { Customer } from '$models/users';
import { dbConnect, dbDisconnect } from '$utils/db';

export const load = async () => {
	try {
		await dbConnect();
		const customers = await Customer.find({});

		return { customers: JSON.parse(JSON.stringify(customers)) };
	} catch (err) {
		console.log('Error: ', err);
		error(500, err);
	} finally {
		await dbDisconnect();
	}
};

export const actions = {
	delete: async ({ request }) => {
		try {
			await dbConnect();
			const { id } = Object.fromEntries(await request.formData());

			const findCustomer = await Customer.findById(id).exec();
			if (!findCustomer) {
				return fail(404, { message: 'El cliente no existe' });
			}

			await Customer.findByIdAndDelete(id);

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			error(500, err);
		} finally {
			await dbDisconnect();
		}
	}
};
