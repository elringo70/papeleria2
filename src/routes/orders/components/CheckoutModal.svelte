<script>
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';

	/* STORES */
	import { checkoutModalStore } from '../stores/checkoutModalStore';
	import { paymentMethodsStore } from '../stores/paymentMethodsStore';
	import { modalStore } from '../stores/modalsStore';
	import { selectedTicket } from '../stores/store';

	/* COMPONENTS */
	import { CheckboxPressed } from '$lib/components';
	import Alert from '$lib/components/Alert.svelte';

	const focusInputElement = getContext('focusInputElement');

	export let Form;
	/** @type {HTMLDialogElement} dialog */
	export let dialog;
	/** @type {boolean} missingTotal */
	let missingTotal = false;
	/** @type {HTMLFormElement} checkoutModalForm */
	let checkoutModalForm;
	/** @type {HTMLInputElement} cashInput */
	let cashInput;

	let pendingBalance;

	export let handleCheckoutModal;

	const tickets = getContext('tickets');

	/* 	REACTIVITY VARIABLES */
	$: customerName = $selectedTicket.customer.name ?? '';
	$: phone = $selectedTicket.customer.phone ?? '';
	$: address = $selectedTicket.customer.address
		? $selectedTicket.customer.address.street + ' ' + $selectedTicket.customer.address.number
		: '';
	$: submitButtonAvailable =
		$paymentMethodsStore.cash || $paymentMethodsStore.creditDebit || $paymentMethodsStore.eTransfer;

	/** @type {boolean} paymentMethod */
	let paymentMethod;

	dialog = () => dialog.close();

	/** @param {KeyboardEvent} event */
	handleCheckoutModal = (event) => {
		switch (event.key) {
			case 'F2':
				event.preventDefault();
				checkoutModalForm.requestSubmit();
				break;
			case 'F8':
				event.preventDefault();
				resumeOrder();
				break;
			case 'Escape':
				cancelPurchase();
				break;
		}
	};

	const handleSubmit = ({ formData, cancel, action }) => {
		const namedAction = action.search.replace('?/', '');

		checkoutModalStore.calculateTotal();

		const { status, delivery } = Object.fromEntries(formData);

		const total =
			$checkoutModalStore.cash + $checkoutModalStore.creditDebit + $checkoutModalStore.eTransfer;

		switch (namedAction) {
			case 'submitOrder':
				if ($checkoutModalStore.customerPayment < $selectedTicket.total) {
					missingTotal = true;
					cancel();
				} else if (!(status && delivery)) {
					dialog.close();
					missingTotal = false;
					cancel();
				}

				if (
					$checkoutModalStore.creditDebit + $checkoutModalStore.eTransfer >=
					$checkoutModalStore.cash
				) {
					checkoutModalStore.setPendingBalanceText(true);
					cancel();
				}

				break;
			case 'outstanding':
				if (total >= $selectedTicket.total) {
					checkoutModalStore.setPendingBalanceText(true);
					cancel();
				}
				break;
		}

		return async ({ result }) => {
			switch (result.type) {
				case 'success':
					completeOrder();
					break;
				case 'failure':
					break;
			}
			missingTotal = false;
		};
	};

	const setPendingBalance = () => {
		checkoutModalStore.tooglePendingBalance();
	};

	/**
	 * @param {HTMLInputElement} event
	 * @param {('checkboxCash'|'checkboxETransfer'|'checkboxCreditDebit')} method
	 */
	const setPaymentMethod = (event, method) => {
		const value = event.target.checked;

		checkoutModalStore.setPaymentMethod(method, value);

		if (!value) {
			switch (method) {
				case 'checkboxCash':
					checkoutModalStore.setValue('cash', 0);
					break;
				case 'checkboxETransfer':
					checkoutModalStore.setValue('eTransfer', 0);
					break;
				case 'checkboxCreditDebit':
					checkoutModalStore.setValue('creditDebit', 0);
					break;
			}
		}

		paymentMethod = allPaymentMethodsValue(
			$checkoutModalStore.checkboxCash,
			$checkoutModalStore.checkboxETransfer,
			$checkoutModalStore.checkboxCreditDebit
		);
	};

	/**
	 * @param {boolean} a
	 * @param {boolean} b
	 * @param {boolean} c
	 */
	const allPaymentMethodsValue = (a, b, c) => {
		return !(a || b || c);
	};

	const completeOrder = () => {
		modalStore.resetModalStore();
		dialog.close();
		tickets.completeOrder();
		resetModal();
		focusInputElement();
	};

	const resumeOrder = () => {
		modalStore.resetModalStore();
		dialog.close();
		resetModal();
		focusInputElement();
	};

	const resetModal = () => {
		checkoutModalStore.reset();
		paymentMethodsStore.reset();
		checkoutModalStore.setPendingBalanceText(false);
	};

	const checkedStatus = () => {
		tickets.checkedStatus();
	};

	const checkedDelivery = () => {
		tickets.checkedDelivery();
	};

	/**
	 * @param {HTMLInputElement} event
	 * @param {string} attribute
	 * return {void}
	 */
	const onInput = (event, attribute) => {
		checkoutModalStore.setValue(attribute, event.target.value);
	};

	const cancelPurchase = () => {
		modalStore.resetModalStore();

		if ($checkoutModalStore.customerPayment < $selectedTicket.total) {
			missingTotal = false;
		}

		resetModal();

		tickets.setDeliveredStatus(false);
		tickets.setCheckedStatus(false);

		dialog.close();

		focusInputElement();
	};
