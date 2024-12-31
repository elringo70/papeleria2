import { writable, get } from 'svelte/store';

/**
 * @typedef {Object} Address
 * @property {string} street
 * @property {string} number
 * @property {string} [municipality]
 * @property {string} [city]
 * @property {string} [state]
 * @property {string} [place_id]
 */

/** @type {Address} */
const initialValuesSelectedAddress = {
	street: '',
	number: '',
	municipality: '',
	city: '',
	state: '',
	place_id: ''
};

/**
 * writable store for handling a string variable.
 * @type {import('svelte/store').Writable<Address>}
 */
export const selectedAddress = writable(initialValuesSelectedAddress);

function addressStore() {
	const { subscribe, set } = writable([]);

	/**
	 * @param {string} string
	 */
	const fetchAddress = async (string) => {
		let url = `https://nominatim.openstreetmap.org/?addressdetails=1&q=${string}&format=json&limit=5`;

		if (string !== '') {
			try {
				const response = await fetch(url);
				const data = await response.json();
				console.log(data);

				set(data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	/**
	 * @param {MouseEvent} e
	 */
	const selectAddress = (e) => {
		if (!e.target) return;
		const index = e.target.value;

		const addresses = get(address);
		const findAddress = addresses[index];

		selectedAddress.set({
			street: findAddress.address.road,
			municipality: findAddress.address.residential ?? findAddress.address.neighbourhood,
			city: findAddress.address.city ?? findAddress.address.county,
			state: findAddress.address.state,
			place_id: findAddress.place_id
		});

		set([]);
	};

	const resetAddress = () => {
		set([]);
		selectedAddress.set(initialValuesSelectedAddress);
	};

	return {
		subscribe,
		fetchAddress,
		selectAddress,
		resetAddress
	};
}

export const address = addressStore();
