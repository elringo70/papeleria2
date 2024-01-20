import moment from 'moment';
import { writable, get } from 'svelte/store';

function stadisticsStorage() {
	const { subscribe, set } = writable([]);

	const setStadistics = (data) => {
		set(data);
	};

	const todaySales = () => {
		const now = moment().toDate();
		const startOfDay = moment().startOf('day').toDate();

		console.log(startOfDay, now);

		const stadisticsStore = get(store);
		const totalTodaySales = stadisticsStore.filter((order) => console.log(order.createdAt));

		console.log(totalTodaySales);
	};

	return { subscribe, setStadistics, todaySales };
}

export const store = stadisticsStorage();
