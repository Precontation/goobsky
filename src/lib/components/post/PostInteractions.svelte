<script lang="ts">
	import { bskyAgent } from '$lib/api/bskyApi';
	import { AppBskyFeedDefs } from '@atproto/api';
	import { Bookmark, Heart, MessageSquare, Repeat } from '@lucide/svelte';
	import PostInteraction from './PostInteraction.svelte';

	let { post }: { post: AppBskyFeedDefs.PostView } = $props();
</script>

<div class="z-1 flex w-fit gap-5">
	<PostInteraction icon={MessageSquare} count={post.replyCount} />
	<PostInteraction icon={Repeat} count={post.repostCount} />
	<PostInteraction
		icon={Heart}
		count={post.likeCount}
		targetUri={post.uri}
		targetCid={post.cid}
		interactionUri={post.viewer?.like}
		create={async (createUri, createCid) => {
			const { uri: newUri, cid: newCid } = await bskyAgent.like(createUri, createCid);
			return newUri;
		}}
		remove={async (removeUri) => {
			await bskyAgent.deleteLike(removeUri);
		}}
		toggleable={true}
		fillWhenToggled={true}
	/>
	<PostInteraction
		icon={Bookmark}
		count={post.bookmarkCount}
		targetUri={post.uri}
		targetCid={post.cid}
		interactionUri={post.viewer?.bookmarked === true
			? post.uri
			: post.viewer?.bookmarked === false
				? undefined
				: null}
		create={async (createUri, createCid) => {
			await bskyAgent.app.bsky.bookmark.createBookmark({
				uri: createUri,
				cid: createCid
			});

			// Return the create uri because then when unsaving it it can
			return createUri;
		}}
		remove={async (removeUri) => {
			await bskyAgent.app.bsky.bookmark.deleteBookmark({
				uri: removeUri
			});
		}}
		toggleable={true}
		fillWhenToggled={true}
	/>
</div>
