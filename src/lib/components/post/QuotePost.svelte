<script lang="ts">
	import { bskyAgent } from '$lib/api/bskyApi';
	import { getPosts } from '$lib/helpers/atProto.svelte';
	import { ChevronsUpDown } from '@lucide/svelte';
	import { Button, Collapsible } from 'bits-ui';
	import type { PostItem } from '../feed/Feed.svelte';
	import LoadingSpinner from '../ui/LoadingSpinner.svelte';
	import Post from './Post.svelte';

	let { embed } = $props();

	let loadingPosts: boolean = $state(false);
	let posts = $state<PostItem[]>();
	let collapsibleOpened = $state(false);

	const handleCollapsibleClicked = async () => {
		if (collapsibleOpened) {
			collapsibleOpened = false;
			return;
		}

		collapsibleOpened = true;

		if (posts) return; // Don't refetch the posts if they have already been fetched

		loadingPosts = true;
		try {
			posts = await getPosts(embed.uri, bskyAgent); // TODO: not hardcode bskyAgent
		} catch {
			posts = [];
		} finally {
			loadingPosts = false;
		}
	};
</script>

<Collapsible.Root
	class="embed-content flex cursor-pointer flex-col border border-border p-3 hover:border-border-hover"
	bind:open={collapsibleOpened}
>
	<div class="flex items-center justify-between space-x-10">
		<h4 class="text-[15px] font-medium">Quote post</h4>
		<Button.Root
			class="rounded-9px bg-background-alt text-foreground shadow-btn inline-flex h-10 w-10 items-center justify-center border border-border transition-all hover:bg-hover active:scale-[0.98]"
			aria-label="Show starred repositories"
			onclick={handleCollapsibleClicked}
		>
			<ChevronsUpDown class="size-4" />
		</Button.Root>
	</div>

	<Collapsible.Content hiddenUntilFound>
		{#if !loadingPosts}
			<Button.Root class="w-full " href={embed.uri} target="_blank" rel="noopener noreferrer">
				{#each posts as item}
					<Post post={item.post} hasBottomBorder={false} isClickable={true} />
				{/each}
			</Button.Root>
		{:else}
			<LoadingSpinner />
		{/if}
	</Collapsible.Content>
</Collapsible.Root>
