<script>
	import NoteElement from '$lib/components/ui/notes/NoteElement.svelte';
	import FeedTabBar from '$lib/components/ui/tabs/FeedTabBar.svelte';
	import { APP_NAME } from '$lib/config';

	let { children } = $props();
</script>

<NoteElement
	title="Welcome to {APP_NAME}!"
	content="This is your homepage, and all of your added feeds will be viewable here."
	dismissalId="home-welcome"
/>

<FeedTabBar
	tabs={[
		{
			name: 'Discover',
			href: '/(app)/(home)'
		},
		{
			name: 'Following',
			href: '/(app)/(home)/following'
		}
	]}
/>

<!-- Containerize all the z-index shenanigans going on in children -->
<div class="z-0">
	{@render children()}
</div>
