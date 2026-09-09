<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import type { Snippet } from 'svelte';

	const { href, name, children }: { href: Pathname; name: string; children: Snippet } = $props();
	const isActive = $derived.by(() => {
		if (href == '/') {
			// Custom logic for home (since its just "/")
			return page.url.pathname == href;
		}

		// Otherwise still highlight even if not on main page
		// e.g. /settings/accounts/ should still highlight settings
		// Include a / to prevent things like /settings-asdf matching /settings,
		// or just if it exactly matches thats fine too
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	});
</script>

<a href={resolve(href)} class="nav-button" class:active={isActive}>
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
		height: fit-content;

		font-size: large;

		border-radius: var(--ui-roundness);
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
