<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/branding/favicon.svg';
	import { APP_NAME } from '$lib/config';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{page.data.title ? `${page.data.title} - ` : ''}{APP_NAME}</title>
</svelte:head>
{@render children()}
