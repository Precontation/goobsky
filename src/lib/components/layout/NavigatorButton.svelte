<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	const { href, name, children }: { href: string; name: string; children: Snippet } = $props();
	const isActive = $derived(page.url.pathname === href);
</script>

<a href={resolve(href as `/${string}`)} class="nav-button">
	{@render children()}
	<span class:active={isActive}>{name}</span>
</a>

<style>
	.nav-button {
		display: flex;
		width: 100%;
		padding: 1rem;
		gap: 0.75rem;
		white-space: nowrap;

		font-size: large;
	}

	.nav-button:hover {
		background-color: var(--color-surface-hover);
	}

	.active {
		/* Apply a small text shadow to the element when active. It's not much, but it looks nice! */
		text-shadow: var(--color-primary) 1px 0 10px;
	}
</style>
