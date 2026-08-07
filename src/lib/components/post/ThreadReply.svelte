<script lang="ts">
	import { AppBskyFeedDefs } from '@atproto/api';
	import Post from './Post.svelte';
	import ThreadReply from './ThreadReply.svelte';

	const maxDepth = 2;

	let {
		item,
		depth,
		replyText
	}: { item: AppBskyFeedDefs.ThreadViewPost; depth: number; replyText?: string } = $props();

	const getValidReplies = (post: AppBskyFeedDefs.ThreadViewPost) => {
		if (!post.replies) return [];

		let newReplies: AppBskyFeedDefs.ThreadViewPost[] = [];

		post.replies.forEach((reply) => {
			if (AppBskyFeedDefs.isThreadViewPost(reply)) {
				newReplies.push(reply);
			}
		});

		newReplies.reverse();
		return newReplies;
	};

	let replies: AppBskyFeedDefs.ThreadViewPost[] = $derived(getValidReplies(item));
	let depthPx = $derived(Math.min(depth, maxDepth) * 30);
</script>

<Post
	post={item.post}
	hasBottomBorder={true}
	isClickable={true}
	{replyText}
	threadLine={depth <= maxDepth + 1
		? replies.length > 0
			? 'below'
			: 'none'
		: replies.length > 0
			? 'both'
			: 'above'}
/>

{#if replies.length > 0}
	<div style:padding-left="{depthPx}px">
		<div>
			{#each replies as reply}
				<ThreadReply
					item={reply}
					depth={depth + 1}
					replyText="Replying to {item.post.author.displayName}"
				/>
			{/each}
		</div>
	</div>
{/if}
