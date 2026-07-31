<script lang="ts">
	import { dev } from '$app/environment';
	import { X } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { title, content, dismissalId }: { title: string; content: string; dismissalId?: string } =
		$props();

	// The variable for is open, OFF by default to prevent flashing
	let isOpen = $state(false);

	const close = () => {
		// If in developement, don't save to localStorage to always be able to see the notification, but still hide this time
		if (!dev) {
			// Set the localStorage of "is element deleted"
			const storageItem = `full-page-note-dismissed-${dismissalId}`;
			localStorage.setItem(storageItem, '1');
		}

		// Set the local "element deleted"
		isOpen = false;
	};

	onMount(() => {
		// First check to make sure dismissalId exists, and if not stop set open
		if (!dismissalId) {
			isOpen = true;
			return;
		}

		// Get the localStorage of "is element deleted"
		const storageItem = `full-page-note-dismissed-${dismissalId}`;
		const storageResult = localStorage.getItem(storageItem);

		if (storageResult) {
			// If the storage exists, than hide it
			isOpen = false;
		} else {
			// If it doesn't exist, then show it
			isOpen = true;
		}
	});
</script>

{#if isOpen}
	<div class="full-page-note-container">
		<h2>{title}</h2>
		<p class="text-center">{content}</p>
		{#if dismissalId}
			<button class="close-button" onclick={() => close()}><X /></button>
		{/if}
	</div>

	<style>
		.full-page-note-container {
			background-color: var(--color-background);
			padding: var(--post-padding);
			position: relative;
			width: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.close-button {
			position: absolute;
			top: 0.25rem;
			right: 0.25rem;
			padding: 5px;
			cursor: pointer;

			border-radius: 100%;
		}

		.close-button:hover {
			/* Set the background color to a semi-transparent borde */
			background-color: color-mix(in srgb, var(--color-hover) 60%, transparent);
		}
	</style>
{/if}
