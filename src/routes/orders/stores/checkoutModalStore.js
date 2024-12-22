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
 * @prop {boolean} pendingBalanceText
 * @prop {boolean} checkboxCash
 * @prop {boolean} checkboxCreditDebit
 * @prop {boolean} checkboxETransfer
 */

/** @type {Payment} initialValues */
const initialValues = {
	cash: 0,
	creditDebit: 0,
	eTransfer: 0,
	total: 0,
	customerPayment: 0,
	dueBalance: 0,
	pendingBalance: false,
	pendingBalanceText: false,
	checkboxCash: true,
	checkboxCreditDebit: false,
	checkboxETransfer: false
};

/**
 * @type {import('svelte/store').Writable<Payment>}
 */
const checkoutModalStorage = writable(
	(browser && JSON.parse(localStorage.getItem('checkoutModal'))) || initialValues
);

checkoutModalStorage.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);

function createCheckouModalStore() {
	const { subscribe, update, set } = writable(get(checkoutModalStorage));

	/**
	 * @param {string} attribute
	 * @param {('cash'|'creditDebit'|'eTransfer')} value
	 */
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

	/**
	 * @param {number} cash
	 */
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

	const tooglePendingBalanceText = () => {
		update((store) => ({
			...store,
			pendingBalanceText: !store.pendingBalanceText
		}));
	};

	/**
	 * @param {boolean} value
	 */
	const setPendingBalanceText = (value) => {
		update((store) => ({
			...store,
			pendingBalanceText: value
		}));
	};

	/**
	 * @param {('checkboxCash'|'checkboxETransfer'|'checkboxCreditDebit')} method
	 * @param {boolean} value
	 */
	const setPaymentMethod = (method, value) => {
		update((store) => ({
			...store,
			[method]: value
		}));
	};

	return {
		subscribe,
		setValue,
		calculateTotal,
		reset,
		setCash,
		tooglePendingBalance,
		tooglePendingBalanceText,
		setPendingBalanceText,
		setPaymentMethod
	};
}

export const checkoutModalStore = createCheckouModalStore();

checkoutModalStore.subscribe(
	(values) => browser && localStorage.setItem('checkoutModalStorage', JSON.stringify(values))
);
