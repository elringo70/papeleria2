<script>
	import { enhance } from '$app/forms';

	import { Select, Date } from '$lib/components';

	const options = [{ name: 'Luis Alvarez' }, { name: 'Jessica Toscano' }];

	const salesDetails = [
		{ name: 'En Efectivo', value: 1161.58 },
		{ name: 'Tarjeta de Crédito', value: 514.72 },
		{ name: 'Crédito', value: 990.52 },
		{ name: 'Transferencia', value: 1196.11 },
		{ name: 'Devoluciones', value: 0 }
	];

	const cashSalesDetails = [
		{ name: 'Ventas en Efectivo', value: 1161.58 },
		{ name: 'Ventas con Vales', value: 293.95 },
		{ name: 'Pagos de clientes', value: 300 },
		{ name: 'Ventas con Transferencia', value: 1196.11 }
	];

	const salesByDepartment = [
		{ name: 'Papelería', value: 543 },
		{ name: 'Impresiones', value: 150 },
		{ name: 'Merceria', value: 542 }
	];

	const getCashProof = () => {
		return async ({ result }) => {
			const { type, data } = result;

			switch (type) {
				case 'success':
					console.log(data);
					break;
			}
		};
	};
</script>

<svelte:head>
	<title>Corte de Caja</title>
</svelte:head>

<section class="flex h-[calc(100vh-56px)] items-center justify-center bg-gray-100">
	<div class="container mx-auto w-8/12 rounded bg-white p-5 shadow-lg">
		<form action="?/cashProof" method="post" use:enhance={getCashProof}>
			<div class="flex space-x-4">
				<div class="basis-4/12">
					<Date label="Fecha" name="date" />
				</div>
				<div class="basis-4/12">
					<div class="form-control mb-3 w-full">
						<Select label="CAJERO" name="cashier" {options} required={true} valueOption="name" />
					</div>
				</div>
				<div class="basis-4/12 flex items-end">
					<button
						type="submit"
						class="w-full rounded bg-indigo-700 px-4 py-2 text-white shadow shadow-indigo-700 hover:bg-indigo-600 mb-6"
						>Hacer corte</button
					>
				</div>
			</div>
		</form>

		<div class="flex space-x-5 text-gray-700">
			<div class="flex flex-col basis-1/2">
				<div class="flex justify-between text-xl font-medium text-teal-500 mb-3">
					<div>Ventas totales</div>
					<div>$ 4,996.84</div>
				</div>

				<div class="text-lg font-medium text-teal-500">Ventas</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						{#each salesDetails as item}
							<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
								<td>{item.name}</td>
								<td class="text-end">$ {item.value}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="text-lg font-medium text-teal-500">Entradas de Efectivo</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
							<td>Entradas</td>
							<td class="text-end">$ 0.00</td>
						</tr>
					</tbody>
				</table>

				<div class="text-lg font-medium text-teal-500">Ingresos de Contado</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						{#each cashSalesDetails as item}
							<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
								<td>{item.name}</td>
								<td class="text-end">$ {item.value}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<div class="flex flex-col basis-1/2">
				<div class="flex justify-between text-xl font-medium text-teal-500 mb-3">
					<div>Ganancia</div>
					<div>$ 414.83</div>
				</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						{#each salesByDepartment as item}
							<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
								<td>{item.name}</td>
								<td class="text-end">$ {item.value}</td>
							</tr>
						{/each}
					</tbody>
				</table>

				<div class="text-lg font-medium text-teal-500">Salidas de Efectivo</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
							<td>Salidas</td>
							<td class="text-end">$ 0.00</td>
						</tr>
					</tbody>
				</table>

				<div class="text-lg font-medium text-teal-500">Pagos a Créditos</div>

				<table class="w-full text-left text-sm text-gray-500 mb-3">
					<tbody class="text-xs text-gray-700">
						<tr class="py-1 odd:bg-gray-100 hover:bg-gray-200">
							<td>Pagos</td>
							<td class="text-end">$ 0.00</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>
