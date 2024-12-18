import { writable } from 'svelte/store';

/**
 * @typedef {string|null} ModalStore
 */

const createModalStore = () => {
	/**
	 * @type {import('svelte/store').Writable<ModalStore>}
	 */
	const { subscribe, set } = writable(null);

	/**
	 * @param {('search-modal'|'product-modal'|'checkout-modal'|'dailysales-modal')} modal
	 */
	const setModal = (modal) => {
		set(modal);
	};

	const resetModalStore = () => {
		set(null);
	};

	return {
		subscribe,
		setModal,
		resetModalStore
	};
};

export const modalStore = createModalStore();
