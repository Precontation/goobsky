<script lang="ts">
	import { RichText } from '@atproto/api';

	let { content } = $props();

	let completedContent = $derived.by(() => {
		// Create the richtext from the content
		const rt = new RichText({
			text: content
		});

		// Return the segments
		return rt.segments();
	});
</script>

{#each completedContent as element}
	{#if element.isLink()}
		<a href={element.link?.uri} class="link">{element.text}</a>
	{:else if element.isMention()}
		<!-- <a href="">{element.text}</a> -->
		<p class="mention">{element.text}</p>
	{:else if element.isTag()}
		<!-- <a href="">{element.text}</a> -->
		<p class="tag">{element.text}</p>
	{:else}
		<p>{element.text}</p>
	{/if}
{/each}

<style>
	.link,
	.mention,
	.tag {
		color: var(--color-primary);
	}
</style>
