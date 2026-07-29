<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	const { href, name, children }: { href: string; name: string; children: Snippet } = $props();
	const isActive = $derived.by(() => {
		if (href == '/') {
			// Custom logic for home (since its just "/")
			return page.url.pathname == href;
		}

		// Otherwise still highlight even if not on main page
		// e.g. /settings/accounts/ should still highlight settings
		return page.url.pathname.startsWith(href);
	});
</script>

<a {href} class="nav-button" class:active={isActive}>
	{@render children()}
	<span class="text">{name}</span>
</a>

<style>
	.nav-button {
		display: flex;
		width: 100%;
		padding: 1rem;
		gap: 0.75rem;
		white-space: nowrap;

		font-size: large;

		border-radius: var(--roundness);
	}

	.nav-button:hover {
		background-color: var(--color-hover);
	}

	.active {
		color: var(--color-primary);
	}

	@media (width < 1300px) {
		.text {
			display: none;
		}
	}
</style>
