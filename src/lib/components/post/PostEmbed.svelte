<script lang="ts">
	// TODO: either make this not bluesky-specific or have seperate components for each

	import VideoPlayer from '$lib/components/media/VideoPlayer.svelte';
	import {
		AppBskyEmbedExternal,
		AppBskyEmbedGallery,
		AppBskyEmbedImages,
		AppBskyEmbedRecord,
		AppBskyEmbedRecordWithMedia,
		AppBskyEmbedVideo
	} from '@atproto/api';
	import { Globe } from '@lucide/svelte';
	import { Button } from 'bits-ui';
	import QuotePost from './QuotePost.svelte';
	// Import self for recursive embeds (embed with media)
	import PostEmbed from './PostEmbed.svelte';

	let embed: {
		embed:
			| AppBskyEmbedImages.View
			| AppBskyEmbedVideo.View
			| AppBskyEmbedGallery.View
			| AppBskyEmbedExternal.View
			| AppBskyEmbedRecord.View
			| AppBskyEmbedRecordWithMedia.View
			| {
					$type: string;
			  };
	} = $props();
</script>

{#if AppBskyEmbedImages.isView(embed.embed)}
	<!-- Image embed (old/simple system) -->
	{#each embed.embed.images as image}
		<!-- TODO: onclick load in a popup the full size image -->
		<img src={image.thumb} loading="lazy" alt={image.alt} class="embed-content" />
	{/each}
{:else if AppBskyEmbedVideo.isView(embed.embed)}
	<!-- Video embed -->
	<VideoPlayer
		title={embed.embed.alt}
		src={embed.embed.playlist}
		thumbnail={embed.embed.thumbnail}
		aspectWidth={embed.embed.aspectRatio?.width ?? 1}
		aspectHeight={embed.embed.aspectRatio?.height ?? 1}
		class="embed-content flex w-fit justify-start"
	></VideoPlayer>
{:else if AppBskyEmbedGallery.isView(embed.embed)}
	<!-- Image gallery embed (new/flexible system) -->
	{#each embed.embed.items as item}
		<img
			src={(item as AppBskyEmbedGallery.ViewImage).thumbnail}
			loading="lazy"
			alt={(item as AppBskyEmbedGallery.ViewImage).alt}
			class="embed-content"
		/>
	{/each}
{:else if AppBskyEmbedExternal.isView(embed.embed)}
	<!-- Link embed -->
	<Button.Root
		class="embed-content flex cursor-pointer flex-col border border-border hover:border-border-hover"
		href={embed.embed.external.uri}
		target="_blank"
		rel="noopener noreferrer"
	>
		{#if embed.embed.external.thumb}
			<img
				src={embed.embed.external.thumb}
				loading="lazy"
				alt=""
				class="embed-content border-b border-border"
			/>
		{/if}
		<span class="m-2 mr-2 mb-0 ml-4">{embed.embed.external.title}</span>
		<span class="m-2 mr-4 ml-4 flex items-center gap-2 border-t border-border pt-2 text-xs"
			><Globe class="h-3 w-3" />{new URL(embed.embed.external.uri).hostname}</span
		>
	</Button.Root>
{:else if AppBskyEmbedRecord.isView(embed.embed)}
	<QuotePost embed={embed.embed} />
{:else if AppBskyEmbedRecordWithMedia.isView(embed.embed)}
	<PostEmbed embed={embed.embed.media}></PostEmbed>
	<QuotePost embed={embed.embed.record} />
{/if}

<style>
	.embed-content {
		border-radius: var(--roundness);
		text-overflow: ellipsis;
		max-width: 100%;
		overflow: hidden;
	}
</style>
