<script>
	import { onMount } from 'svelte';
	import { setRawData, dataStore, todaySales } from '$lib/stores/statisticsStores';
	import Chart from 'chart.js/auto';
	import Icon from '@iconify/svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	// Hidrato el store con los datos de la página
	// chequeo que aun no este cargado y que haya datos
	$: if(!$dataStore.loaded && !!data) setRawData(data);

	/** @type {string} */
	// $: todaySales = ''; // esta variable ya no es necesaria. Podemos usar los datos del derived store con $todaySales (linea 63)
	/** @type {number} */
	$: yesterdayPercentage = 0;
	/** @type {{ product: Object; quantity: number }} */
	let chart;

	const charData = {
		labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'],
		datasets: [
			{
				label: 'My First Dataset',
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: false,
				borderColor: 'rgb(75, 192, 192)',
				tension: 0.1
			}
		]
	};

	const config = {
		type: 'line',
		data: charData
	};

	onMount(() => {
		// store.onLoad();
		// const ctx = chart.getContext('2d');
		// new Chart(ctx, config);
	});
</script>

<svelte:head>
	<title>Estadísticas</title>
</svelte:head>

<div class="flex">
	<div class="p-5 bg-gray-800 basis-2/12">Drawer</div>
	<section class="flex flex-col gap-5 p-6 bg-gray-100 basis-10/12">
		<div class="flex w-full gap-5">
			<div class="flex flex-col p-4 break-words bg-white rounded-lg shadow-xl basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal text-gray-400 uppercase text-md"
							>
								Ventas de hoy
							</p>
							<!-- Aca usamos los datos del derived store directo en el HTML -->
							<h5 class="mb-2 text-2xl font-bold text-gray-600">$ {$todaySales}</h5>
							<p class="mb-0">
								{#if yesterdayPercentage === -100}
									<span class="font-bold leading-normal text-gray-500">0%</span>
									desde ayer
								{:else}
									<span
										class="font-bold leading-normal {yesterdayPercentage < 0
											? 'text-red-400'
											: 'text-indigo-500'}"
										>{yesterdayPercentage > 0 ? '+' : ''}{yesterdayPercentage}%</span
									>
									desde ayer
								{/if}
							</p>
						</div>
					</div>
					<div class="text-right basis-1/3">
						<div
							class="inline-block p-4 text-white rounded-full shadow bg-emerald-600 shadow-emerald-600"
						>
							<Icon class="text-lg" icon="carbon:sales-ops" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col p-4 break-words bg-white rounded-lg shadow-xl basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal text-gray-400 uppercase text-md"
							>
								Ventas del mes
							</p>
							<!-- <h5 class="mb-2 text-2xl font-bold text-gray-600">$ {$dashboard.monthSales}</h5> -->
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="text-right basis-1/3">
						<div
							class="inline-block p-4 text-white bg-blue-600 rounded-full shadow shadow-blue-600"
						>
							<Icon class="text-lg" icon="grommet-icons:money" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col p-4 break-words bg-white rounded-lg shadow-xl basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal text-gray-400 uppercase text-md"
							>
								Producto del mes
							</p>
							<h5 class="mb-2 text-2xl font-bold text-gray-600">$53,000</h5>
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="text-right basis-1/3">
						<div
							class="inline-block p-4 text-white bg-blue-600 rounded-full shadow shadow-blue-600"
						>
							<Icon class="text-lg" icon="grommet-icons:money" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col p-4 break-words bg-white rounded-lg shadow-xl basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal text-gray-400 uppercase text-md"
							>
								Producto del mes
							</p>
							<!-- <h5 class="mb-2 text-xl font-bold text-gray-600"></h5> -->
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500"></span> ventas
							</p>
						</div>
					</div>
					<div class="text-right basis-1/3">
						<div
							class="inline-block p-4 text-white bg-indigo-600 rounded-full shadow shadow-indigo-600"
						>
							<Icon class="text-lg" icon="fluent-mdl2:product" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex h-[400px] gap-5">
			<div class="p-3 bg-white rounded-lg shadow-lg basis-8/12">
				<!-- <canvas bind:this={chart}></canvas> -->
			</div>
			<div class="bg-white rounded-lg shadow-lg basis-4/12">1</div>
		</div>
	</section>
</div>
