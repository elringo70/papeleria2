<script>
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import Swal from 'sweetalert2';
	import Icon from '@iconify/svelte';

	import { searchProductStore, selectedProduct } from '../stores/searchProductStore';

	import { modalStore } from '../stores/modalsStore';

	const focusInputElement = getContext('focusInputElement');
	const tickets = getContext('tickets');

	/** @type {HTMLDialogElement} dialog */
	export let dialog;
	/** @type {HTMLElement} inputProduct */
	let inputProduct;
	/** @type {HTMLFormElement} form */
	let form;
	/** @type {HTMLElement} modalSize */
	let modalSize;
	let timer;

	const handleSubmit = ({ formData, cancel }) => {
		const { product } = Object.fromEntries(formData);

		if (!product) cancel();
		return async ({ result }) => {
			const { type, data } = result;
			switch (type) {
				case 'success':
					modalSize.classList.remove('h-36');
					modalSize.classList.add('h-[70vh]');
					fillTable(data.products);
					break;
			}
		};
	};

	/** @param {KeyboardEvent} event */
	const holdOnInput = (event) => {
		clearTimeout(timer);

		timer = setTimeout(async () => {
			if (event.target.value.length <= 3) {
				modalSize.classList.add('h-36');
				modalSize.classList.remove('h-[70vh]');
				searchProductStore.reset();
				return;
			}

			if (event.target.value.length > 3) form.requestSubmit();
		}, 500);
	};

	const handleOnClickProduct = (index) => {
		searchProductStore.selectProduct(index);
	};

	const fillTable = (products) => {
		searchProductStore.setProducts(products);
	};

	const resetTable = () => {
		inputProduct.value = '';
		searchProductStore.reset();
	};

	const selectProduct = (product) => {
		if (product.requiredStock && product.hasOwnProperty('stock')) {
			if (product.stock.stock === 0) {
				closeModal();

				setTimeout(() => {
					Swal.fire({
						title: 'Sin existencia',
						icon: 'warning'
					});
				}, 300);
			} else {
				tickets.addProductToTicket(product);
				resetTable();
				dialog.close();
			}
		} else {
			tickets.addProductToTicket(product);
			resetTable();
			dialog.close();
		}
	};

	const closeModal = () => {
		modalSize.classList.add('h-36');
		modalSize.classList.remove('h-[70vh]');
		modalStore.resetModalStore();
		dialog.close();
		resetTable();
		focusInputElement();
	};

	/** @param {KeyboardEvent} event */
	const selectOnEnter = (event) => {
		if (dialog.hasAttribute('open')) {
			switch (event.key) {
				case 'Enter':
					event.preventDefault();
					if ($selectedProduct !== null) {
						selectProduct($searchProductStore[$selectedProduct]);
						focusInputElement();
					}
					break;
				case 'Escape':
					closeModal();
					break;
			}
		}
	};

	beforeNavigate(() => {
		resetTable();
	});
</script>

<svelte:window on:keydown={selectOnEnter} />

<dialog class="modal" bind:this={dialog} data-modal="product-modal">
	<div
		class="modal-box w-[70vw] max-w-none rounded bg-white transition-all h-36"
		bind:this={modalSize}
	>
		<div class="h-full flex flex-col gap-y-5">
			<div class="">
				<h1 class="text-center text-3xl text-gray-700 mb-3">Buscar producto</h1>
				<form
					bind:this={form}
					action="?/searchProduct"
					method="post"
					use:enhance={handleSubmit}
					autocomplete="off"
				>
					<div class="flex h-full items-center gap-5">
						<input
							class="input input-bordered w-full"
							type="text"
							name="product"
							placeholder="Nombre del producto"
							bind:this={inputProduct}
							on:keyup={holdOnInput}
						/>

						<button type="submit" class="btn btn-accent hover:text-white">Buscar</button>
						<button type="button" class="btn btn-primary hover:text-white" on:click={resetTable}
							>Limpiar</button
						>
						<button type="button" class="btn btn-neutral hover:text-white" on:click={closeModal}
							>Cerrar</button
						>
					</div>
				</form>
			</div>

			{#if $searchProductStore.length > 0}
				<div class="overflow-auto h-full rounded">
					<table class="w-full text-left text-sm text-gray-500 table-xs">
						<thead class="bg-gray-200 uppercase text-gray-800 sticky top-0">
							<tr>
								<th class="p-3">Producto</th>
								<th class="p-3">Categoría</th>
								<th class="p-3">Precio</th>
								<th class="p-3">Stock</th>
								<th class="p-3">Mayoreo</th>
								<th class="p-3">Edición</th>
							</tr>
						</thead>
						<tbody class="text-xs text-gray-700">
							{#each $searchProductStore as product, index}
								{#if product?.stock?.stock > 0 || product?.requiredStock === false}
									<tr
										class={$selectedProduct === index
											? 'cursor-default select-none border-b bg-blue-500 text-white hover:bg-blue-600'
											: 'cursor-default select-none border-b bg-white py-1 hover:bg-gray-100'}
										on:click={() => handleOnClickProduct(index)}
										on:dblclick={() => selectProduct(product)}
									>
										<td class="px-3 py-2">{product.product}</td>
										<td class="px-3 py-2">{product.category}</td>
										<td class="px-3 py-2">$ {product.price}</td>
										<td class="px-3 py-2">{product.requiredStock ? product?.stock?.stock : ''}</td>
										<td class="px-3 py-2">$ {product.wholesale}</td>
										<td class="flex h-full w-full items-center justify-center px-3 py-2"
											><a href="/products/{product._id}"><Icon icon="tabler:edit" /></a></td
										>
									</tr>
								{:else}
									<tr class="cursor-default select-none border-b bg-gray-100 py-1 text-gray-400">
										<td class="px-3 py-2">{product.product}</td>
										<td class="px-3 py-2">{product.category}</td>
										<td class="px-3 py-2">$ {product.price}</td>
										<td class="px-3 py-2">{product?.stock?.stock}</td>
										<td class="px-3 py-2">$ {product.wholesale}</td>
										<td class="flex h-full w-full justify-center px-3 py-2 align-middle"
											><a href="/products/{product._id}"><Icon icon="tabler:edit" /></a></td
										>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</dialog>
