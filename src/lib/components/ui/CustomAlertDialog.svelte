<script lang="ts">
	import { AlertDialog, type WithoutChild } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = AlertDialog.RootProps & {
		title: Snippet;
		confirmable?: boolean;
		onConfirm: () => void;
		description?: Snippet;
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
		// ...other component props if you wish to pass them
	};

	let {
		open = $bindable(false),
		children,
		contentProps,
		title,
		confirmable,
		onConfirm,
		description,
		...restProps
	}: Props = $props();

	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);
</script>

<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="fixed inset-0 z-50 bg-background/80" />
		<AlertDialog.Content
			class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] place-items-center gap-4 border border-border bg-background p-8 outline-hidden sm:max-w-lg md:w-full"
			{...contentProps}
		>
			<div class="flex flex-col items-center">
				<AlertDialog.Title>
					{@render title()}
				</AlertDialog.Title>
				{#if description}
					<AlertDialog.Description>
						{@render description()}
					</AlertDialog.Description>
				{/if}
			</div>
			{@render children?.()}
			<div class="flex gap-2">
				<AlertDialog.Cancel
					onclick={() => trigger()}
					class="cursor-pointer rounded-(--roundness) border border-border bg-surface p-2 hover:bg-surface-hover"
					>Cancel</AlertDialog.Cancel
				>
				<AlertDialog.Action
					onclick={() => {
						trigger();
						onConfirm();
					}}
					disabled={!confirmable}
					class="cursor-pointer rounded-(--roundness) border border-border bg-surface p-2 hover:bg-surface-hover disabled:cursor-not-allowed disabled:bg-background"
					>Confirm</AlertDialog.Action
				>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
