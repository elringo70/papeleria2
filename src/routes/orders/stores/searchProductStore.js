import { writable } from 'svelte/store';

export const selectedProduct = writable(null);

function createSearchProductStore() {
	const { subscribe, set, update } = writable([]);

	const setProducts = (products) => {
		if (products.length > 0) {
			set(products);
			selectedProduct.set(0);
		}
		set(products);
	};

	const reset = () => {
		selectedProduct.set(null);
		set([]);
	};

	/** @param {number} index */
	const selectProduct = (index) => {
		update((store) => {
			selectedProduct.set(index);
			return [...store];
		});
	};

	return {
		subscribe,
		setProducts,
		reset,
		selectProduct
	};
}

export const searchProductStore = createSearchProductStore();
