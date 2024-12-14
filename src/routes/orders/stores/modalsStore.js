import { writable } from 'svelte/store';

/**
 * @param {HTMLDialogElement[]} initialValues
 */
export const createModalStore = (initialValues) => {
	const { subscribe } = writable(initialValues);

	return {
		subscribe
	};
};
