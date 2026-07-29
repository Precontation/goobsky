<script lang="ts">
	import {
		AppBskyEmbedExternal,
		AppBskyEmbedGallery,
		AppBskyEmbedImages,
		AppBskyEmbedRecord,
		AppBskyEmbedRecordWithMedia,
		AppBskyEmbedVideo
	} from '@atproto/api';
	import { Bookmark, Eye, Heart, MessageSquare, Repeat } from '@lucide/svelte';
	import PostContent from './PostContent.svelte';
	import PostEmbed from './PostEmbed.svelte';

	let {
		displayName,
		avatar,
		handle,
		content,
		// facets,
		embed,
		replies,
		reposts,
		likes,
		views, // Not available in Bluesky, but they may in others, so keep
		bookmarks
	}: {
		displayName: string;
		avatar?: string;
		handle: string;
		content: string;
		// facets:
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
		views?: number;
		bookmarks?: number;
	} = $props();
</script>

<div class="post-container">
	<div class="flex gap-2">
		<img
			loading="lazy"
			src={avatar}
			alt=""
			class="avatar h-10 w-10 shrink-0 self-start border border-border object-cover"
		/>
		<div class="flex flex-col gap-1">
			<div>
				<span class="font-bold">{displayName}</span>
				<span class="text-xs">@{handle}</span>
			</div>
			<PostContent {content} />
			{#if embed}
				<PostEmbed {embed} />
			{/if}
		</div>
	</div>
	<div class="flex gap-5">
		{#if replies}
			<div class="stat">
				<MessageSquare />
				{replies}
			</div>
		{/if}
		{#if reposts}
			<div class="stat">
				<Repeat />
				{reposts}
			</div>
		{/if}
		{#if likes}
			<div class="stat">
				<Heart />
				{likes}
			</div>
		{/if}
		{#if views}
			<div class="stat">
				<Eye />
				{views}
			</div>
		{/if}
		{#if bookmarks}
			<div class="stat">
				<Bookmark />
				{bookmarks}
			</div>
		{/if}
	</div>
</div>

<style>
	.post-container {
		padding: var(--post-padding);
		position: relative;
		border-bottom: 1px solid var(--color-border);

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.avatar {
		border-radius: 100%;
	}

	.stat {
		display: flex;
		gap: 0.25rem;
	}
</style>
