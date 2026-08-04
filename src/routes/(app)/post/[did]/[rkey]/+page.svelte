<script lang="ts">
	import { page } from '$app/state';
	import { bskyAgent } from '$lib/api/bskyApi';
	import Post from '$lib/components/post/Post.svelte';
	import FullPageSpinner from '$lib/components/ui/FullPageSpinner.svelte';
	import FullPageNote from '$lib/components/ui/notes/FullPageNote.svelte';
	import { getPosts, type PostItem } from '$lib/helpers/atProto.svelte';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from 'bits-ui';
	import { onMount } from 'svelte';

	let loadingPosts: boolean = $state(false);
	let posts = $state<PostItem[]>();

	onMount(async () => {
		if (!page.params.did || !page.params.rkey) {
			posts = [];
			return;
		}

		console.log(page.params.did);
		loadingPosts = true;

		try {
			posts = await getPosts(
				`at://${page.params.did}/app.bsky.feed.post/${page.params.rkey}`,
				bskyAgent
			); // TODO: not hardcode bskyAgent
		} catch {
			posts = [];
		} finally {
			loadingPosts = false;
		}
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
	{#if posts && posts.length > 0}
		{#each posts as item}
			<Post post={item.post} hasBottomBorder={false} isClickable={false} />
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
