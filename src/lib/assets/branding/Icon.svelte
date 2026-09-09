<script lang="ts">
	import favicon from '$lib/assets/branding/favicon.png';
	let { class: className }: { class?: string } = $props();
</script>

<img src={favicon} class="h-10 {className ?? ''} [image-rendering:pixelated]" alt="icon" />
