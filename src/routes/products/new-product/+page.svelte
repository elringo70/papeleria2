<script>
	import { enhance } from '$app/forms';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { confirmModal } from '$utils/modalButton';

	import { firstUppercase } from '$utils/stringUtils.js';
	import CropImageModal from './components/CropImageModal.svelte';

	export let form;
	export let data;
	let errors;
	$: errors;

	let loading = false;

	let isChecked = true;

	let stock = form?.data?.stock ?? '';
	let stockMinimum = form?.data?.stockMinimum ?? '';
	$: stock;
	$: stockMinimum;
	/** @type {HTMLDialogElement} dialog */
	let dialog;
	/** @type {HTMLInputElement|undefined} inputFileInput */
	let inputFileInput;
	/** @type {HTMLImageElement} imageElement */
	let imageElement;

	const handleSubmit = ({ formElement, formData, cancel }) => {
		loading = true;

		const { cost, price, wholesale, requiredStock } = Object.fromEntries(formData);

		if (wholesale <= cost || price <= cost || wholesale >= price) {
			Swal.fire({
				icon: 'warning',
				text: 'Precio o mayoreo debe ser menor a costo',
				confirmButtonColor: '#3085d6'
			});

			cancel();
			loading = false;
		}

		return async ({ result }) => {
			errors = result?.data?.errors;

			switch (result.type) {
				case 'success':
					formElement.reset();

					if (requiredStock !== 'on') {
						isChecked = true;

						stock = '';
						stockMinimum = '';
					}

					confirmModal.fire({
						icon: 'success',
						title: 'Guardado',
						text: 'Producto guardado con éxito'
					});

					break;
				case 'failure':
					confirmModal.fire({
						icon: 'error',
						title: 'Error',
						text: result.data.message
					});
					break;
				case 'error':
					Swal.fire({
						icon: 'error',
						title: result.error.message
					});
					break;
			}
			loading = false;
		};
	};

	const resetStockInputs = () => {
		isChecked = !isChecked;

		stock = '';
		stockMinimum = '';
	};

	const readImageURL = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target?.result);
			reader.onerror = (e) => reject(e);
			reader.readAsDataURL(file);
		});
	};

	const onInputFileChange = () => {
		if (!dialog.hasAttribute('open') && inputFileInput?.files && inputFileInput.files?.length > 0) {
			setTimeout(async () => {
				const file = inputFileInput?.files[0];
				const url = await readImageURL(file);
				imageElement.src = url;
				dialog.showModal();
			}, 500);
		}
	};
</script>

<svelte:head>
	<title>Nuevo producto</title>

	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css"
		integrity="sha512-hvNR0F/e2J7zPPfLC9auFe3/SE0yG4aJCOd/qxew74NN7eyiSKjr7xJJMu1Jy2wf7FXITpWS1E/RY8yzuXN7VA=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	/>
	<script
		src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js"
		integrity="sha512-9KkIqdfN7ipEW6B6k+Aq20PV31bjODg4AA52W+tYtAE0jE0kMx49bjJ3FgvS56wzmyfMUHbQ4Km2b7l9+Y/+Eg=="
		crossorigin="anonymous"
		referrerpolicy="no-referrer"
	></script>
</svelte:head>

