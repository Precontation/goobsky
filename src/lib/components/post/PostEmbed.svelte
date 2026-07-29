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
	{#each embed.embed.images as image}
		<!-- TODO: onclick load in a popup the full size image -->
		<img src={image.thumb} loading="lazy" alt={image.alt} class="embed-content" />
	{/each}
{:else if AppBskyEmbedVideo.isView(embed.embed)}
	<VideoPlayer
		title={embed.embed.alt}
		src={embed.embed.playlist}
		thumbnail={embed.embed.thumbnail}
		aspectWidth={embed.embed.aspectRatio?.width ?? 1}
		aspectHeight={embed.embed.aspectRatio?.height ?? 1}
		class="embed-content flex w-fit justify-start"
	></VideoPlayer>
{:else if AppBskyEmbedGallery.isView(embed.embed)}
	{#each embed.embed.items as item}
		<img
			src={(item as AppBskyEmbedGallery.ViewImage).thumbnail}
			loading="lazy"
			alt={(item as AppBskyEmbedGallery.ViewImage).alt}
			class="embed-content"
		/>
	{/each}
{/if}

<style>
	.embed-content {
		border-radius: var(--roundness);
	}
</style>
