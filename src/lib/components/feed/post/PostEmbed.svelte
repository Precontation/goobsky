<script lang="ts">
	// TODO: either make this not bluesky-specific or have seperate components for each

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
		<img src={image.thumb} loading="lazy" alt={image.alt} />
	{/each}
{:else if AppBskyEmbedVideo.isView(embed.embed)}
	<!-- <video src={} ></video> -->
	<img src={embed.embed.thumbnail} alt={embed.embed.alt} />
{:else if AppBskyEmbedGallery.isView(embed.embed)}
	{#each embed.embed.items as item}
		<img
			src={(item as AppBskyEmbedGallery.ViewImage).thumbnail}
			loading="lazy"
			alt={(item as AppBskyEmbedGallery.ViewImage).alt}
		/>
	{/each}
{/if}
