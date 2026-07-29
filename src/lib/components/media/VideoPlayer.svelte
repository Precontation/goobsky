<script lang="ts">
	let { title, src, thumbnail, aspectWidth, aspectHeight, class: className } = $props();
	import Hls from 'hls.js';
	import { onMount } from 'svelte';

	let videoElement: HTMLVideoElement;

	onMount(() => {
		if (Hls.isSupported()) {
			const hls = new Hls();
			hls.loadSource(src);
			hls.attachMedia(videoElement);
		} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
			videoElement.src = src;
		}
	});
</script>

<video
	bind:this={videoElement}
	{title}
	autoplay
	controls
	muted
	playsinline
	poster={thumbnail}
	class={`media-player ${className}`}
	style={`aspect-ratio: ${aspectWidth} / ${aspectHeight}; width: min(100%, 45dvh * ${aspectWidth} / ${aspectHeight})`}
>
</video>

<style>
	.media-player {
		border-radius: var(--roundness);

		max-height: 45dvh;
		width: auto;
		max-width: 100%;
	}
</style>
