import { writable } from 'svelte/store';

export const selectedProduct = writable(null);

function createSearchProductStore() {
	const { subscribe, set } = writable([]);

	const setProducts = (products) => {
		if (products.length > 0) {
			set(products);
		}
		set(products);
	};

	const reset = () => {
		selectedProduct.set(null);
		set([]);
	};

	/** @param {number} index */
	const selectProduct = (index) => {
		selectedProduct.set(index);
	};

	return {
		subscribe,
		setProducts,
		reset,
		selectProduct
	};
}

export const searchProductStore = createSearchProductStore();
