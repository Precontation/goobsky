<script lang="ts">
	import { page } from '$app/state';
	import Feed from '$lib/components/feed/Feed.svelte';
	import FullPageSpinner from '$lib/components/ui/FullPageSpinner.svelte';
	import FullPageNote from '$lib/components/ui/notes/FullPageNote.svelte';
	import NoteElement from '$lib/components/ui/notes/NoteElement.svelte';

	let query = $state<string>();
	$effect(() => {
		query = page.url.searchParams.get('q')?.trim() ?? '';
	});
</script>

{#if query === ''}
	<FullPageNote title={'Uh oh!'} content="The search query is blank!" />
{:else if query === undefined}
	<FullPageSpinner />
{:else}
	<NoteElement title={`Search results for: "${query}"`} />

	<Feed feedType="search" {query} />
{/if}
