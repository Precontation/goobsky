<script>
	import Feed from '$lib/components/feed/Feed.svelte';
	import NoteElement from '$lib/components/ui/notes/NoteElement.svelte';
</script>

<NoteElement
	title="What's this?"
	content="If you ever save/bookmark a post, it'l show up here."
	dismissalId="saved-whats-this"
/>

<Feed feedType="saved" />
