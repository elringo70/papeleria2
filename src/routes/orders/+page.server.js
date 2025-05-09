import { error, fail } from '@sveltejs/kit';
import { Product } from '$models/products';
import { User } from '$models/users';
import { dbConnect, dbConnection, dbDisconnect } from '$utils/db';
import { findProductSchema, orderSchema } from './orderValidation.js';
import { validateData } from '$utils/utils';
import { Order } from '$models/orders';
import {
	bulkOperationTransaction,
	filterProductObject,
	requiredStock
} from '$lib/utils/helpers.js';

/** @type {import('./$types').Actions} */
export const actions = {
	findProduct: async ({ request }) => {
		try {
			await dbConnect();

			const form = await request.formData();
			const product = form.get('product');
			const { formData, errors } = await validateData(form, findProductSchema);

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const findProduct = await Product.findById(product);

			if (findProduct) {
				return { product: JSON.parse(JSON.stringify(findProduct)) };
			}

			return fail(404, { message: 'Producto no encontrado' });
		} catch (err) {
			console.log('Error: ', err);
			error(500);
		} finally {
			await dbDisconnect();
		}
	},
	findCustomer: async ({ request }) => {
		try {
			await dbConnect();

			const { phone } = Object.fromEntries(await request.formData());
			const findCustomer = await User.findOne({ phone: phone });

			if (findCustomer) return { customer: JSON.parse(JSON.stringify(findCustomer)) };
			return { phone: JSON.parse(JSON.stringify(phone)) };
		} catch (err) {
			console.log('Error: ', err);
			error(500);
		} finally {
			await dbDisconnect();
		}
	},
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
	},
	cancelOrder: async ({ request }) => {
		try {
			await dbConnect();

			const { id } = Object.fromEntries(await request.formData());

			await Order.findByIdAndUpdate(id, { orderStatus: 'cancelled' });

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			error(500);
		} finally {
			await dbDisconnect();
		}
	},
	submitOrder: async ({ request }) => {
		const phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

		const session = await dbConnection.startSession();
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = validateData(form, orderSchema);

			let findCustomer;
			if (form.get('customer') && phoneRegex.test(form.get('customer'))) {
				findCustomer = await User.findOne({ phone: form.get('customer') }).exec();
				if (!findCustomer) findCustomer = form.get('customer');
			} else {
				if (form.get('customer') === 'undefined') findCustomer = 'walk-in';
			}

			const data = Object.fromEntries(form);

			const { ids, productStock } = filterProductObject(data);

			const searchProducts = await Product.find({ _id: { $in: ids } });

			const { stockIds, updatedProductStock, products } = requiredStock(
				searchProducts,
				productStock
			);

			if (stockIds.length > 0) {
				return fail(400, {
					ids: stockIds,
					message: 'Inventario insuficiente'
				});
			}

			const paymentCash = form.get('input-cash') ? Number(form.get('input-cash')) : 0;
			const paymentCreditDebit = form.get('input-credit-debit')
				? Number(form.get('input-credit-debit'))
				: 0;
			const paymentETransfer = form.get('input-e-transfer')
				? Number(form.get('input-e-transfer'))
				: 0;

			const body = {
				paymentCash,
				paymentCreditDebit,
				paymentETransfer,
				customer: findCustomer,
				products,
				status: true,
				delivered: true,
				customerPayment: paymentCash + paymentCreditDebit + paymentETransfer,
				change: Number(form.get('change')),
				total: Number(form.get('total'))
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const bulkOperation = bulkOperationTransaction(updatedProductStock);

			session.startTransaction();

			await Product.bulkWrite(bulkOperation, { session });
			const order = new Order(body);
			await order.save({ session });

			await session.commitTransaction();

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			await session.abortTransaction();
			error(500);
		} finally {
			await session.endSession();
			await dbDisconnect();
		}
	},
	outstanding: async ({ request }) => {
		const phoneRegex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

		const session = await dbConnection.startSession();
		try {
			await dbConnect();

			const form = await request.formData();
			const { formData, errors } = validateData(form, orderSchema);

			let findCustomer;
			if (form.get('customer') && phoneRegex.test(form.get('customer'))) {
				findCustomer = await User.findOne({ phone: form.get('customer') }).exec();
				if (!findCustomer) findCustomer = form.get('customer');
			} else {
				if (form.get('customer') === 'undefined') findCustomer = 'walk-in';
			}

			const data = Object.fromEntries(form);

			const { ids, productStock } = filterProductObject(data);

			const searchProducts = await Product.find({ _id: { $in: ids } });

			const { stockIds, updatedProductStock, products } = requiredStock(
				searchProducts,
				productStock
			);

			if (stockIds.length > 0) {
				return fail(400, {
					ids: stockIds,
					message: 'Inventario insuficiente'
				});
			}

			const paymentCash = form.get('input-cash') ? Number(form.get('input-cash')) : 0;
			const paymentCreditDebit = form.get('input-credit-debit')
				? Number(form.get('input-credit-debit'))
				: 0;
			const paymentETransfer = form.get('input-e-transfer')
				? Number(form.get('input-e-transfer'))
				: 0;

			const body = {
				paymentCash,
				paymentCreditDebit,
				paymentETransfer,
				customer: findCustomer,
				products,
				status: true,
				delivered: true,
				customerPayment: paymentCash + paymentCreditDebit + paymentETransfer,
				change: 0,
				duePayment:
					Number(form.get('total')) - (paymentCash + paymentCreditDebit + paymentETransfer),
				total: Number(form.get('total'))
			};

			if (errors) {
				return fail(401, {
					data: formData,
					errors: errors.fieldErrors
				});
			}

			const bulkOperation = bulkOperationTransaction(updatedProductStock);

			session.startTransaction();
			await Product.bulkWrite(bulkOperation, { session });

			const order = new Order(body);
			await order.save({ session });

			await session.commitTransaction();

			return { success: true };
		} catch (err) {
			console.log('Error: ', err);
			await session.abortTransaction();
			error(500);
		} finally {
			await dbDisconnect();
		}
	}
};