<section class="flex h-[calc(100vh-56px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-8/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-3">
			<h3 class="text-2xl font-semibold text-gray-800">Producto nuevo</h3>
			<p class="text-gray-400">Crear un nuevo producto</p>
		</div>

		<form
			action="?/submit"
			method="post"
			use:enhance={handleSubmit}
			autocomplete="off"
			enctype="multipart/form-data"
		>
			<div class="flex flex-col">
				<div class="flex flex-row space-x-6">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text font-semibold">* Código</span>
							{#if errors?._id}
								<span class="label-text-alt">{errors?._id[0]}</span>
							{/if}
						</div>
						<input
							type="text"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?._id
								? 'input-error'
								: ''}"
							placeholder="5901234123457"
							name="_id"
							required
							value={form?.data?._id ?? ''}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text font-semibold">* Producto</span>
							{#if errors?.product}
								<span class="label-text-alt">{errors?.product[0]}</span>
							{/if}
						</div>
						<input
							type="text"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.product
								? 'input-error'
								: ''}"
							placeholder="Lapiz"
							name="product"
							required
							value={form?.data?.product ?? ''}
						/>
					</label>

					<label class="form-control w-full">
						<div class="label">
							<span class="label-text">Marca</span>
							{#if errors?.brand}
								<span class="label-text-alt">{errors?.brand[0]}</span>
							{/if}
						</div>
						<input
							type="text"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.brand
								? 'input-bordered sm:input-sm'
								: ''}"
							placeholder="Berol"
							name="brand"
							value={form?.data?.brand ?? ''}
						/>
					</label>
				</div>

				<div class="flex flex-row space-x-6">
					<div class="basis-2/3">
						<label class="form-control w-full">
							<div class="label">
								<span class="label-text">Modelo</span>
								{#if errors?.model}
									<span class="label-text-alt">{errors?.model[0]}</span>
								{/if}
							</div>
							<input
								type="text"
								class="input input-bordered sm:input-sm lg:input-md w-full {errors?.model
									? 'input-error'
									: ''}"
								placeholder="Berol"
								name="model"
								value={form?.data?.model ?? ''}
							/>
						</label>
					</div>

					<div class="basis-1/3">
						<label class="form-control w-full max-w-xs">
							<div class="label">
								<span class="label-text font-semibold">* Categoría</span>
								{#if errors?.category}
									<span class="label-text-alt">{errors?.category[0]}</span>
								{/if}
							</div>
							<select
								class="select select-bordered sm:select-sm lg:select-md w-full {errors?.category
									? 'select-error'
									: ''}"
								name="category"
								required
								value={form?.data?.category ?? 'Categoría'}
								errors={errors?.category}
							>
								<option disabled selected>Elegir categoria</option>
								{#each data?.categories as category}
									<option value={category._id}>{firstUppercase(category.name)}</option>
								{/each}
							</select>
						</label>
					</div>
				</div>

				<div class="flow-row flex space-x-6">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text font-semibold">* Costo</span>
							{#if errors?.cost}
								<span class="label-text-alt">{errors?.cost[0]}</span>
							{/if}
						</div>
						<input
							type="number"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.cost
								? 'input-error'
								: ''}"
							placeholder="$ 3.5"
							name="cost"
							required
							value={form?.data?.cost ?? ''}
							min="0"
							step="0.1"
						/>
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text font-semibold">* Precio</span>
							{#if errors?.price}
								<span class="label-text-alt">{errors?.price[0]}</span>
							{/if}
						</div>
						<input
							type="number"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.price
								? 'input-error'
								: ''}"
							placeholder="$ 7"
							name="price"
							required
							value={form?.data?.price ?? ''}
							min="0"
							step="0.1"
						/>
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text font-semibold">Precio de mayoreo</span>
							{#if errors?.wholesale}
								<span class="label-text-alt">{errors?.wholesale[0]}</span>
							{/if}
						</div>
						<input
							type="number"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.wholesale
								? 'input-error'
								: ''}"
							placeholder="$ 7"
							name="wholesale"
							value={form?.data?.wholesale ?? ''}
							min="0"
							step="0.1"
						/>
					</label>
				</div>

				<div class="flex flex-row space-x-4 mb-5 items-end">
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text {isChecked ? 'font-semibold' : 'font-normal text-gray-400'}"
								>{isChecked ? '* ' : ''}Inventario</span
							>
							{#if errors?.stock}
								<span class="label-text-alt">{errors?.stock[0]}</span>
							{/if}
						</div>
						<input
							type="number"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.stock
								? 'input-error'
								: ''} {isChecked ? '' : 'cursor-not-allowed'}"
							name="stock"
							bind:value={stock}
							disabled={!isChecked}
							required
						/>
					</label>
					<label class="form-control w-full">
						<div class="label">
							<span class="label-text {isChecked ? 'font-semibold' : 'font-normal text-gray-400'}"
								>{isChecked ? '* ' : ''}Inventario mínimo</span
							>
							{#if errors?.stockMinimum}
								<span class="label-text-alt">{errors?.stockMinimum[0]}</span>
							{/if}
						</div>
						<input
							type="number"
							class="input input-bordered sm:input-sm lg:input-md w-full {errors?.stockMinimum
								? 'input-error'
								: ''} {isChecked ? '' : 'cursor-not-allowed'}"
							name="stockMinimum"
							bind:value={stockMinimum}
							disabled={!isChecked}
							required
						/>
					</label>
					<div class="basis-4/12">
						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text">¿Requiere inventario?</span>
								<input
									type="checkbox"
									class="checkbox"
									name="requiredStock"
									checked={isChecked}
									on:change={resetStockInputs}
								/>
							</label>
						</div>
					</div>
				</div>

				<div class="flex flex-row space-x-4">
					<div class="basis-4/6">
						<input
							type="file"
							class="file-input file-input-bordered w-full"
							name="image"
							accept="image/jpg, image/jpeg, image/png, image/webp"
							on:change={onInputFileChange}
							bind:this={inputFileInput}
						/>
					</div>

					<div class="basis-1/6">
						<button type="button" class="btn btn-neutral w-full">Recortar</button>
					</div>

					<div class="flex basis-1/6">
						<button class="btn btn-neutral w-full" type="submit" disabled={loading}>
							{#if loading}
								<span class="loading loading-dots loading-md"></span>
							{:else}
								Guardar
							{/if}
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</section>

<!--<CropImageModal bind:dialog bind:imageElement />-->

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
