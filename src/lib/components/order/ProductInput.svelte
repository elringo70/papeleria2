<script>
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { selectedTicket } from '../../../routes/orders/stores/store';
	import Swal from 'sweetalert2';

	import { Input } from '$lib/components';

	const tickets = getContext('tickets');
	const focusInputElement = getContext('focusInputElement');

	export let showSearchProductModal;
	export let showDailySalesModal;
	/** @type {HTMLInputElement} bindInputElement */
	export let bindInputElement;

	const addProduct = (dataProduct) => {
		if (dataProduct.requiredStock) {
			if (dataProduct.stock.stock === 0)
				return Swal.fire({
					title: 'Sin existencia',
					icon: 'error'
				});

			const index = $selectedTicket.products.findIndex(
				(product) => product.product._id === dataProduct._id
			);

			if (index !== -1) {
				if ($selectedTicket.products[index].quantity >= dataProduct.stock.stock) {
					Swal.fire({
						title: 'Sin mas existencia',
						icon: 'error'
					});
				} else {
					tickets.addProductToTicket(dataProduct);
				}
			} else {
				tickets.addProductToTicket(dataProduct);
			}
		} else {
			tickets.addProductToTicket(dataProduct);
		}
	};

	async function addProductToTicket({ formElement, cancel }) {
		if (formElement.product.value === '') {
			cancel();
			focusInputElement();
		}

		return async ({ result }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					addProduct(data.product);
					formElement.product.value = '';
					focusInputElement();
					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: result.data.message,
						timer: 1250,
						timerProgressBar: true
					});
					break;
			}
		};
	}
</script>

<div class="flex flex-col h-full justify-around p-3">
	<form action="?/findProduct" method="post" use:enhance={addProductToTicket} autocomplete="off">
		<div class="flex flex-row items-end w-full gap-5">
			<div class="basis-9/12">
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text font-bold">Código</span>
					</div>
					<input
						type="text"
						class="input input-bordered w-full bg-transparent text-gray-500"
						name="product"
						id="product"
						value={''}
						bind:this={bindInputElement}
						tabindex="0"
					/>
				</label>
			</div>
			<div class="basis-3/12">
				<button type="submit" class="btn hover:text-white btn-block">Agregar</button>
			</div>
		</div>
	</form>

	<div class="grid w-full grid-cols-4 flex-row justify-center gap-5">
		<button
			type="button"
			class="btn btn-accent btn-sm hover:text-white text-xs shadow"
			on:click={showSearchProductModal}>Buscar Producto - F10</button
		>

		<button type="button" class="btn btn-accent btn-sm hover:text-white text-xs shadow"
			>Detalle de Ticket</button
		>

		<button
			type="button"
			class="btn btn-accent btn-sm hover:text-white text-xs shadow"
			on:click={showDailySalesModal}>Ventas del día - F8</button
		>

		<button type="submit" class="btn btn-accent btn-sm hover:text-white text-xs shadow">...</button>
	</div>
</div>
