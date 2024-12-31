<script>
	export let label;
	export let errors = undefined;
	export let bindInputElement = undefined;
	$$restProps;
</script>

<label class="form-control w-full">
	<div class="label">
		{#if label}
			<span class="label-text uppercase font-semibold">{label}</span>
		{/if}
		{#if errors}
			<span class="label-text-alt text-red-400">{errors[0]}</span>
		{/if}
	</div>
	<input
		{...$$restProps}
		class="input input-bordered w-full {errors ? 'input-error' : ''}"
		on:keypress
		bind:this={bindInputElement}
	/>
</label>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
