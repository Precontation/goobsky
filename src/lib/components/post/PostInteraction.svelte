<script lang="ts">
	import { Button } from 'bits-ui';
	import type { Component } from 'svelte';

	let {
		icon: IconComponent,
		count,
		targetUri,
		targetCid,
		interactionUri,
		create,
		remove,
		toggleable,
		fillWhenToggled
	}: {
		icon: Component;
		count?: number;
		targetUri?: string | null;
		targetCid?: string | null;
		interactionUri?: string | null;
		create?: (uri: string, cid: string) => Promise<string>;
		remove?: (uri: string) => Promise<void>;
		toggleable?: boolean;
		fillWhenToggled?: boolean;
	} = $props();

	let toggled: boolean | null = $state(
		// svelte-ignore state_referenced_locally
		interactionUri === null ? null : interactionUri !== undefined
	);

	let isToggling = $state(false);
	const toggleInteraction = async () => {
		if (isToggling) return;
		trigger();
		isToggling = true;
		const oldInteractionUri = interactionUri;
		const oldCount = count;
		const oldToggled = toggled;

		try {
			if (toggled) {
				if (!oldInteractionUri || !remove) return;
				if (count !== undefined) count -= 1;
				toggled = false;

				await remove(oldInteractionUri);

				// This will only run if the above code doesn't throw, so it's safe to set
				interactionUri = undefined;
			} else {
				if (!targetUri || !targetCid || !create) return;
				if (count !== undefined) count += 1;
				toggled = true;

				interactionUri = await create(targetUri, targetCid);
			}
		} catch {
			interactionUri = oldInteractionUri;
			count = oldCount;
			toggled = oldToggled;
		} finally {
			isToggling = false;
		}
	};

	import { onDestroy } from 'svelte';
	import { createWebHaptics } from 'web-haptics/svelte';

	const { trigger, destroy } = createWebHaptics();
	onDestroy(destroy);
</script>

{#if count !== undefined}
	<div class="stat">
		{#if toggleable && toggled !== null}
			<Button.Root
				class="flex cursor-pointer gap-1 hover:text-primary"
				onclick={toggleInteraction}
				disabled={isToggling}
				aria-pressed={toggled}
			>
				<IconComponent
					fill={toggled && fillWhenToggled ? 'var(--theme-primary)' : ''}
					class={toggled ? 'text-primary' : ''}
				></IconComponent>
				{count}
			</Button.Root>
		{:else}
			<div class="flex gap-1">
				<IconComponent />
				{count}
			</div>
		{/if}
	</div>
{/if}

<style>
	.stat {
		display: flex;
		gap: 0.25rem;
	}
</style>
