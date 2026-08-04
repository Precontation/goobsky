<script lang="ts">
	import { resolve } from '$app/paths';
	import { bskyAgent } from '$lib/api/bskyApi';
	import { Bookmark, Bot, Heart, MessageSquare, Repeat, Reply } from '@lucide/svelte';

	import type { AppBskyFeedDefs, AppBskyRichtextFacet } from '@atproto/api';
	import { Button } from 'bits-ui';
	import ToolTip from '../ui/ToolTip.svelte';
	import PostContent from './PostContent.svelte';
	import PostEmbed from './PostEmbed.svelte';
	import PostInteraction from './PostInteraction.svelte';

	let {
		post,
		hasBottomBorder,
		isClickable
	}: {
		post: AppBskyFeedDefs.PostView;
		hasBottomBorder: boolean; // If this is false it's probably a quote post where you don't want a bottom border.
		isClickable: boolean; // If this is true then it's most likely in the feed. If it's false then it probably is already on the post page
	} = $props();

	// svelte-ignore state_referenced_locally
	let liked: boolean | null = $state(
		post.viewer?.like === null ? null : post.viewer?.like !== undefined
	);
	// svelte-ignore state_referenced_locally
	let localLikes: number | undefined = $state(post.likeCount);
	// svelte-ignore state_referenced_locally
	let localLikedUri: string | null | undefined = $state(post.viewer?.like);

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

				const { uri: newLikeUri, cid: newLikeCid } = await bskyAgent.like(post.uri, post.cid);
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
	{#if isClickable}
		<Button.Root
			class="absolute top-0 right-0 bottom-0 left-0 z-0"
			href={isClickable
				? resolve('/(app)/post/[did]/[rkey]', {
						did: post.uri.split('/').at(2) ?? 'undefined',
						rkey: post.uri.split('/').at(-1) ?? 'undefined'
					})
				: ''}
		/>
	{/if}

	<div class="flex gap-2">
		<img
			loading="lazy"
			src={post.author.avatar}
			alt=""
			class="avatar z-10 h-10 w-10 shrink-0 self-start border border-border object-cover"
		/>
		<div class="flex flex-col gap-1">
			<div class="z-10 flex w-fit items-center gap-1">
				<span class="font-bold">{post.author.displayName ?? 'Unknown user'}</span>
				<span class="text-xs">@{post.author.handle ?? 'Unknown handle'}</span>
				{#if post.author.labels?.some((label) => label.val === 'bot') ?? false}
					<ToolTip
						trigger={Bot}
						class="h-4 w-4"
						content="This account has been marked as automated by its owner."
					/>
				{/if}
			</div>

			{#if post.record.reply}
				<div class="z-10 flex w-fit gap-1">
					<Reply class="h-4 w-4 rotate-180" />
					<span class="text-xs">Is a reply</span>
				</div>
			{/if}

			<PostContent
				content={post.record.text as string}
				facets={post.record.facets as AppBskyRichtextFacet.Main[]}
			/>

			<div class="z-10">
				{#if post.embed}
					<PostEmbed embed={post.embed} />
				{/if}
			</div>
		</div>
	</div>
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
