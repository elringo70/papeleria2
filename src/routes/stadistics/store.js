import moment from 'moment';
import { writable, get } from 'svelte/store';

function stadisticsStorage() {
	const { subscribe, update } = writable([]);

	const setStadistics = (data) => {
		update(() => {
			if (data.length > 0) {
				const tickets = data.filter((ticket) => ticket.orderStatus === 'completed');
				return [...tickets];
			} else {
				return [];
			}
		});
	};

	const getMonthSales = () => {
		const startOfMonth = moment().startOf('month').toDate();

		const stadisticsStore = get(store);
		const totalTodaySales = stadisticsStore.filter(
			(order) => moment(order.createdAt).toDate() > startOfMonth
		);

		const monthSales = getTotalBySale(totalTodaySales);
		return totalSales(monthSales).toString();
	};

	const getTodaySales = () => {
		const startOfDay = moment().startOf('day').toDate();

		const stadisticsStore = get(store);
		const totalTodaySales = stadisticsStore.filter(
			(order) => moment(order.createdAt).toDate() > startOfDay
		);

		const todaySales = getTotalBySale(totalTodaySales);
		return totalSales(todaySales).toString();
	};

	const getTotalBySale = (todaySales) => {
		return todaySales.map((products) => {
			const initialValue = 0;
			return products.products.reduce(
				(accumulator, currentValue) =>
					accumulator + currentValue.product.price * currentValue.quantity,
				initialValue
			);
		});
	};

	const totalSales = (totalProducts) => {
		const initialValue = 0;
		return totalProducts.reduce(
			(accumulator, currentValue) => accumulator + currentValue,
			initialValue
		);
	};

	return { subscribe, setStadistics, getTodaySales, getMonthSales };
}

export const store = stadisticsStorage();
