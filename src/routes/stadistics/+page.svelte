<script>
	import { onMount } from 'svelte';
	import { store } from './store';
	import Chart from 'chart.js/auto';
	import Icon from '@iconify/svelte';

	/** @type {import('./$types').PageData} */
	export let data;

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
		store.setStadistics(data.orders);
		store.todaySales();

		const ctx = chart.getContext('2d');
		new Chart(ctx, config);
	});
</script>

<svelte:head>
	<title>Estadísticas</title>
</svelte:head>

<div class="flex">
	<div class="basis-2/12 bg-gray-800 p-5">Drawer</div>
	<section class="bg-gray-100 flex flex-col basis-10/12 p-6 gap-5">
		<div class="flex w-full gap-5">
			<div class="flex flex-col break-words bg-white shadow-xl rounded-lg p-4 basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal uppercase text-md text-gray-400"
							>
								Ventas de hoy
							</p>
							<h5 class="mb-2 font-bold text-gray-600 text-2xl">$53,000</h5>
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="basis-1/3 text-right">
						<div
							class="bg-emerald-600 rounded-full text-white shadow shadow-emerald-600 inline-block p-4"
						>
							<Icon class="text-lg" icon="carbon:sales-ops" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col break-words bg-white shadow-xl rounded-lg p-4 basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal uppercase text-md text-gray-400"
							>
								Ventas del mes
							</p>
							<h5 class="mb-2 font-bold text-gray-600 text-2xl">$53,000</h5>
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="basis-1/3 text-right">
						<div
							class="bg-blue-600 rounded-full text-white shadow shadow-blue-600 inline-block p-4"
						>
							<Icon class="text-lg" icon="grommet-icons:money" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col break-words bg-white shadow-xl rounded-lg p-4 basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal uppercase text-md text-gray-400"
							>
								Producto del mes
							</p>
							<h5 class="mb-2 font-bold text-gray-600 text-2xl">$53,000</h5>
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="basis-1/3 text-right">
						<div
							class="bg-blue-600 rounded-full text-white shadow shadow-blue-600 inline-block p-4"
						>
							<Icon class="text-lg" icon="grommet-icons:money" />
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col break-words bg-white shadow-xl rounded-lg p-4 basis-3/12">
				<div class="flex gap-5">
					<div class="flex basis-2/3">
						<div>
							<p
								class="mb-0 font-sans font-semibold leading-normal uppercase text-md text-gray-400"
							>
								Producto del mes
							</p>
							<h5 class="mb-2 font-bold text-gray-600 text-2xl">$53,000</h5>
							<p class="mb-0">
								<span class="font-bold leading-normal text-indigo-500">+55%</span> desde ayer
							</p>
						</div>
					</div>
					<div class="basis-1/3 text-right">
						<div
							class="bg-indigo-600 rounded-full text-white shadow shadow-indigo-600 inline-block p-4"
						>
							<Icon class="text-lg" icon="fluent-mdl2:product" />
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex h-[400px] gap-5">
			<div class="basis-8/12 bg-white rounded-lg p-3 shadow-lg">
				<canvas bind:this={chart}></canvas>
			</div>
			<div class="basis-4/12 bg-white rounded-lg shadow-lg">1</div>
		</div>
	</section>
</div>
