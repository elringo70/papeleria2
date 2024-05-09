<script>
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import { Input } from '$lib/components';
	import { searchProductStore } from './store';
	import Icon from '@iconify/svelte';

	/** @type {HTMLInputElement} inputProduct */
	let inputProduct;

	/** @type {HTMLFormElement} form */
	let form;
	let timer;

	const handleSubmit = ({ formData, cancel }) => {
		const { product } = Object.fromEntries(formData);

		if (!product) cancel();
		return async ({ result }) => {
			const { type, data } = result;
			switch (type) {
				case 'success':
					fillTable(data.products);
					break;
			}
		};
	};

	/** @param {{ currentTarget: EventTarget }} event */
	const holdOnInput = (event) => {
		clearTimeout(timer);

		timer = setTimeout(async () => {
			if (event.target.value !== '' && event.target.value.length > 2) return form.requestSubmit();

			resetTable();
		}, 500);
	};

	const resetTable = () => {
		searchProductStore.reset();
	};

	const fillTable = (data) => {
		searchProductStore.setProducts(data);
	};

	beforeNavigate(() => {
		resetTable();
	});
</script>

<svelte:head>
	<title>Buscar producto</title>
</svelte:head>

<section class="flex h-[calc(100vh-56px)] justify-center bg-gray-100 p-10">
	<div class="flex flex-col w-full gap-y-6">
		<div class="p-5 bg-white shadow-md rounded">
			<form
				bind:this={form}
				action="?/searchProduct"
				method="post"
				use:enhance={handleSubmit}
				autocomplete="off"
			>
				<div class="flex">
					<Input
						name="product"
						placeholder="Producto"
						bind:bindElement={inputProduct}
						onKeyup={holdOnInput}
					/>
					<button
						type="submit"
						class="w-full rounded bg-indigo-500 py-2 text-white shadow shadow-indigo-500 hover:bg-indigo-600"
						>Buscar</button
					>
				</div>
			</form>
		</div>

		<div class="p-5 bg-white shadow-md rounded overflow-y-auto">
			<table class="w-full text-left text-sm text-gray-500">
				<thead class="bg-gray-50 text-xs uppercase text-gray-800">
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
					{#each $searchProductStore as product}
						{#if product?.stock?.stock > 0 || product?.requiredStock === false}
							<tr class={'cursor-default select-none border-b bg-white py-1 hover:bg-gray-100'}>
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
					{:else}
						<tr class="cursor-default select-none border-b bg-gray-100 py-1 text-gray-400">
							Productos
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
