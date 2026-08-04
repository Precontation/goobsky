<script lang="ts">
	import { RadioGroup } from 'bits-ui';

	type Props = {
		items: {
			name: string;
			value: string;
			class?: string;
		}[];
		value: string;
		name: string;
	};

	let { items, value = $bindable(''), name }: Props = $props();
</script>

<RadioGroup.Root
	bind:value
	orientation="horizontal"
	{name}
	class="flex h-fit w-full rounded-theme border border-border bg-surface p-1"
>
	{#each items as item (item.value)}
		<RadioGroup.Item
			value={item.value}
			class="min-w-0 flex-1 shrink truncate
			rounded-theme
			p-2 text-sm hover:bg-hover
			data-[state=checked]:bg-surface-hover
			data-[state=checked]:shadow-sm {item.class}"
		>
			{item.name}
		</RadioGroup.Item>
	{/each}
</RadioGroup.Root>
