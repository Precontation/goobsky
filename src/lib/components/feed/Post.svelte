<script lang="ts">
	import { Bookmark, Eye, Heart, MessageSquare, Repeat } from '@lucide/svelte';

	let {
		displayName,
		avatar,
		handle,
		content,
		replies,
		reposts,
		likes,
		views, // Not available in Bluesky, but they may in others, so keep
		bookmarks
	}: {
		displayName: string;
		avatar?: string;
		handle: string;
		content: string;
		replies?: number;
		reposts?: number;
		likes?: number;
		views?: number;
		bookmarks?: number;
	} = $props();
</script>

<div class="post-container">
	<div class="flex gap-2">
		<img
			loading="lazy"
			src={avatar}
			alt=""
			class="avatar h-10 w-10 shrink-0 self-start border border-border object-cover"
		/>
		<div class="flex flex-col">
			<div>
				<span class="font-bold">{displayName}</span>
				<span class="text-xs">@{handle}</span>
			</div>
			<p>{content}</p>
		</div>
	</div>
	<div class="flex gap-5">
		{#if replies}
			<div class="flex">
				<MessageSquare />
				{replies}
			</div>
		{/if}
		{#if reposts}
			<div class="flex">
				<Repeat />
				{reposts}
			</div>
		{/if}
		{#if likes}
			<div class="flex">
				<Heart />
				{likes}
			</div>
		{/if}
		{#if views}
			<div class="flex">
				<Eye />
				{views}
			</div>
		{/if}
		{#if bookmarks}
			<div class="flex">
				<Bookmark />
				{bookmarks}
			</div>
		{/if}
	</div>
</div>

<style>
	.post-container {
		padding: var(--post-padding);
		position: relative;
		border-bottom: 1px solid var(--color-border);

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.avatar {
		border-radius: 100%;
	}
</style>
