import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';

export const selectedProduct = writable(null);

/**
 * @typedef TicketDetail
 */
const initialValues = {};

/**
 * @type {import('svelte/store').Writable<TicketDetail>}
 */
const ticketDetailStorage = writable(
	(browser && JSON.parse(localStorage.getItem('ticketDetail'))) || initialValues
);

function createTicketDetailStore() {
	const { subscribe, update, set } = writable(get(ticketDetailStorage));

	const getTicketDetail = () => {
		console.log(get(ticketDetailStorage));
	};

	return {
		subscribe,
		getTicketDetail
	};
}

export const ticketDetailStore = createTicketDetailStore();

