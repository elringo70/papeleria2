import { writable } from 'svelte/store';

export const selectedTicket = writable({});

function createDailySalesStore() {
	const { subscribe, update, set } = writable([]);

	const reset = () => {
		set([]);
	};

	const setData = (data) => {
		if (data.length > 0) {
			const tickets = data.map((ticket) => ({ ...ticket, selectedTicket: false }));

			const notCancelledTicket = tickets.findIndex((ticket) => ticket.orderStatus === 'completed');

			if (Math.sign(notCancelledTicket) > 0) {
				tickets[notCancelledTicket].selectedTicket = true;
				selectedTicket.set(tickets[notCancelledTicket]);
			}

			set(tickets);
		} else {
			set([]);
		}
	};

	/** @param {number} ticket */
	const selectTicket = (ticket) => {
		update((tickets) => {
			for (let i = 0; i < tickets.length; i++) {
				tickets[i].selectedTicket = false;
			}

			tickets[ticket].selectedTicket = true;

			selectedTicket.set(tickets[ticket]);

			return [...tickets];
		});
	};

	return {
		subscribe,
		reset,
		setData,
		selectTicket
	};
}

export const dailySalesStore = createDailySalesStore();
