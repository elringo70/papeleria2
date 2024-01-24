import moment from 'moment';
import { writable, get, derived } from 'svelte/store';

/**
 * @typedef {Object} Dashboard
 * @property {string} todaySales
 * @property {string} monthSales
 * @property {string} sales
 * @property {string} productOfMonth
 * @property {boolean} loaded
 */
/**@type {Dashboard} */

const initialValues = {
	todaySales: '',
	monthSales: '',
	sales: '',
	productOfMonth: '',
	loaded: false
};

export const dataStore = writable(initialValues);

export const setRawData = (/** @type {Dashboard} */ initialValues) => {
	dataStore.set({ ...initialValues, loaded: true });
};

// TODAY SALES
// es un store derivado. Cuando los valores del store principal cambian, esta store derivada se actualiza
// y procesa los valores del store principal para devolver el valor que necesitamos.
export const todaySales = derived(dataStore, ($dataStore) => getTodaySales($dataStore.sales));

const getTodaySales = (sales) => {
	const startOfDay = moment().startOf('day').toDate();

	const filteredSales = sales.filter((sale) => moment(sale.createdAt).toDate() > startOfDay);

	const todaySales = getTotalBySale(filteredSales);

	return totalSales(todaySales).toString();
};

/////

// Shared functions

const getTotalBySale = (sales) => {
	return sales.map((products) => {
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



// // export const yesterdaySales = derived(dataStore, ($dataStore) => $dataStore.yesterdaySales);
// export const monthSales = derived(dataStore, ($dataStore) => $dataStore.monthSales);
// // export const productOfMonth = derived(dataStore, ($dataStore) => $dataStore.productOfMonth);

// const getMonthSales = (orders) => {
// 	const startOfMonth = moment().startOf('month').toDate();

// 	const totalTodaySales = orders.filter(
// 		(order) => moment(order.createdAt).toDate() > startOfMonth
// 	);

// 	const monthSales = getTotalBySale(totalTodaySales);

// 	dashboard.update((values) => {
// 		return {
// 			...values,
// 			monthSales: totalSales(monthSales).toFixed(2).toString()
// 		};
// 	});
// };

// function stadisticsStorage() {
// 	const { subscribe, update } = writable([]);

// 	const onLoad = () => {
// 		getMonthSales();
// 		getTodaySales();
// 	};

// 	const setStadistics = (data) => {
// 		update(() => {
// 			if (data.length > 0) {
// 				const tickets = data.filter((ticket) => ticket.orderStatus === 'completed');
// 				return [...tickets];
// 			} else {
// 				return [];
// 			}
// 		});
// 	};

// 	const getSalesFromYesterday = () => {
// 		const sales = get(store);
// 		const yesterdayStartOfDay = moment().subtract(1, 'day').startOf('day').toDate();
// 		const yesterdayEndOfDay = moment().subtract(1, 'day').endOf('day').toDate();

// 		return sales.filter(
// 			(sale) =>
// 				moment(sale.createdAt).toDate() > yesterdayStartOfDay &&
// 				moment(sale.createdAt).toDate() < yesterdayEndOfDay
// 		);
// 	};

// 	const getTotalSalesFromYesterday = () => {
// 		const yesterdaySales = getSalesFromYesterday();
// 		const yesterdayTotalSales = getTotalBySale(yesterdaySales);
// 		return totalSales(yesterdayTotalSales);
// 	};

// 	/** @returns {number} */
// 	const getTodayPercentege = () => {
// 		const yesterdaySales = Number(getTotalSalesFromYesterday());
// 		const todaySales = Number(getTodaySales());

// 		let total = (100 * todaySales) / yesterdaySales - 100;

// 		return Number(total.toFixed(2));
// 	};

// 	const reduceProductsMonth = () => {
// 		const sales = get(store);
// 		const products = [];

// 		sales.forEach((sale) => {
// 			sale.products.forEach((product) => {
// 				products.push(product);
// 			});
// 		});

// 		return products.reduce((accumulator, currentValue) => {
// 			const existingProduct = accumulator.find(
// 				(product) => product.product._id === currentValue.product._id
// 			);

// 			if (existingProduct) {
// 				return accumulator.map((element) => {
// 					if (element.product._id === currentValue.product._id) {
// 						return {
// 							...element,
// 							quantity: element.quantity + currentValue.quantity
// 						};
// 					}

// 					return element;
// 				});
// 			}

// 			return [...accumulator, currentValue];
// 		}, []);
// 	};

// 	const getProductOfMonth = () => {
// 		const reducedProducts = reduceProductsMonth();
// 		const productOfMonth = reducedProducts.sort((p1, p2) =>
// 			p1.quantity < p2.quantity ? 1 : p1.quantity > p2.quantity ? -1 : 0
// 		);

// 		return {
// 			product: productOfMonth[0].product,
// 			quantity: productOfMonth[0].quantity
// 		};
// 	};

// 	return {
// 		subscribe,
// 		setStadistics,
// 		getTodayPercentege,
// 		getProductOfMonth,
// 		onLoad
// 	};
// }



// export const store = stadisticsStorage();
