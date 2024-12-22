import { writable } from 'svelte/store';

const initialValues = {
	cash: true,
	creditDebit: false,
	eTransfer: false
};

function createPaymentMethodsStore() {
	const { subscribe, update, set } = writable(initialValues);

	/**
	 * @param {string} attribute
	 */
	const setValue = (attribute) => {
		update((store) => ({
			...store,
			[attribute]: !store[attribute]
		}));
	};

	const reset = () => {
		set(initialValues);
	};

	return {
		subscribe,
		setValue,
		reset
	};
}

export const paymentMethodsStore = createPaymentMethodsStore();
