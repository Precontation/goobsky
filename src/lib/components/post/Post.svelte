<script lang="ts">
	import { resolve } from '$app/paths';
	import { bskyAgent } from '$lib/api/bskyApi';
	import {
		AppBskyEmbedExternal,
		AppBskyEmbedGallery,
		AppBskyEmbedImages,
		AppBskyEmbedRecord,
		AppBskyEmbedRecordWithMedia,
		AppBskyEmbedVideo,
		AppBskyRichtextFacet
	} from '@atproto/api';
	import { Bookmark, Bot, Eye, Heart, MessageSquare, Repeat, Reply } from '@lucide/svelte';
	import { Button } from 'bits-ui';
	import ToolTip from '../ui/ToolTip.svelte';
	import PostContent from './PostContent.svelte';
	import PostEmbed from './PostEmbed.svelte';
	import PostInteraction from './PostInteraction.svelte';

	let {
		uri,
		cid,
		displayName,
		isBot,
		avatar,
		handle,
		isReply,
		content,
		facets,
		embed,
		replies,
		reposts,
		likes,
		likedUri,
		views, // Not available in Bluesky, but they may in others, so keep
		bookmarks,
		bookmarked,
		hasBottomBorder,
		isClickable
	}: {
		uri: string;
		cid: string;
		displayName: string;
		isBot: boolean;
		avatar?: string;
		handle: string;
		isReply?: boolean; // TODO: it doesn't provide the person replied to name, so you'd have to hydrate it or also render that
		content: string;
		facets?: AppBskyRichtextFacet.Main[];
		embed?:
			| AppBskyEmbedImages.View
			| AppBskyEmbedVideo.View
			| AppBskyEmbedGallery.View
			| AppBskyEmbedExternal.View
			| AppBskyEmbedRecord.View
			| AppBskyEmbedRecordWithMedia.View
			| {
					$type: string;
			  };
		replies?: number;
		reposts?: number;
		likes?: number;
		likedUri?: string | null; // If likedUri is null that means the user is logged out or something and is unable to like. Undefined just means logged in but not liked.
		views?: number;
		bookmarks?: number;
		bookmarked?: boolean | null; // If bookmarkedUri is null that means the user is logged out or something and is unable to bookmark. Undefined just means logged in but not bookmarked.
		hasBottomBorder: boolean; // If this is false it's probably a quote post where you don't want a bottom border.
		isClickable: boolean; // If this is true then it's most likely in the feed. If it's false then it probably is already on the post page
	} = $props();

	// svelte-ignore state_referenced_locally
	let liked: boolean | null = $state(likedUri === null ? null : likedUri !== undefined);
	// svelte-ignore state_referenced_locally
	let localLikes: number | undefined = $state(likes);
	// svelte-ignore state_referenced_locally
	let localLikedUri: string | null | undefined = $state(likedUri);

	let isLiking = $state(false);
	const togglePostLiked = async () => {
		if (localLikedUri === null) return;
		if (isLiking) return;

		const prevLiked = liked;
		const prevLikedUri = localLikedUri;
		const prevLocalLikes = localLikes;

		isLiking = true;
		liked = !liked;

		try {
			if (!liked) {
				// Since we flipped liked we have to kinda think flipped
				if (localLikedUri) {
					// Change the number displayed
					if (localLikes !== undefined) localLikes -= 1;

					await bskyAgent.deleteLike(localLikedUri);
					localLikedUri = undefined;
				}
			} else {
				// Change the number displayed
				if (localLikes !== undefined) localLikes += 1;

				const { uri: newLikeUri, cid: newLikeCid } = await bskyAgent.like(uri, cid);
				localLikedUri = newLikeUri;
			}
		} catch {
			// Probably hit a rate limit
			liked = prevLiked;
			localLikedUri = prevLikedUri;
			localLikes = prevLocalLikes;
		} finally {
			isLiking = false;
		}
	};
</script>

<article
	class="{hasBottomBorder ? 'border-b border-border' : ''} {isClickable
		? 'cursor-pointer hover:bg-hover'
		: ''}"
>
	<Button.Root
		class="absolute top-0 right-0 bottom-0 left-0 z-0"
		href={isClickable
			? resolve('/(app)/post/[did]/[rkey]', {
					did: uri.split('/').at(2) ?? 'undefined',
					rkey: uri.split('/').at(-1) ?? 'undefined'
				})
			: ''}
	></Button.Root>

	<div class="flex gap-2">
		<img
			loading="lazy"
			src={avatar}
			alt=""
			class="avatar z-10 h-10 w-10 shrink-0 self-start border border-border object-cover"
		/>
		<div class="flex flex-col gap-1">
			<div class="z-10 flex w-fit items-center gap-1">
				<span class="font-bold">{displayName}</span>
				<span class="text-xs">@{handle}</span>
				{#if isBot}
					<ToolTip
						trigger={Bot}
						class="h-4 w-4"
						content="This account has been marked as automated by its owner."
					/>
				{/if}
			</div>

			{#if isReply}
				<div class="z-10 flex w-fit gap-1">
					<Reply class="h-4 w-4 rotate-180" />
					<span class="text-xs">Is a reply</span>
				</div>
			{/if}

			<PostContent {content} {facets} />

			<div class="z-10">
				{#if embed}
					<PostEmbed {embed} />
				{/if}
			</div>
		</div>
	</div>
	<div class="z-1 flex w-fit gap-5">
		<PostInteraction icon={MessageSquare} count={replies} />
		<PostInteraction icon={Repeat} count={reposts} />
		<PostInteraction
			icon={Heart}
			count={likes}
			targetUri={uri}
			targetCid={cid}
			interactionUri={likedUri}
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
		<PostInteraction icon={Eye} count={views} />
		<PostInteraction
			icon={Bookmark}
			count={bookmarks}
			targetUri={uri}
			targetCid={cid}
			interactionUri={bookmarked === true ? uri : bookmarked === false ? undefined : null}
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
</article>

<style>
	article {
		padding: var(--post-padding);
		position: relative;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.avatar {
		border-radius: 100%;
	}
</style>
