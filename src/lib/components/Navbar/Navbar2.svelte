<script>
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
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<a class="btn btn-ghost text-xl">Papelería El Cyber</a>
	</div>
	<div class="navbar-center">
		<ul class="menu menu-horizontal px-1">
			{#each navbarLinks as link}
				{#if link.dropdown}
					<li>
						<details>
							<summary>{link.name}</summary>
							<ul class="p-2">
								{#each link.dropdown.links as dropdownLink}
									<li><a href={dropdownLink.href}>{dropdownLink.name}</a></li>
								{/each}
							</ul>
						</details>
					</li>
				{:else}
					<li><a href={link.href}>{link.name}</a></li>
				{/if}
			{/each}
		</ul>
	</div>
	<div class="navbar-end">
		<UserProfile />
	</div>
</div>
