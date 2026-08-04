<script lang="ts">
	import type HlsInstance from 'hls.js';
	import { onMount } from 'svelte';

	let { title, src, thumbnail, aspectWidth, aspectHeight, class: className } = $props();
	let videoElement: HTMLVideoElement;

	onMount(() => {
		let hls: HlsInstance | undefined;

		void (async () => {
			const { default: Hls } = await import('hls.js');

			if (Hls.isSupported()) {
				hls = new Hls();
				hls.loadSource(src);
				hls.attachMedia(videoElement);
			} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
				videoElement.src = src;
			}
		})();

		return () => hls?.destroy();
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
	class="media-player {className}"
	style:aspect-ratio="{aspectWidth} / {aspectHeight}"
	style:width="min(100%, 45dvh * {aspectWidth} / {aspectHeight})"
>
</video>

<style>
	.media-player {
		border-radius: var(--ui-roundness);

		max-height: 45dvh;
		width: auto;
		max-width: 100%;
	}
</style>
