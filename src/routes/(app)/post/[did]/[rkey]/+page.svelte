<script lang="ts">
	import { page } from '$app/state';
	import { bskyAgent } from '$lib/api/bskyApi';
	import Post from '$lib/components/post/Post.svelte';
	import ThreadReply from '$lib/components/post/ThreadReply.svelte';
	import FullPageSpinner from '$lib/components/ui/FullPageSpinner.svelte';
	import FullPageNote from '$lib/components/ui/notes/FullPageNote.svelte';
	import { getPostThread, type ThreadItem } from '$lib/helpers/atProto.svelte';
	import { AppBskyFeedDefs } from '@atproto/api';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from 'bits-ui';

	let loadingPosts: boolean = $state(true);
	let thread = $state<ThreadItem | null>();

	let ancestors = $derived.by(() => {
		// When the thread item changes, load its ancestors
		let currentAncestor = thread?.parent;
		let newAncestors = [];

		while (currentAncestor && AppBskyFeedDefs.isThreadViewPost(currentAncestor)) {
			newAncestors.push(currentAncestor);
			currentAncestor = currentAncestor.parent;
		}

		// Apparently pushing forward then reversing is faster to compute, but it doesn't really matter for my case
		// But there's no reason not to since I know of it!
		newAncestors.reverse();
		return newAncestors;
	});

	$effect(() => {
		// Load posts when params change

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

	let mainPost = $state();
	$effect(() => {
		if (!mainPost || !(mainPost instanceof HTMLElement)) return;
		mainPost.scrollIntoView();
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
	<div class="pb-50">
		{#each ancestors as item}
			{#if AppBskyFeedDefs.isThreadViewPost(item)}
				<Post
					post={item.post}
					hasBottomBorder={false}
					replyText={undefined}
					isClickable={true}
					threadLine={ancestors.indexOf(item) === 0 ? 'below' : 'both'}
				/>
			{/if}
		{/each}

		{#if thread}
			<div bind:this={mainPost}>
				<Post
					post={thread.post}
					hasBottomBorder={true}
					replyText={undefined}
					isClickable={false}
					isMainInThread={true}
					threadLine="above"
				/>
			</div>
			{#each thread.replies as item}
				{#if AppBskyFeedDefs.isThreadViewPost(item)}
					<ThreadReply {item} depth={1} />
				{/if}
			{/each}
		{:else}
			<FullPageNote
				title={'Post not found'}
				content={"The post you were looking for was not found. It could be that the post is private, or that it doesn't exist."}
			/>
		{/if}
	</div>
{:else}
	<FullPageSpinner />
{/if}
