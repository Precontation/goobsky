<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';

	const { href, name, children }: { href: string; name: string; children: Snippet } = $props();
	const isActive = $derived(page.url.pathname === href);
</script>

<a href={resolve(href as `/${string}`)} class="nav-button" class:active={isActive}>
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
		background-color: var(--color-surface-hover);
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
