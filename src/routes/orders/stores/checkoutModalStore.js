import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

/**
 * @typedef Payment
 * @prop {number} cash
 * @prop {number} creditDebit
 * @prop {number} eTransfer
 * @prop {number} total
 * @prop {number} customerPayment
 * @prop {number} dueBalance
 * @prop {boolean} pendingBalance
 */

/** @type {Payment} */
const initialValues = {
	cash: 0,
	creditDebit: 0,
	eTransfer: 0,
	total: 0,
	customerPayment: 0,
	dueBalance: 0,
	pendingBalance: false
};

const checkoutModalStorage = writable(
	(browser && JSON.parse(localStorage.getItem('checkoutModal'))) || initialValues
);

checkoutModalStorage.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);

function createCheckouModalStore() {
	const { subscribe, update, set } = writable(get(checkoutModalStorage));

	const setValue = (attribute, value) => {
		update((store) => ({
			...store,
			[attribute]: Number(value)
		}));

		calculateTotal();
	};

	const calculateTotal = () => {
		update((store) => ({
			...store,
			customerPayment: store.cash + store.creditDebit + store.eTransfer,
			dueBalance: store.total - (store.cash + store.creditDebit + store.eTransfer)
		}));
	};

	const reset = () => {
		set(initialValues);
	};

	const setCash = (cash) => {
		update((store) => ({
			...store,
			cash: cash
		}));
	};

	const tooglePendingBalance = () => {
		update((store) => ({
			...store,
			pendingBalance: !store.pendingBalance
		}));
	};

	return {
		subscribe,
		setValue,
		calculateTotal,
		reset,
		setCash,
		tooglePendingBalance
	};
}

export const checkoutModalStore = createCheckouModalStore();

checkoutModalStore.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);
