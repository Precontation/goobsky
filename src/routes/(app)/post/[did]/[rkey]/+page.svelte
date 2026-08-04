<script lang="ts">
	import { page } from '$app/state';
	import { bskyAgent } from '$lib/api/bskyApi';
	import Post from '$lib/components/post/Post.svelte';
	import FullPageSpinner from '$lib/components/ui/FullPageSpinner.svelte';
	import FullPageNote from '$lib/components/ui/notes/FullPageNote.svelte';
	import { getPostThread, type ThreadItem } from '$lib/helpers/atProto.svelte';
	import { AppBskyFeedDefs } from '@atproto/api';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from 'bits-ui';

	let loadingPosts: boolean = $state(true);
	let thread = $state<ThreadItem | null>();

	$effect(() => {
		let cancelled = false;

		if (!page.params.did || !page.params.rkey) {
			loadingPosts = false;
			thread = null;
			return;
		}

		const loadPosts = async (did: string, rkey: string) => {
			try {
				const loadedThread = await getPostThread(
					`at://${did}/app.bsky.feed.post/${rkey}`,
					bskyAgent
				); // TODO: not hardcode bskyAgent
				if (!cancelled) thread = loadedThread;
			} catch {
				if (!cancelled) thread = null;
			} finally {
				if (!cancelled) loadingPosts = false;
			}
		};

		loadingPosts = true;
		loadPosts(page.params.did, page.params.rkey);

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="flex gap-2 border-b border-border p-4">
	<Button.Root
		onclick={() => history.back()}
		class="h-fit w-fit items-center  rounded-full hover:bg-hover"
	>
		<ChevronLeft size="30" />
	</Button.Root>
	<h2>Post</h2>
</div>

{#if !loadingPosts}
	{#if thread}
		<Post post={thread.post} hasBottomBorder={true} isClickable={false} />
		{#each thread.replies as item}
			{#if AppBskyFeedDefs.isThreadViewPost(item)}
				<Post post={item.post} hasBottomBorder={true} isClickable={true} />
			{/if}
		{/each}
	{:else}
		<FullPageNote
			title={'Post not found'}
			content={"The post you were looking for was not found. It could be that the post is private, or that it doesn't exist."}
		/>
	{/if}
{:else}
	<FullPageSpinner />
{/if}
