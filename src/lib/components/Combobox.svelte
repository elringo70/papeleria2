<script>
	import { slide } from 'svelte/transition';

	export let value;
	export let loading;

	export let list = [];

	export let onChange = () => {};
	export let onKeyup = () => {};
	export let onClick = () => {};

	$$restProps;
</script>

<div class="relative mb-3 inline-block w-full">
	<input
		class="input input-bordered w-full"
		bind:value
		on:change={onChange}
		on:keyup={onKeyup}
		{...$$restProps}
	/>

	{#if list.length > 0}
		<ul class="absolute mt-1 w-full divide-y divide-gray-300 rounded border border-gray-300">
			{#if loading}
				<li class="cursor-pointer bg-white py-2 px-3 text-sm hover:bg-gray-200">
					<span class="loading loading-dots loading-xs"></span>
				</li>
			{:else}
				{#each list as item, i}
					<div transition:slide={{ duration: 150 }}>
						<li
							class="cursor-pointer bg-white py-2 px-3 text-sm hover:bg-gray-200"
							value={i}
							on:click={onClick}
							on:keydown={onKeyup}
						>
							{item.display_name}
						</li>
					</div>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
