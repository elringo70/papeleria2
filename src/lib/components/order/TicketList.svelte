<script>
	import { getContext } from 'svelte';
	import Swal from 'sweetalert2';
	import Ticket from '$lib/components/order/Ticket.svelte';

	const tickets = getContext('tickets');
	const focusInputElement = getContext('focusInputElement');

	export let showCustomerSearchModal;

	function selectTicket(index) {
		tickets.selectTicket(index);
		focusInputElement();
	}

	async function removeTicket() {
		const index = this.value;

		if ($tickets[index].products.length > 0 || $tickets[index].customer.phone) {
			const modalConfirmation = await Swal.fire({
				icon: 'warning',
				title: '¿Desea eliminar el ticket?',
				showCancelButton: true,
				cancelButtonText: 'Cancelar',
				confirmButtonText: 'Eliminar'
			});

			if (modalConfirmation.isConfirmed) {
				tickets.removeTicket(index);
			}
		} else {
			tickets.removeTicket(index);
		}
		focusInputElement();
	}

	function addTicket() {
		tickets.addTicket();
		focusInputElement();
	}
</script>

<div class="overflow-auto">
	{#each $tickets as ticket, index}
		<Ticket
			{ticket}
			{index}
			onClick={() => selectTicket(index)}
			onDblClick={showCustomerSearchModal}
			{removeTicket}
		/>
	{/each}
</div>
<div class="mt-auto p-2">
	<button
		type="button"
		class="btn btn-primary hover:text-white btn-block btn-sm"
		on:click={addTicket}>Agregar ticket</button
	>
</div>
