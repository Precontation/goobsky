<script lang="ts">
	import type { RouteId } from '$app/types';
	import TabFeedButton from './TabFeedButton.svelte';

	let {
		tabs
	}: {
		tabs: {
			name: string;
			href: RouteId;
		}[];
	} = $props();
</script>

<div class="tab-container">
	{#each tabs as tab}
		<TabFeedButton name={tab.name} href={tab.href}></TabFeedButton>
	{/each}
</div>

<style>
	.tab-container {
		background-color: var(--color-background);
		position: relative;
		display: flex;
		border-bottom: 1px solid var(--color-border);
	}
</style>
