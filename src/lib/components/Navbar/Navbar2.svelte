<script>
	import { onMount } from 'svelte';
	import DropdownLink from './DropdownLink.svelte';
	import UserProfile from './UserProfile.svelte';

	const navbarLinks = [
		{ name: 'Caja', href: '/orders', active: false },
		{
			name: 'Clientes',
			active: false,
			dropdown: {
				links: [
					{ name: 'Nuevo cliente', href: '/customers/new-customer' },
					{ name: 'Ver clientes', href: '/customers/get-customers' }
				],
				isOpen: false
			}
		},
		{
			name: 'Productos',
			active: false,
			dropdown: {
				links: [
					{ name: 'Crear producto', href: '/products/new-product' },
					{ name: 'Ver productos', href: '/products/get-products' },
					{ name: 'Buscar producto', href: '/products/search-product' }
				],
				isOpen: false
			}
		},
		{ name: 'Categorías', href: '/categories', active: false },
		{ name: 'Estadísticas', href: '/stadistics', active: false },
		{ name: 'Test', href: '/test', active: false },
		{ name: 'Corte', href: '/proof', active: false }
	];

	onMount(() => {
		window.addEventListener('click', function (e) {
			document.querySelectorAll('.dropdown-item').forEach((item) => {
				if (!item.contains(e.target)) {
					item.open = false;
				}
			});
		});
	});
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<a href="/orders" class="btn btn-ghost text-xl">Papelería El Cyber</a>
	</div>
	<div class="navbar-center">
		<ul class="menu menu-horizontal px-1">
			{#each navbarLinks as link}
				{#if link.dropdown}
					<!--<li>
						<details class="dropdown-item">
							<summary>{link.name}</summary>
							<ul class="p-2">
								{#each link.dropdown.links as dropdownLink}
									<li><a href={dropdownLink.href}>{dropdownLink.name}</a></li>
								{/each}
							</ul>
						</details>
					</li>-->
					<div class="dropdown dropdown-end">
						<div tabindex="0" role="button" class="btn btn-ghost rounded-btn">{link.name}</div>
						<ul class="menu dropdown-content bg-base-100 rounded-box z-[1] mt-4 w-52 p-2 shadow">
							{#each link.dropdown.links as dropdownLink}
								<li><a href={dropdownLink.href}>{dropdownLink.name}</a></li>
							{/each}
						</ul>
					</div>
				{:else}
					<!--<li><a href={link.href}>{link.name}</a></li>-->
					<a href={link.href} class="btn btn-ghost rounded-btn">{link.name}</a>
				{/if}
			{/each}
		</ul>
	</div>
	<div class="navbar-end">
		<UserProfile />
	</div>
</div>
