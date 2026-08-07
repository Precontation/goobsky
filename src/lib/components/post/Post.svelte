<script lang="ts">
	import { resolve } from '$app/paths';
	import { Bot, Reply } from '@lucide/svelte';

	import type { AppBskyFeedDefs, AppBskyRichtextFacet } from '@atproto/api';
	import { Button } from 'bits-ui';
	import ToolTip from '../ui/ToolTip.svelte';
	import PostContent from './PostContent.svelte';
	import PostEmbed from './PostEmbed.svelte';
	import PostInteractions from './PostInteractions.svelte';

	let {
		post,
		hasBottomBorder,
		isClickable,
		replyText,
		threadLine = 'none',
		isMainInThread = false
	}: {
		post: AppBskyFeedDefs.PostView;
		hasBottomBorder: boolean; // If this is false it's probably a quote post where you don't want a bottom border.
		isClickable: boolean; // If this is true then it's most likely in the feed. If it's false then it probably is already on the post page
		replyText: string | undefined; // Renders the reply text, or it's not a reply if undefined
		threadLine: 'none' | 'above' | 'below' | 'both'; // Self-explanatory; used for thread reply line things
		isMainInThread?: boolean; // If it's the clicked post in a thread, change some visuals
	} = $props();
</script>

<article
	class="border-border {isMainInThread ? 'border-t' : ''} {hasBottomBorder
		? 'border-b'
		: ''} {isClickable ? 'cursor-pointer hover:bg-hover' : ''}"
>
	{#if isClickable}
		<Button.Root
			class="absolute top-0 right-0 bottom-0 left-0 z-0"
			href={isClickable
				? resolve('/(app)/post/[did]/[rkey]', {
						did: post.uri.split('/').at(2) ?? 'undefined',
						rkey: post.uri.split('/').at(-1) ?? 'undefined'
					})
				: ''}
		/>
	{/if}

	<div class="flex gap-2">
		<div
			class="relative shrink-0 self-stretch {threadLine === 'both'
				? 'thread-middle'
				: threadLine === 'above'
					? 'thread-start'
					: threadLine === 'below'
						? 'thread-end'
						: ''}"
		>
			<img
				loading="lazy"
				src={post.author.avatar}
				alt=""
				class="avatar z-10 h-10 w-10 shrink-0 self-start border border-border object-cover"
			/>
		</div>
		<div class="flex flex-col gap-1 {isMainInThread ? 'pt-post' : 'py-post'}">
			<div class="z-10 flex w-fit items-center gap-1">
				<span class="font-bold">{post.author.displayName ?? 'Unknown user'}</span>
				{#if !isMainInThread}
					<span class="text-xs text-text-muted">@{post.author.handle ?? 'Unknown handle'}</span>
				{/if}
				{#if post.author.labels?.some((label) => label.val === 'bot') ?? false}
					<ToolTip
						trigger={Bot}
						class="h-4 w-4"
						content="This account has been marked as automated by its owner."
					/>
				{/if}
			</div>

			{#if isMainInThread}
				<span class="text-sm text-text-muted">@{post.author.handle ?? 'Unknown handle'}</span>
			{/if}

			{#if replyText !== undefined}
				<div class="z-10 flex w-fit gap-1">
					<Reply class="h-4 w-4 rotate-180" />
					<span class="text-xs">{replyText || 'Is a reply'}</span>
				</div>
			{/if}

			<PostContent
				content={post.record.text as string}
				facets={post.record.facets as AppBskyRichtextFacet.Main[]}
			/>

			<div class="z-10">
				{#if post.embed}
					<PostEmbed embed={post.embed} />
				{/if}
			</div>

			{#if !isMainInThread}
				<div class="pt-3">
					<PostInteractions {post} />
				</div>
			{/if}
		</div>
	</div>
	{#if isMainInThread}
		<div class="border-t border-border py-post">
			<PostInteractions {post} />
		</div>
	{/if}
</article>

<style>
	article {
		/* Don't do vertical padding here because threads wouldn't have the perfect line thingy otherwise */
		padding-inline: var(--post-padding);

		position: relative;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.avatar {
		border-radius: 100%;
		margin-top: var(--post-padding);
	}

	.thread-start::after,
	.thread-middle::after,
	.thread-middle::before,
	.thread-end::before {
		content: '';
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 1px;
		border: 1px solid var(--color-border);
	}

	.thread-middle::before,
	.thread-end::before {
		/* Set top to post padding + 40px (avatar size) + 5px (so it isn't directly connected) */
		top: calc(var(--post-padding) + 40px + 5px);

		bottom: 0;
	}

	.thread-start::after,
	.thread-middle::after {
		top: 0;

		/* Set height to post padding - 5px (so it isn't directly connected) */
		height: calc(var(--post-padding) - 5px);
	}
</style>
