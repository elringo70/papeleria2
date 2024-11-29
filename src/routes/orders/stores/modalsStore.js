import { writable } from 'svelte/store';

function createModalsStore() {
	const { subscribe, set, update } = writable([]);

	const setModals = (modals) => {
		set(modals);
	};

	const closeModals = () => {
		update((modals) => {
			modals.forEach((modal) => {
				console.log(modal.getAttributeNode('open'));
			});
			return [...modals];
		});
	};

	return {
		subscribe,
		setModals,
		closeModals
	};
}

export const modalsStore = createModalsStore();
