<script>
	import { onMount, setContext } from 'svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';

	/** @type {import('./$types').PageData} */
	export let data;

	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '../utils/firebase';

	import '../app.css';
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import Navbar2 from '$lib/components/Navbar/Navbar2.svelte';

	onMount(() => {
		if (browser) {
			const unsubscribe = onAuthStateChanged(auth, () => invalidateAll());
			return unsubscribe();
		}
	});

	setContext('user', data.user);
</script>

{#if data.user}
	<Navbar />
{/if}

<slot />
