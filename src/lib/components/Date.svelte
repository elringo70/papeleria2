<script>
	import moment from 'moment';

	/** @type {string} */
	export let today = moment().format('YYYY-MM-DD');

	/** @constant @type {string} */
	export let label;
	/** @constant @type {string} */
	export let name;
	/** @type {boolean} */
	export let required = false;
</script>

<div class="form-control mb-3 w-full">
	{#if label}
		<label class="mb-2 block text-sm font-bold text-gray-700" for={name}>
			{label}
		</label>
	{/if}

	<input
		type="date"
		class="w-full rounded border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-gray-500 focus:outline-none"
		value={today}
		{name}
		id={name}
		{required}
	/>
</div>

<style>
	input[type='date']::-webkit-calendar-picker-indicator {
		color: rgb(55 65 81);
	}
</style>
