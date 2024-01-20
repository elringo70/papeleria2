<script>
	import Icon from '@iconify/svelte';

	export let name = '';
	export let sales = 0;
	export let percent = 0;
	export let icon = 'file-icons:default';
</script>

<div class="flex flex-col break-words bg-white shadow-xl rounded-lg p-7">
	<div class="flex gap-5">
		<div class="flex basis-2/3">
			<div>
				<p class="mb-0 font-sans font-semibold leading-normal uppercase text-md text-gray-400">
					{name}
				</p>
				<h5 class="mb-2 font-bold text-gray-600 text-2xl">${sales}</h5>
				<p class="mb-0">
					<span class="font-bold leading-normal text-emerald-500">+{percent}%</span> desde ayer
				</p>
			</div>
		</div>
		<div class="basis-1/3 text-right">
			<div
				class="bg-emerald-600 rounded-full text-white shadow shadow-emerald-600 inline-block p-4"
			>
				<Icon class="text-2xl" {icon} />
			</div>
		</div>
	</div>
</div>
