<script>
	import { afterUpdate, getContext } from 'svelte';
	import { enhance } from '$app/forms';

	import { NumberField } from '$lib/components';
	import Swal from 'sweetalert2/dist/sweetalert2.all';

	/** @type {HTMLDialogElement} dialog */
	export let dialog;
	const tickets = getContext('tickets');
	/** @type {HTMLInputElement} inputElement */
	let inputElement;

	const setCustomerTicket = () => {
		return async ({ result, update }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					if (data.customer) {
						tickets.setCustomerTicket(data.customer);
					} else {
						tickets.setCustomerTicket(data.phone);
					}

					dialog.close();
					break;
				case 'failure':
					Swal.fire({
						icon: 'error',
						title: data.message,
						timer: 1250,
						timerProgressBar: true
					});
					break;
			}
			await update();
		};
	};

	afterUpdate(async () => {
		if (inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 100);
		}
	});
</script>

<dialog class="modal" bind:this={dialog}>
	<div class="modal-box w-1/3 max-w-none rounded-none bg-white text-gray-700">
		<h3 class="text-lg font-bold">Buscar cliente</h3>
		<form action="?/findCustomer" use:enhance={setCustomerTicket} method="post" autocomplete="off">
			<NumberField
				placeholder="Numero del cliente"
				name="phone"
				minlength="10"
				maxlength="10"
				required
			/>
			<div class="modal-action">
				<button class="btn btn-error hover:text-white" type="button" on:click={dialog.close()}
					>Cancelar</button
				>
				<button class="btn hover:text-white" type="submit">Buscar</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	.btn {
		color: white;
	}
</style>
