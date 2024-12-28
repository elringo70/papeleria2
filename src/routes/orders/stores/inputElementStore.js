import { writable } from 'svelte/store';

export const focusInputElementStore = writable(null);

/** @param {Function} fn */
export const setFocusInputElement = (fn) => {
	focusInputElementStore.set(fn);
};
