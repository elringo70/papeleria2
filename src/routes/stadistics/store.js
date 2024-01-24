import moment from 'moment';
import { writable, get } from 'svelte/store';

/**
 * @typedef {Object} Dashboard
 * @property {string} todaySales
 * @property {string} monthSales
 * @property {string} sales
 * @property {string} productOfMonth
 */
/**@type {Dashboard} */
const initialValues = {
	todaySales: '',
	monthSales: '',
	sales: '',
	productOfMonth: ''
};

export const dashboard = writable(initialValues);

function stadisticsStorage() {
	const { subscribe, update } = writable([]);

	const onLoad = () => {
		getMonthSales();
		getTodaySales();
	};

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
		dashboard.update((values) => {
			return {
				...values,
				monthSales: totalSales(monthSales).toFixed(2).toString()
			};
		});
	};

	const getTodaySales = () => {
		const startOfDay = moment().startOf('day').toDate();

		const stadisticsStore = get(store);
		const totalTodaySales = stadisticsStore.filter(
			(order) => moment(order.createdAt).toDate() > startOfDay
		);

		const todaySales = getTotalBySale(totalTodaySales);
		dashboard.update((values) => {
			return {
				...values,
				todaySales: totalSales(todaySales).toString()
			};
		});
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

	const getSalesFromYesterday = () => {
		const sales = get(store);
		const yesterdayStartOfDay = moment().subtract(1, 'day').startOf('day').toDate();
		const yesterdayEndOfDay = moment().subtract(1, 'day').endOf('day').toDate();

		return sales.filter(
			(sale) =>
				moment(sale.createdAt).toDate() > yesterdayStartOfDay &&
				moment(sale.createdAt).toDate() < yesterdayEndOfDay
		);
	};

	const getTotalSalesFromYesterday = () => {
		const yesterdaySales = getSalesFromYesterday();
		const yesterdayTotalSales = getTotalBySale(yesterdaySales);
		return totalSales(yesterdayTotalSales);
	};

	/** @returns {number} */
	const getTodayPercentege = () => {
		const yesterdaySales = Number(getTotalSalesFromYesterday());
		const todaySales = Number(getTodaySales());

		let total = (100 * todaySales) / yesterdaySales - 100;

		return Number(total.toFixed(2));
	};

	const reduceProductsMonth = () => {
		const sales = get(store);
		const products = [];

		sales.forEach((sale) => {
			sale.products.forEach((product) => {
				products.push(product);
			});
		});

		return products.reduce((accumulator, currentValue) => {
			const existingProduct = accumulator.find(
				(product) => product.product._id === currentValue.product._id
			);

			if (existingProduct) {
				return accumulator.map((element) => {
					if (element.product._id === currentValue.product._id) {
						return {
							...element,
							quantity: element.quantity + currentValue.quantity
						};
					}

					return element;
				});
			}

			return [...accumulator, currentValue];
		}, []);
	};

	const getProductOfMonth = () => {
		const reducedProducts = reduceProductsMonth();
		const productOfMonth = reducedProducts.sort((p1, p2) =>
			p1.quantity < p2.quantity ? 1 : p1.quantity > p2.quantity ? -1 : 0
		);

		return {
			product: productOfMonth[0].product,
			quantity: productOfMonth[0].quantity
		};
	};

	return {
		subscribe,
		setStadistics,
		getTodayPercentege,
		getProductOfMonth,
		onLoad
	};
}

export const store = stadisticsStorage();
