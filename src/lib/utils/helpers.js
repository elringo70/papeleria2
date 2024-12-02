export const filterProductObject = (data) => {
	let ids = [];
	let productStock = {};

	for (const [key, value] of Object.entries(data)) {
		if (key.includes('products')) {
			ids.push(value);
			const matches = key.match(/\[(.*?)\]/g);

			if (matches) {
				for (let i = 0; i < matches.length; ++i) {
					const match = matches[i];
					const substring = match.substring(1, match.length - 1);
					productStock = {
						...productStock,
						[value]: substring
					};
				}
			}
		}
	}

	return { productStock, ids };
};

export const requiredStock = (searchProducts, productStock) => {
	let stockIds = [];
	let updatedProductStock = {};
	let products = [];

	searchProducts.forEach((product) => {
		if (product.requiredStock) {
			for (const [key, value] of Object.entries(productStock)) {
				if (
					product._id.toString() === key.toString() &&
					Number(value) > Number(product.stock.stock)
				) {
					stockIds.push(key);
				} else if (product._id.toString() === key.toString()) {
					updatedProductStock = {
						...updatedProductStock,
						[key]: Number(product.stock.stock) - Number(value)
					};
				}
			}
		}

		for (const [key, value] of Object.entries(productStock)) {
			if (product._id === key) {
				const insertedProduct = { product: product, quantity: Number(value) };
				products.push(insertedProduct);
			}
		}
	});

	return { stockIds, updatedProductStock, products };
};

export const bulkOperationTransaction = (updatedProductStock) => {
	const bulkOperation = [];

	for (let [key, value] of Object.entries(updatedProductStock)) {
		bulkOperation.push({
			updateOne: {
				filter: { _id: key },
				update: { $set: { stock: { stock: value } } }
			}
		});
	}

	return bulkOperation;
};
