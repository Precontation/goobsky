<script lang="ts">
	// Import the bluesky post types
	import { bskyAgent, restoreBskySession } from '$lib/api/bskyApi';
	import Post from '$lib/components/post/Post.svelte';
	import FullPageNote from '$lib/components/ui/notes/FullPageNote.svelte';
	import { PREFERRED_LANGUAGES } from '$lib/config';
	import type {
		Agent,
		AppBskyFeedDefs,
		AppBskyFeedGetFeed,
		AppBskyFeedSearchPosts,
		AppBskyRichtextFacet
	} from '@atproto/api';
	import { AppBskyFeedPost } from '@atproto/api';
	import LoadingSpinner from '../ui/LoadingSpinner.svelte';

	// Import app so you can do app.bsky.feed.searchPosts

	// Create aliases so it's easier to reference in the code
	type FeedResponse = AppBskyFeedGetFeed.OutputSchema;
	type PostItem = AppBskyFeedDefs.FeedViewPost;

	// Create the loaded feed state.
	type LoadedFeed = {
		items: PostItem[];
		cursor?: string;
	};

	type FeedType = 'public' | 'discover' | 'following' | 'search';

	let { feedType, query }: { feedType: FeedType; query?: string | null } = $props();

	// Allow null and undefined here because undefined = loading and null = no results
	let loadedFeed = $state<LoadedFeed | null>();

	const whatsHotUri = 'at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot';

	// Loads the public feed, meaning it does not have any authentication required.
	const loadPublicFeed = async (signal: AbortSignal): Promise<LoadedFeed | null> => {
		// Default feed and target URL
		const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.getFeed');
		url.searchParams.set('feed', whatsHotUri);

		const feedToLoad: LoadedFeed = {
			items: [],
			cursor: undefined
		};

		try {
			const response = await fetch(url, {
				method: 'GET',
				signal: signal,
				headers: {
					'Accept-Language': PREFERRED_LANGUAGES
				}
			});

			if (!response.ok) {
				// If something fails in the fetch, return the default LoadedFeed containing nothing.
				return feedToLoad;
			}

			// Get the response from the feed
			const json: FeedResponse = await response.json();

			// Set the feed and cursor from the response
			feedToLoad.items = json.feed;
			feedToLoad.cursor = json.cursor;
		} catch (error: any) {
			// It could just be that the controller was aborted, so check
			if (signal.aborted) return null;

			// Something failed D:
			// console.error(`Error while fetching: ${error.message}`);
		}

		return feedToLoad;
	};

	// Loads the user's logged in 'discover' feed.
	const loadDiscover = async (signal: AbortSignal, agent: Agent): Promise<LoadedFeed | null> => {
		const restored = await restoreBskySession(); // TODO: await restore __ session, not necessarily only Bluesky

		if (!restored) {
			console.error('Failed to restore session on loading timeline!');
			return null;
		}

		const { data, success } = await agent.app.bsky.feed.getFeed(
			{
				feed: whatsHotUri
				// Initial loading doesn't need a cursor
				// TODO: maybe a page param like ?cursor= or something
			},
			{
				headers: {
					'Accept-Language': PREFERRED_LANGUAGES
				}
			}
		);

		if (success) {
			// Return the loaded feed so it doesn't fetch a second time!
			return {
				items: data.feed,
				cursor: data.cursor
			};
		} else {
			console.error('Failed to get timeline feed.');
			// Optionally try to fetch logged out, however I personally want it to clearly show you're logged out
		}

		return null;
	};

	// Loads the user's logged in timeline (followed users only).
	const loadFollowing = async (signal: AbortSignal, agent: Agent): Promise<LoadedFeed | null> => {
		const restored = await restoreBskySession(); // TODO: await restore __ session, not necessarily only Bluesky

		if (!restored) {
			console.error('Failed to restore session on loading timeline!');
			return null;
		}

		const { data, success } = await agent.getTimeline(
			{
				// Initial loading doesn't need a cursor
				// TODO: maybe a page param like ?cursor= or something
			},
			{
				headers: {
					'Accept-Language': PREFERRED_LANGUAGES
				}
			}
		);

		if (success) {
			// Return the loaded feed so it doesn't fetch a second time!
			return {
				items: data.feed,
				cursor: data.cursor
			};
		} else {
			console.error('Failed to get timeline feed.');
			// Optionally try to fetch logged out, however I personally want it to clearly show you're logged out
		}

		return null;
	};

	// Loads the search results. On Bluesky for example, this requires a login. However, some platforms may not, and that's why the param is optional.
	const loadSearchResults = async (
		query: string,
		signal: AbortSignal,
		agent?: Agent
	): Promise<LoadedFeed | null> => {
		const feedToLoad: LoadedFeed = {
			items: [],
			cursor: undefined
		};

		if (agent) {
			const restored = await restoreBskySession(); // TODO: await restore __ session, not necessarily only Bluesky
			if (restored) {
				const response = await agent.app.bsky.feed.searchPosts(
					{
						q: query
						// tag: [],
						// url: '',
						// lang: 'en',
						// sort: 'latest',
						// limit: 25,
						// since: '',
						// until: '',
						// author: '',
						// cursor: '',
						// domain: '',
						// mentions: ''
					},
					{
						headers: {
							'Accept-Language': PREFERRED_LANGUAGES
						}
					}
				);

				if (response.success) {
					// You have to map the posts to the FeedViewPost type, as Post doesn't have the same exact data structure
					feedToLoad.items = response.data.posts.map((post) => ({ post }));
					feedToLoad.cursor = response.data.cursor;
					// If needed, response.data.hitsTotal is also available.

					// Return the loaded feed so it doesn't fetch a second time!
					return feedToLoad;
				} else {
					console.warn('Failed to search posts using agent! Attempting to fetch logged out.');
					// Don't return here! It should continue and attempt again to fetch, this time using generic 'fetch' logged out
				}
			} else {
				console.warn('Failed to restore session on search! Attempting to fetch logged out.');
				// Don't return here! It should continue and attempt again to fetch, this time using generic 'fetch' logged out
			}
		}

		// If there isn't an agent, attempt to just use fetch
		const url = new URL('https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts');
		url.searchParams.set('q', query);

		try {
			const response = await fetch(url, {
				method: 'GET',
				signal: signal
			});

			if (!response.ok) {
				// If something fails in the fetch, return the default LoadedFeed containing nothing.
				return feedToLoad;
			}

			// When searching, there's a different data type. Handle that correctly
			// Get the response from the feed
			const json: AppBskyFeedSearchPosts.OutputSchema = await response.json();
			feedToLoad.items = json.posts.map((post) => ({ post }));
			feedToLoad.cursor = json.cursor;
			// If needed, json.hitsTotal is also available.
		} catch (error: any) {
			// It could just be that the controller was aborted, but it doesn't matter in this case so no need to check
			return null;

			// Something failed D:
			// console.error(`Error while fetching: ${error.message}`);
		}

		return feedToLoad;
	};

	$effect(() => {
		// On effect call, that means new search, so reset the loaded feed to show the loading spinner again
		loadedFeed = undefined;

		// Create an AbortController to do async work in a non-async effect
		const controller = new AbortController();

		const fetchFeed = async () => {
			switch (feedType) {
				case 'public':
					// Logged out discover page
					loadedFeed = await loadPublicFeed(controller.signal);
					break;
				case 'discover':
					loadedFeed = await loadDiscover(controller.signal, bskyAgent);
					break;
				case 'following':
					loadedFeed = await loadFollowing(controller.signal, bskyAgent);
					break;
				case 'search':
					if (!query) break;
					loadedFeed = await loadSearchResults(query, controller.signal, bskyAgent);
					break;
				default:
					console.error('Invalid feed type!');
					break;
			}
		};

		// Run the fetch function without awaiting for it!
		fetchFeed();

		return () => {
			controller.abort();
		};
	});
</script>

{#if loadedFeed !== undefined}
	{#if loadedFeed !== null}
		{#if loadedFeed.items.length > 0}
			{#each loadedFeed.items as item (item.post.uri)}
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
			<FullPageNote title={'Uh oh!'} content={'There seems to be no content available.'} />
		{/if}
	{:else}
		<FullPageNote title={'Uh oh!'} content={'There seems to be an error. Are you logged in?'} />
	{/if}
{:else}
	<div class="flex h-full w-full items-center justify-center">
		<LoadingSpinner />
	</div>
{/if}
