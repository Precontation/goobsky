<script lang="ts">
	import { bskyAgent } from '$lib/api/bskyApi';
	import { getPosts, type PostItem } from '$lib/helpers/atProto.svelte';
	import { AppBskyRichtextFacet } from '@atproto/api';
	import { ChevronsUpDown } from '@lucide/svelte';
	import { Button, Collapsible } from 'bits-ui';
	import LoadingSpinner from '../ui/LoadingSpinner.svelte';
	import Post from './Post.svelte';

	let { embed } = $props();

	let loadingPosts: boolean = $state(false);
	let posts = $state<PostItem[]>();
	let collapsibleOpened = $state(false);

	const handleCollapsibleClicked = async () => {
		if (collapsibleOpened) {
			collapsibleOpened = false;
			return;
		}

		collapsibleOpened = true;

		if (posts) return; // Don't refetch the posts if they have already been fetched

		loadingPosts = true;
		try {
			posts = await getPosts(embed.uri, bskyAgent); // TODO: not hardcode bskyAgent
		} catch {
			posts = [];
		} finally {
			loadingPosts = false;
		}
	};
</script>

<Collapsible.Root
	class="embed-content flex cursor-pointer flex-col border border-border p-3 hover:border-border-hover"
	bind:open={collapsibleOpened}
>
	<div class="flex items-center justify-between space-x-10">
		<h4 class="text-[15px] font-medium">Quote post</h4>
		<Button.Root
			class="rounded-9px bg-background-alt text-foreground shadow-btn inline-flex h-10 w-10 items-center justify-center border border-border transition-all hover:bg-hover active:scale-[0.98]"
			aria-label="Show starred repositories"
			onclick={handleCollapsibleClicked}
		>
			<ChevronsUpDown class="size-4" />
		</Button.Root>
	</div>

	<Collapsible.Content hiddenUntilFound>
		{#if !loadingPosts}
			<Button.Root class="w-full " href={embed.uri} target="_blank" rel="noopener noreferrer">
				{#each posts as item}
					<Post
						uri={item.post.uri}
						cid={item.post.cid}
						displayName={item.post.author.displayName ?? 'Unknown user'}
						isBot={item.post.author.labels?.some((label) => label.val === 'bot') ?? false}
						avatar={item.post.author.avatar}
						handle={item.post.author.handle ?? 'Unknown handle'}
						isReply={item.post.record.reply as any}
						content={(item.post.record.text as string) ?? 'asdf'}
						facets={item.post.record.facets as AppBskyRichtextFacet.Main[]}
						embed={item.post.embed}
						replies={item.post.replyCount}
						reposts={item.post.repostCount}
						likes={item.post.likeCount}
						likedUri={item.post.viewer?.like}
						bookmarks={item.post.bookmarkCount}
						bookmarked={item.post.viewer?.bookmarked}
						hasBottomBorder={false}
						isClickable={true}
					/>
				{/each}
			</Button.Root>
		{:else}
			<LoadingSpinner />
		{/if}
	</Collapsible.Content>
</Collapsible.Root>
