import { restoreBskySession } from '$lib/api/bskyApi';
import type { PostItem } from '$lib/components/feed/Feed.svelte';
import { PREFERRED_LANGUAGES } from '$lib/config';
import {
	AppBskyFeedDefs,
	AppBskyFeedGetPosts,
	AppBskyFeedGetPostThread,
	type Agent
} from '@atproto/api';
import { SvelteURL } from 'svelte/reactivity';

// Create aliases so it's easier to reference in the code
export type ThreadItem = AppBskyFeedDefs.ThreadViewPost;

export const getPostThread = async (uri: string, agent?: Agent): Promise<ThreadItem | null> => {
	if (agent) {
		const restored = await restoreBskySession(); // TODO: await restore __ session, not necessarily only Bluesky
		if (restored) {
			const response = await agent.app.bsky.feed.getPostThread(
				{
					uri: uri
				},
				{
					headers: {
						'Accept-Language': PREFERRED_LANGUAGES
					}
				}
			);

			if (response.success) {
				if (!AppBskyFeedDefs.isThreadViewPost(response.data.thread)) return null;
				return response.data.thread;
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
	const url = new SvelteURL('https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread');
	url.searchParams.set('uri', uri);

	try {
		const response = await fetch(url, {
			method: 'GET'
		});

		if (!response.ok) {
			// If something fails in the fetch, return nothing.
			return null;
		}

		// When searching, there's a different data type. Handle that correctly
		// Get the response from the feed
		const json: AppBskyFeedGetPostThread.OutputSchema = await response.json();
		if (!AppBskyFeedDefs.isThreadViewPost(json.thread)) return null;
		return json.thread;
	} catch {
		// It could just be that the controller was aborted, but it doesn't matter in this case so no need to check
		return null;

		// Something failed D:
		// console.error(`Error while fetching: ${error.message}`);
	}
};

export const getPosts = async (uri: string, agent?: Agent): Promise<PostItem[]> => {
	if (agent) {
		const restored = await restoreBskySession(); // TODO: await restore __ session, not necessarily only Bluesky
		if (restored) {
			const response = await agent.app.bsky.feed.getPosts(
				{
					uris: [uri]
				},
				{
					headers: {
						'Accept-Language': PREFERRED_LANGUAGES
					}
				}
			);

			if (response.success) {
				return response.data.posts.map((post) => ({ post }));
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
	const url = new SvelteURL('https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts');
	url.searchParams.set('uris', [uri].toString());

	try {
		const response = await fetch(url, {
			method: 'GET'
		});

		if (!response.ok) {
			// If something fails in the fetch, return nothing.
			return [];
		}

		// When searching, there's a different data type. Handle that correctly
		// Get the response from the feed
		const json: AppBskyFeedGetPosts.OutputSchema = await response.json();
		return json.posts.map((post) => ({ post }));
		// If needed, json.hitsTotal is also available.
	} catch {
		// It could just be that the controller was aborted, but it doesn't matter in this case so no need to check
		return [];

		// Something failed D:
		// console.error(`Error while fetching: ${error.message}`);
	}
};
