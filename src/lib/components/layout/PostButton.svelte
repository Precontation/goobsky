<script>
	import { bskyAgent } from '$lib/api/bskyApi';
	import { sendPost } from '$lib/helpers/atProto.svelte';
	import { SquarePen } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';

	let isOpen = $state(false);
	let textAreaRef = $state();
	let textAreaValue = $state('');

	const segmenter = new Intl.Segmenter(undefined, {
		granularity: 'grapheme'
	});
	let charsLeft = $derived(300 - Array.from(segmenter.segment(textAreaValue)).length);

	const submitPost = async () => {
		const response = await sendPost(textAreaValue, bskyAgent);
		if (!response) {
			// TODO notification
			console.log('Failed response');
			textAreaValue = '';
			isOpen = false;
			return;
		}

		console.log('Success response');
		// TODO notification
		textAreaValue = '';
		isOpen = false;
	};
</script>

<button
	class="new-button"
	onclick={() => {
		isOpen = true;
	}}
	><SquarePen />
	<span class="text">New post</span></button
>

<Dialog.Root
	bind:open={isOpen}
	onOpenChange={() => {
		textAreaRef.focus();
	}}
>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-theme border bg-background p-7 outline-hidden sm:max-w-lg md:w-full"
		>
			<Dialog.Title class="text-lg font-semibold tracking-tight">Post</Dialog.Title>
			<textarea
				placeholder="What's on your mind?"
				class="h-auto max-h-125 min-h-35"
				bind:this={textAreaRef}
				bind:value={textAreaValue}></textarea>

			<div class="flex w-full gap-4">
				<button
					onclick={() => {
						textAreaValue = '';
						isOpen = false;
					}}
					class="cursor-pointer rounded-theme border border-border bg-surface p-3 hover:bg-surface-hover"
					>Cancel</button
				>
				<button
					onclick={submitPost}
					disabled={charsLeft < 0}
					class="cursor-pointer rounded-theme border border-border bg-primary p-3 hover:bg-primary-hover disabled:cursor-default disabled:bg-surface-hover"
					>Post</button
				>
				<span style={charsLeft < 0 ? 'color: red' : ''} class="ml-auto flex items-end"
					>{charsLeft}</span
				>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	.new-button {
		cursor: pointer;
		margin-top: 10px;

		display: flex;
		width: 100%;
		padding: 1rem;
		gap: 0.75rem;
		white-space: nowrap;

		font-size: large;

		border-radius: 9999px;
		border: 1px solid var(--color-primary);
	}

	.new-button:hover {
		background-color: var(--color-hover);
	}

	@media (width < 1300px) {
		.text {
			display: none;
		}
	}

	textarea {
		resize: none;
		field-sizing: content;
	}

	textarea:focus {
		outline: 0;
	}
</style>
