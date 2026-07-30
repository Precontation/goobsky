<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { RouteId } from '$app/types';
	import type { Snippet } from 'svelte';

	const { href, name, children }: { href: RouteId; name: string; children?: Snippet } = $props();
	const isActive = $derived.by(() => {
		// Makes sure to NOT highlight if not on main page of href
		// e.g. /home/discover/asdfasdf/ would not still highlight page
		return page.route.id === href;
	});
</script>

<a href={resolve(href)} class="tab-button" class:active={isActive}>
	{#if children}
		{@render children()}
	{/if}
	<span class="text">{name}</span>
</a>

<style>
	.tab-button {
		display: flex;
		width: 100%;
		padding: 1rem;
		gap: 0.75rem;
		white-space: nowrap;

		font-size: large;

		border-radius: var(--roundness);
		background-color: var(--color-background);

		justify-content: center;
	}

	.tab-button:hover {
		background-color: var(--color-hover);
	}

	.active {
		background-color: var(--color-surface);
		color: var(--color-primary);
	}

	@media (width < 1300px) {
		.text {
			display: none;
		}
	}
</style>
