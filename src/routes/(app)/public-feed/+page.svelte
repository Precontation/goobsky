<script lang="ts">
	import NoteElement from '$lib/components/feed/NoteElement.svelte';
	import { onMount } from 'svelte';
	// Import the bluesky post types
	import Post from '$lib/components/feed/post/Post.svelte';
	import type { AppBskyFeedDefs, AppBskyFeedGetFeed, AppBskyRichtextFacet } from '@atproto/api';
	import { AppBskyFeedPost } from '@atproto/api';

	// Create aliases so it's easier to reference in the code
	type FeedResponse = AppBskyFeedGetFeed.OutputSchema;
	type BlueskyPost = AppBskyFeedDefs.FeedViewPost;

	// Create the feed state.
	// Allow both null and undefined because undefined means loading and null means error/no results
	let feed: BlueskyPost[] = $state([]);
	let cursor: string | undefined = $state();

	onMount(async () => {
		try {
			// 1. Move params to URL string
			// 2. Remove the trailing slash from getFeed
			const feedUri = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';
			const targetUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed?feed=${encodeURIComponent(feedUri)}`;

			const response = await fetch(targetUrl, {
				method: 'GET'
			});

			// Get the response from the feed
			const json: FeedResponse = await response.json();

			// Set the feed and cursor from the response
			feed = json.feed;
			cursor = json.cursor;
		} catch (error: any) {
			// Something failed D:
			alert(`Fetch failed entirely: ${error.message}`);
			feed = [];
		}
	});
</script>

<NoteElement
	title="What's this?"
	content="The public feed is what you'd see on a given site when logged out, and is fully unpersonalized."
	dismissalId="public-feed-whats-this"
/>

{#each feed as item (item.post.uri)}
	{#if AppBskyFeedPost.isRecord(item.post.record)}
		<Post
			displayName={item.post.author.displayName ?? 'Unknown user'}
			avatar={item.post.author.avatar}
			handle={item.post.author.handle ?? 'Unknown handle'}
			content={(item.post.record.text as string) ?? 'asdf'}
			facets={item.post.record.facets as AppBskyRichtextFacet.Main[]}
			embed={item.post.embed}
			replies={item.post.replyCount}
			reposts={item.post.repostCount}
			likes={item.post.likeCount}
			bookmarks={item.post.bookmarkCount}
		/>
	{/if}
{/each}
