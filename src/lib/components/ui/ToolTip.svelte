<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Component } from 'svelte';

	const {
		trigger: Trigger,
		class: className,
		content
	}: { trigger: Component; class: string; content: string } = $props();
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Trigger class={className} />
	</Tooltip.Trigger>
	<Tooltip.Content>
		<div class="tooltip">
			<span>{content}</span>
		</div>
		<Tooltip.Arrow class="text-border" />
	</Tooltip.Content>
</Tooltip.Root>

<style>
	.tooltip {
		border-radius: var(--ui-roundness);
		border: 1px solid var(--color-border);

		background-color: var(--color-surface);

		padding: 1rem;
	}
</style>
