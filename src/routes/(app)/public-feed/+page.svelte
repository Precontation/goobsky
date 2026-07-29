<script>
	import Feed from '$lib/components/feed/Feed.svelte';
	import NoteElement from '$lib/components/post/NoteElement.svelte';
</script>

<NoteElement
	title="What's this?"
	content="The public feed is what you'd see on a given site when logged out, and is fully unpersonalized."
	dismissalId="public-feed-whats-this"
/>

<Feed />
