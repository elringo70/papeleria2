<script>
	import { setContext, onMount } from 'svelte';

	/* STORES */
	import { tickets, selectedTicket } from './stores/store';
	import { dailySalesStore } from './stores/dailySalesStore';
	import { modalStore } from './stores/modalsStore';

	/* COMPONENTS */
	import PurchaseSummary from '$lib/components/order/PurchaseSummary.svelte';
	import TicketDetail from '$lib/components/order/TicketDetail.svelte';
	import TicketList from '$lib/components/order/TicketList.svelte';
	import ProductInput from '$lib/components/order/ProductInput.svelte';

	/* MODALS */
	import CheckoutModal from './components/CheckoutModal.svelte';
	import CustomerSearchModal from './components/CustomerSearchModal.svelte';
	import SearchProductModal from './components/SearchProductModal.svelte';
	import DailySalesModal from './components/DailySalesModal.svelte';

	/** @type {import('./$types').ActionData} */
	export let form;

	/** @type {HTMLDialogElement} checkoutModal */
	let checkoutModal;
	/** @type {HTMLDialogElement} searchProductModal */
	let searchProductModal;
	/** @type {HTMLDialogElement} elementCustomerSearchModal */
	let elementCustomerSearchModal;
	/** @type {HTMLDialogElement} dailySalesModal */
	let dailySalesModal;
	/** @function
	 * @name handleCheckoutModal */
	let handleCheckoutModal;
	/** @type {Array.<HTMLDialogElement>} modals */
	let modals;
	let bindInputElement;

	const focusInputElement = () => {
		setTimeout(() => {
			bindInputElement.focus();
			bindInputElement.select();
		}, 100);
	};

	/**
	 * @param {KeyboardEvent} event
	 * @returns {void}
	 */
	const onKeyDown = (event) => {
		switch (event.key) {
			case 'F6':
			case 'F8':
			case 'F10':
			case 'F12':
				modals.forEach((modal) => {
					if (modal.hasAttribute('open')) modalStore.setModal(modal.getAttribute('data-modal'));
				});
				break;
			case 'Escape':
				focusInputElement();
				break;
		}

		if ($modalStore !== null) {
			switch ($modalStore) {
				case 'checkout-modal':
					handleCheckoutModal(event);
					break;
			}

			if (event.key === 'Escape') {
				modalStore.resetModalStore();
			}
		} else {
			switch (event.key) {
				case 'F6':
					event.preventDefault();
					showCustomerSearchModal();
					break;
				case 'F8':
					event.preventDefault();
					showDailySalesModal();
					break;
				case 'F10':
					event.preventDefault();
					showSearchProductModal();
					break;
				case 'F12':
					event.preventDefault();
					showCheckoutModal();
					break;
			}
		}
	};

	const getDailySales = async () => {
		const fromDate = new Date();
		const toDate = new Date();

		try {
			const response = await fetch(`/api/orders?fromDate=${fromDate}&toDate=${toDate}`);
			const data = await response.json();
			dailySalesStore.setData(data);
		} catch (error) {
			console.log(error);
		}
	};

	const showCheckoutModal = () => {
		if ($selectedTicket.products.length > 0) checkoutModal.showModal();
	};

	const showCustomerSearchModal = () => {
		elementCustomerSearchModal.showModal();
	};

	const showDailySalesModal = async () => {
		await getDailySales();
		if ($dailySalesStore.length > 0) {
			dailySalesStore.selectTicket(0);
		}

		dailySalesModal.showModal();
	};

	const showSearchProductModal = () => {
		searchProductModal.showModal();
	};

	onMount(() => {
		bindInputElement = document.getElementById('product');
		modals = [checkoutModal, searchProductModal, elementCustomerSearchModal, dailySalesModal];
		focusInputElement();
	});

	setContext('selectedTicket', selectedTicket);
	setContext('tickets', tickets);
	setContext('focusInputElement', focusInputElement);
</script>

<svelte:window on:keydown={onKeyDown} />

<svelte:head>
	<title>Caja</title>
</svelte:head>

<section class="grid h-[calc(100vh-56px)] grid-cols-12 grid-rows-6 gap-4 bg-gray-100 p-7">
	<!-- Ticket List -->
	<div
		class="col-span-2 row-span-6 row-start-1 flex h-full flex-col overflow-auto rounded bg-white shadow-md"
	>
		<TicketList {showCustomerSearchModal} />
	</div>

	<!-- Add Product Input Component -->
	<div class="col-span-7 row-span-2 row-start-1 rounded bg-white shadow-md">
		<ProductInput {showSearchProductModal} {showDailySalesModal} {bindInputElement} />
	</div>

	<!-- Ticket Detail -->
	<div class="col-span-7 row-span-4 row-start-3 rounded bg-white shadow-md">
		<TicketDetail />
	</div>

	<!-- Purchase summary -->
	<div class="col-span-3 row-span-6 row-start-1 rounded bg-white p-5 shadow-md">
		<PurchaseSummary {showCheckoutModal} />
	</div>
</section>

<SearchProductModal bind:dialog={searchProductModal} />
<CustomerSearchModal bind:dialog={elementCustomerSearchModal} />
<CheckoutModal Form={form} bind:dialog={checkoutModal} bind:handleCheckoutModal />
<DailySalesModal
	dailySales={$dailySalesStore}
	on:dailySalesReset={getDailySales}
	bind:dialog={dailySalesModal}
/>
