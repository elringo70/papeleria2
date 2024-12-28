<script>
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';

	import Swal from 'sweetalert2/dist/sweetalert2.all';

	/** @type {HTMLDialogElement} dialog */
	export let dialog;
	const tickets = getContext('tickets');

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
</script>

<dialog class="modal" bind:this={dialog} data-modal="">
	<div class="modal-box rounded bg-white">
		<h3 class="text-lg font-bold mb-3">Buscar cliente</h3>
		<form action="?/findCustomer" use:enhance={setCustomerTicket} method="post" autocomplete="off">
			<input
				class="input input-bordered w-full"
				type="number"
				placeholder="Numero de cliente"
				name="phone"
				required
			/>
			<div class="modal-action">
				<button class="btn btn-error" type="button" on:click={dialog.close()}>Cancelar</button>
				<button class="btn btn-neutral" type="submit">Buscar</button>
			</div>
		</form>
	</div>
</dialog>

<style>
	.btn {
		color: white;
	}

	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
