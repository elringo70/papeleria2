<script>
	import Icon from '@iconify/svelte';
	import { Input } from '$lib/components/index';

	/** @type {string[]} tags*/
	let tags = [];

	export const cleanTags = () => {
		/** @type {string[]} tags*/
		const newArray = [],
			tags = [...newArray];
	};

	/** @type {HTMLInputElement} tagInput*/
	let tagInput;

	const onKeyPress = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			const cleanString = e.target.value.trim();
			addTag(cleanString);

			tagInput.value = '';
		}
	};

	/**
	 * @function
	 * @name addTag
	 * @param {string} tag
	 */
	const addTag = (tag) => {
		tags = [...tags, tag];
	};

	/**
	 * @function
	 * @name removeTag
	 * @param {number} position
	 */
	const removeTag = (position) => {
		const newArray = tags.splice(position, 1);
		tags = [...newArray];
	};
</script>

<div class="ml-10">
	<div class="flex flex-col items-center text-sm">
		<div class="w-full">
			<Input
				placeholder="SubCategoria"
				name=""
				onKeyPressed={(e) => onKeyPress(e)}
				bind:bindElement={tagInput}
			/>
		</div>
	</div>
	<div class="flex flex-wrap p-2 border border-solid border-gray-300 rounded">
		{#each tags as tag, i}
			<div class="badge badge-lg badge-neutral p-4">
				<div class="flex flex-wrap justify-between items-center gap-2">
					<div>
						{tag}
					</div>
					<!-- svelte-ignore a11y_role -->
					<div class="cursor-pointer" data-position={i} on:click={() => removeTag(i)}>
						<Icon icon="mdi:cross-circle" />
					</div>
				</div>
			</div>
		{:else}
			<div class="p-5"></div>
		{/each}
	</div>

	{#each tags as tag, i}
		<input type="hidden" name={`subCategories[${i}]`} value={tag} />
	{/each}
</div>
