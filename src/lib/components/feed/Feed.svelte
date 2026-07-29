<script lang="ts">
	// Import the bluesky post types
	import { page } from '$app/state';
	import FullPageNote from '$lib/components/post/FullPageNote.svelte';
	import Post from '$lib/components/post/Post.svelte';
	import type { AppBskyFeedDefs, AppBskyFeedGetFeed, AppBskyRichtextFacet } from '@atproto/api';
	import { AppBskyFeedPost } from '@atproto/api';

	// Create aliases so it's easier to reference in the code
	type FeedResponse = AppBskyFeedGetFeed.OutputSchema;
	type PostItem = AppBskyFeedDefs.FeedViewPost;

	// Create the feed state.
	// Allow both null and undefined because undefined means loading and null means error/no results
	let cursor = $state<string>();
	let feed = $state<PostItem[]>();

	const searchUrl: URL | null = $derived.by(() => {
		const searchQuery = page.url.searchParams.get('q');
		if (searchQuery) {
			const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');
			url.searchParams.set('q', searchQuery);
			return url;
		}
		return null;
	});

	$effect(() => {
		let targetUrl: URL;
		let usingSearch = false;

		if (searchUrl) {
			targetUrl = searchUrl;
			usingSearch = true;
		} else {
			// Default feed and target URL
			const feedUri = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';
			const feedUrl = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed');
			feedUrl.searchParams.set('feed', feedUri);

			targetUrl = feedUrl;
		}

		// Create an AbortController to do async work in a non-async effect
		const controller = new AbortController();

		const fetchFeed = async () => {
			try {
				const response = await fetch(targetUrl, {
					method: 'GET',
					signal: controller.signal
				});

				if (!response.ok) {
					feed = [];
					return;
				}

				// When searching, there's a different data type. Handle that correctly
				if (usingSearch) {
					// Get the response from the feed
					const json: PostItem[] = await response.json();
					feed = json;
				} else {
					// Get the response from the feed
					const json: FeedResponse = await response.json();

					// Set the feed and cursor from the response
					feed = json.feed;
					cursor = json.cursor;
				}
			} catch (error: any) {
				// It could just be that the controller was aborted, so check
				if (controller.signal.aborted) return;

				// Something failed D:
				console.error(`Error while fetching: ${error.message}`);
				feed = [];
			}
		};

		// Run the fetch function without awaiting for it!
		fetchFeed();

		return () => {
			controller.abort();
		};
	});
</script>

{#if feed}
	{#if feed.length > 0}
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
	{:else}
		<FullPageNote
			title={'Uh oh!'}
			content={'There seems to be no content available. Are you logged in?'}
		/>
	{/if}
{:else}
	<!-- Loading animation here, if wanted -->
{/if}
