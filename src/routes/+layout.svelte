<script lang="ts">
	import favicon from '$lib/assets/branding/favicon.svg';
	import { APP_NAME } from '$lib/config';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{APP_NAME}</title>
</svelte:head>
{@render children()}
