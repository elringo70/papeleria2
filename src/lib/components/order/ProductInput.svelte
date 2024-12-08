<script>
	import { enhance } from '$app/forms';
	import { getContext } from 'svelte';
	import { selectedTicket } from '../../../routes/orders/stores/store';
	import Swal from 'sweetalert2';

	import { Input } from '$lib/components';

	const tickets = getContext('tickets');
	const focusInputElement = getContext('focusInputElement');

	export let showSearchModal;
	export let showDailySalesModal;
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

<div class="flex flex-col justify-around h-full p-5">
	<form action="?/findProduct" method="post" use:enhance={addProductToTicket} autocomplete="off">
		<div class="flex flex-row items-end w-full gap-5">
			<div class="basis-9/12">
				<Input
					label="Código"
					name="product"
					value={''}
					bind:bindElement={bindInputElement}
					tabindex="0"
				/>
			</div>
			<div class="basis-3/12">
				<button type="submit" class="btn hover:text-white btn-block">Agregar</button>
			</div>
		</div>
	</form>

	<div class="grid w-full grid-cols-4 flex-row justify-center gap-5 py-12">
		<button type="button" class="btn btn-accent hover:text-white" on:click={showSearchModal}
			>Buscar Producto</button
		>

		<button type="button" class="btn btn-accent hover:text-white">Detalle de Ticket</button>

		<button type="button" class="btn btn-accent hover:text-white" on:click={showDailySalesModal}
			>Ventas del día</button
		>

		<button type="submit" class="btn btn-accent hover:text-white">...</button>
	</div>
</div>
