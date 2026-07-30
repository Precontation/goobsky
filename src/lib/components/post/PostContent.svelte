<script lang="ts">
	import type { AppBskyRichtextFacet } from '@atproto/api';
	import { RichText } from '@atproto/api';

	let { content, facets }: { content: string; facets?: AppBskyRichtextFacet.Main[] } = $props();

	let completedContent = $derived.by(() => {
		// Create the richtext from the content
		const rt = new RichText({
			text: content,
			facets: facets
		});

		// Return the segments
		return rt.segments();
	});
</script>

<div class="block whitespace-pre-wrap">
	{#each completedContent as element}
		{#if element.isLink()}
			<a href={element.link?.uri} class="link">{element.text}</a>
		{:else if element.isMention()}
			<!-- <a href="">{element.text}</a> -->
			<span class="mention">{element.text}</span>
		{:else if element.isTag()}
			<!-- <a href="">{element.text}</a> -->
			<span class="tag">{element.text}</span>
		{:else}
			<span>{element.text}</span>
		{/if}
	{/each}
</div>

<style>
	.link,
	.mention,
	.tag {
		color: var(--color-primary);
	}

	.link:hover,
	.mention:hover,
	.tag:hover {
		text-decoration: underline;
	}
</style>
