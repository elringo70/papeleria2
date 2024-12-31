<script>
	import { enhance } from '$app/forms';

	import Swal from 'sweetalert2/dist/sweetalert2.all.js';

	import { Input, Combobox, Checkbox } from '$lib/components';

	import { address, selectedAddress } from './addressStore';
	import { beforeNavigate } from '$app/navigation';

	export let form;

	let isChecked = false;
	let comboValue = '';

	/** @type {any} */
	let errors;
	$: errors;

	let loading = false;

	const submitCustomer = () => {
		return async ({ result, update }) => {
			errors = result?.data?.errors;

			switch (result.type) {
				case 'success':
					street = '';
					number = '';
					municipality = '';
					city = '';
					state = '';
					place_id = '';

					isChecked = false;

					selectedAddress.set({});

					Swal.fire({
						icon: 'success',
						title: 'Guardado',
						text: 'Cliente guardado con éxito'
					});

					await update();
					break;
				case 'failure':
					if (result.status === 400) {
						Swal.fire({
							icon: 'warning',
							title: 'Error',
							text: result.data.message
						});
					}
					break;
			}
		};
	};

	/** @type {any} */
	let timer;
	let comboLoading = false;
	$: comboLoading;

	/** @type {string} */
	let street,
		/** @type {string} */ number,
		/** @type {string} */ municipality,
		/** @type {string} */ city,
		/** @type {string} */ state,
		/** @type {string} */ place_id;
	$: street = $selectedAddress.street ? $selectedAddress.street : form?.data?.street ?? '';
	$: number = $selectedAddress.number ? $selectedAddress.number : form?.data?.number ?? '';
	$: municipality = $selectedAddress.municipality
		? $selectedAddress.municipality
		: form?.data?.municipality ?? '';
	$: city = $selectedAddress.city ? $selectedAddress.city : form?.data?.city ?? '';
	$: state = $selectedAddress.state ? $selectedAddress.state : form?.data?.state ?? '';
	$: place_id = $selectedAddress.place_id ? $selectedAddress.place_id : form?.data?.place_id ?? '';

	/** @param {{ currentTarget: EventTarget}} event */
	const holdOnInput = (event) => {
		comboLoading = true;

		clearTimeout(timer);

		const stringInput = event.currentTarget.value;

		if (stringInput.length > 3) {
			timer = setTimeout(async () => {
				await address.fetchAddress(stringInput.trim());
				comboLoading = false;
			}, 1000);
		} else if (stringInput.length === 0) {
			comboLoading = false;
			address.resetAddress();
		}
	};

	const resetAddress = () => {
		isChecked = !isChecked;
		comboValue = '';
		number = '';
		address.resetAddress();
	};

	/** @param {KeyboardEvent} e */
	const blockInvalidChar = (e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

	beforeNavigate(() => {
		resetAddress();
	});
</script>

<svelte:head>
	<title>Cliente nuevo</title>
</svelte:head>

<section class="flex h-[calc(100vh-66px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-9/12 rounded bg-white p-5 shadow-lg">
		<div class="mb-7">
			<h3 class="text-2xl font-semibold text-gray-800">Cliente nuevo</h3>
			<p class="text-gray-400">Ingresar la información del cliente</p>
		</div>
		<form action="?/post" method="post" use:enhance={submitCustomer} autocomplete="off">
			<div class="flex flex-row space-x-4">
				<div class="basis-3/12">
					<Input
						label="* Teléfono"
						name="phone"
						type="number"
						required={true}
						maxlength={10}
						pattern={'[0-9]{10}'}
						value={form?.data?.phone ?? ''}
						errors={errors?.phone}
						on:keypress={blockInvalidChar}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="* Nombre"
						name="name"
						required={true}
						value={form?.data?.name ?? ''}
						errors={errors?.name}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Apellido"
						name="lastName"
						value={form?.data?.lastName ?? ''}
						errors={errors?.lastName}
					/>
				</div>
				<div class="basis-3/12">
					<Input
						label="Segundo apellido"
						name="maternalSurname"
						value={form?.data?.maternalSurname ?? ''}
						errors={errors?.maternalSurname}
					/>
				</div>
			</div>

			<div class="mb-3 flex flex-row">
				<div class="basis-4/12">
					<!-- <Checkbox
						label="¿Dirección?"
						name="requiredAddress"
						bind:checked={isChecked}
						onChange={resetAddress}
					/> -->
					<div class="form-control">
						<label class="label cursor-pointer">
							<span class="label-text">¿Dirección?</span>
							<input
								type="checkbox"
								name="requiredAddress"
								class="checkbox"
								checked={isChecked}
								on:change={resetAddress}
							/>
						</label>
					</div>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-full">
					<Combobox
						name="inputSearch"
						placeholder={!isChecked ? '' : 'Buscar dirección'}
						list={$address}
						disabled={!isChecked}
						bind:value={comboValue}
						loading={comboLoading}
						onClick={address.selectAddress}
						onKeyup={holdOnInput}
					/>
				</div>
			</div>

			<div class="flex flex-row space-x-4">
				<div class="basis-3/12">
					<Input
						label="Número"
						name="number"
						type="number"
						required={true}
						disabled={!isChecked}
						errors={errors?.number}
						value={number}
						onChange={(e) => (number = e.target.value)}
					/>
				</div>
				<div class="basis-4/12">
					<Input
						label="Calle"
						name="street"
						disabled={true}
						errors={errors?.street}
						value={street}
					/>
				</div>
				<div class="basis-5/12">
					<Input
						label="Colonia"
						name="municipality"
						disabled={true}
						errors={errors?.municipality}
						value={municipality}
					/>
				</div>
			</div>

			<div class="flex flex-row items-end space-x-4">
				<div class="basis-4/12">
					<Input label="Ciudad" name="city" disabled={true} errors={errors?.city} value={city} />
				</div>
				<div class="basis-4/12">
					<Input label="Estado" name="state" disabled={true} errors={errors?.state} value={state} />
				</div>
				<div class="basis-4/12 flex items-end">
					<button type="submit" class="btn btn-neutral w-full" disabled={loading}>Guardar</button>
				</div>
			</div>

			<input type="hidden" name="place_id" value={place_id} />
			<input type="hidden" name="street" value={street} />
			<input type="hidden" name="municipality" value={municipality} />
			<input type="hidden" name="city" value={city} />
			<input type="hidden" name="state" value={state} />
		</form>
	</div>
</section>
