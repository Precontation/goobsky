<script>
	import { page } from '$app/state';
	import Feed from '$lib/components/feed/Feed.svelte';
	import NoteElement from '$lib/components/ui/notes/NoteElement.svelte';
</script>

<NoteElement title="Search results for: {'"'}{page.url.searchParams.get('q')}{'"'}" />

<Feed feedType="search" query={page.url.searchParams.get('q')} />
