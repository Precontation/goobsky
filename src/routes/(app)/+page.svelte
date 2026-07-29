<script>
	import Feed from '$lib/components/feed/Feed.svelte';
	import NoteElement from '$lib/components/post/NoteElement.svelte';
	import { APP_NAME } from '$lib/config';
</script>

<NoteElement
	title={`Welcome to ${APP_NAME}!`}
	content="This is your homepage, and all of your added feeds will be viewable here."
	dismissalId="home-welcome"
/>

<Feed />