</script>

<dialog class="modal" bind:this={dialog} data-modal="checkout-modal">
	<div class="modal-box w-4/6 max-w-none rounded bg-white">
		<form
			action="?/submitOrder"
			method="post"
			use:enhance={handleSubmit}
			autocomplete="off"
			bind:this={checkoutModalForm}
		>
			<div class="grid grid-cols-3 grid-rows-3 gap-5">
				<div class="col-span-2 row-span-3 border rounded border-gray-300 p-3">
					<div class="flex h-full flex-col justify-between gap-5">
						<h1 class="text-center font-bold text-7xl text-gray-700">
							$ {$selectedTicket.total}
						</h1>

						<div class="grid grid-cols-3 gap-2">
							<CheckboxPressed
								name="payment-cash"
								checkedText="Efectivo"
								unCheckedText="Efectivo"
								unCheckedIcon="mdi:cash"
								checkedIcon="mdi:cash"
								checked={$checkoutModalStore.checkboxCash}
								onChange={(e) => setPaymentMethod(e, 'checkboxCash')}
							/>
							<CheckboxPressed
								name="payment-credit-debit"
								checkedText="Crédito o Débito"
								unCheckedText="Crédito o Débito"
								unCheckedIcon="majesticons:creditcard"
								checkedIcon="majesticons:creditcard"
								checked={$checkoutModalStore.checkboxCreditDebit}
								onChange={(e) => setPaymentMethod(e, 'checkboxCreditDebit')}
							/>
							<CheckboxPressed
								name="payment-e-transfer"
								checkedText="Transferencia"
								unCheckedText="Transferencia"
								unCheckedIcon="solar:card-transfer-bold"
								checkedIcon="solar:card-transfer-bold"
								checked={$checkoutModalStore.checkboxETransfer}
								onChange={(e) => setPaymentMethod(e, 'checkboxETransfer')}
							/>
						</div>

						<div class="flex flex-col gap-3">
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Efectivo</p>
								</div>
								<div class="basis-2/3">
									<input
										class="input input-bordered w-full bg-transparent md:input-sm"
										type="number"
										placeholder="$ 0.00"
										name="input-cash"
										value={$checkoutModalStore.cash === 0 ? '' : $checkoutModalStore.cash}
										on:input={(e) => onInput(e, 'cash')}
										disabled={!$checkoutModalStore.checkboxCash}
										required={$checkoutModalStore.checkboxCash}
										bind:this={cashInput}
									/>
								</div>
							</div>
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Crédito o Débito</p>
								</div>
								<div class="basis-2/3">
									<input
										class="input input-bordered w-full bg-transparent md:input-sm"
										type="number"
										placeholder="$ 0.00"
										name="input-credit-debit"
										value={$checkoutModalStore.creditDebit === 0
											? ''
											: $checkoutModalStore.creditDebit}
										on:input={(e) => onInput(e, 'creditDebit')}
										disabled={!$checkoutModalStore.checkboxCreditDebit}
										required={$checkoutModalStore.checkboxCreditDebit}
									/>
								</div>
							</div>
							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Transferencia</p>
								</div>
								<div class="basis-2/3">
									<input
										class="input input-bordered w-full bg-transparent md:input-sm"
										type="number"
										placeholder="$ 0.00"
										name="input-e-transfer"
										value={$checkoutModalStore.eTransfer === 0 ? '' : $checkoutModalStore.eTransfer}
										on:input={(e) => onInput(e, 'eTransfer')}
										disabled={!$checkoutModalStore.checkboxETransfer}
										required={$checkoutModalStore.checkboxETransfer}
									/>
								</div>
							</div>

							<div class="flex gap-5">
								<div class="mb-3 flex basis-1/3 items-end justify-end">
									<p class="text-xl font-medium text-gray-700">Saldo pendiente</p>
								</div>
								<div class="basis-2/3 flex">
									<input
										name="pending-balance"
										type="checkbox"
										class="checkbox checkbox-primary border-gray-300"
										checked={$checkoutModalStore.pendingBalance}
										disabled={!($selectedTicket.status && $selectedTicket.delivered)}
										bind:this={pendingBalance}
										on:change={setPendingBalance}
									/>
									{#if $checkoutModalStore.pendingBalanceText}
										<span class="pl-3 items-center font-medium text-red-500"
											>Debe ser menor al pago</span
										>
									{/if}
								</div>
							</div>
						</div>

						<div>
							<div class="flex justify-end">
								<p
									class={`text-2xl font-medium ${missingTotal ? 'text-red-600' : 'text-gray-900'}`}
								>
									Paga con:
								</p>
								<p
									class={`text-3xl font-semibold ${
										missingTotal ? 'text-red-600' : 'text-gray-900'
									}`}
								>
									${$checkoutModalStore.customerPayment}
								</p>
							</div>
							<div class="flex justify-end gap-5">
								<p class="text-3xl font-medium text-gray-900">Su cambio:</p>
								<p class="text-3xl font-semibold text-gray-900">
									${$checkoutModalStore.customerPayment - $selectedTicket.total < 0
										? 0
										: $checkoutModalStore.customerPayment - $selectedTicket.total}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-2 border rounded border-gray-300 p-3">
					<div class="flex h-full flex-col justify-between">
						<div>
							<h4 class="text-md text-center font-bold text-gray-600">RESUMEN DE COMPRA</h4>
							<div class="pt-3 text-gray-600">
								<p>Cliente: {customerName}</p>
								<p>Numero: {phone}</p>
								<p>Dirección: {address}</p>
							</div>
						</div>
						<div class="grid-row-1 grid grid-cols-2 gap-2">
							<div class="col-span-1 row-span-1">
								<CheckboxPressed
									name="status"
									value={$selectedTicket.status}
									checked={$selectedTicket.status}
									checkedText="Entregado"
									unCheckedText="Sin entregar"
									unCheckedIcon="solar:delivery-bold"
									checkedIcon="solar:delivery-linear"
									onChange={checkedStatus}
								/>
							</div>
							<div class="col-span-1 row-span-1">
								<CheckboxPressed
									name="delivery"
									value={$selectedTicket.delivered}
									checked={$selectedTicket.delivered}
									checkedText="Pagado"
									unCheckedText="Pendiente"
									unCheckedIcon="streamline:payment-10-solid"
									checkedIcon="streamline:payment-10"
									onChange={checkedDelivery}
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="col-span-1 row-span-1">
					<div class="flex h-full flex-col justify-end gap-5">
						{#if $selectedTicket.status && $selectedTicket.delivered}
							<button
								type="submit"
								class="btn btn-block btn-sm"
								disabled={$checkoutModalStore.pendingBalance || paymentMethod}
								>TERMINAR COMPRA - F2</button
							>

							<button
								formaction="?/outstanding"
								class="btn btn-primary btn-sm"
								disabled={!$checkoutModalStore.pendingBalance || !submitButtonAvailable}
								>SALDO PENDIENTE - F12</button
							>
						{:else}
							<button
								type="button"
								class="btn-accent btn btn-sm"
								on:click={resumeOrder}
								disabled={!submitButtonAvailable}>RESUMIR COMPRA - F8</button
							>
						{/if}
						<button type="button" on:click={cancelPurchase} class="btn-error btn btn-block btn-sm"
							>CANCELAR - ESC</button
						>
					</div>
				</div>
			</div>

			<input
				type="hidden"
				name="change"
				value={$checkoutModalStore.customerPayment - $selectedTicket.total}
			/>
			<input type="hidden" name="customer" value={$selectedTicket.customer.phone} />
			<input type="hidden" name="total" value={$selectedTicket.total} />
			<input name="due-balance" type="hidden" value={$checkoutModalStore.dueBalance} />
			{#each $selectedTicket.products as product, i}
				<input
					type="hidden"
					name={`products[${i}][${product.quantity}]`}
					value={product.product._id}
				/>
			{/each}
		</form>
	</div>
</dialog>

<style>
	input:checked + label {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 0.1),
			0 2px 4px -2px rgb(0 0 0 / 0.1);
		background-color: rgb(14 165 233);
		border-color: rgb(14 165 233);
	}

	input:checked + label span {
		color: white;
	}

	.btn:hover {
		color: white;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
