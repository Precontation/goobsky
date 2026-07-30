<script>
	import { page } from '$app/state';
	import Feed from '$lib/components/feed/Feed.svelte';
	import NoteElement from '$lib/components/ui/notes/NoteElement.svelte';

	let query = $derived(page.url.searchParams.get('q'));
</script>

<NoteElement title={`Search results for: "${query ?? ''}"`} />

<Feed feedType="search" {query} />
