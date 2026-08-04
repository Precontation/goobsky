<script>
	import { resolve } from '$app/paths';
	import { APP_NAME } from '$lib/config';
	import { ChevronRight } from '@lucide/svelte';
	import { Button } from 'bits-ui';
</script>

<div class="settings">
	<h1 class="pb-4 pl-8">Settings</h1>

	<div class="flex flex-col">
		<Button.Root
			class="flex w-full cursor-pointer items-center border-y border-border p-2 pl-8 hover:bg-hover"
			href={resolve('/(app)/settings/(settings)/accounts')}
		>
			<div>
				<h2 class="text-start">Accounts</h2>
				<h3 class="text-start">Edit your connected accounts</h3>
			</div>

			<ChevronRight class="ml-auto cursor-pointer" />
		</Button.Root>
		<Button.Root
			class="flex w-full cursor-pointer items-center border-b border-border p-2 pl-8 hover:bg-hover"
			href={resolve('/(app)/settings/(settings)/feeds')}
		>
			<div>
				<h2 class="text-start">Feeds</h2>
				<h3 class="text-start">Customize your feeds</h3>
			</div>

			<ChevronRight class="ml-auto cursor-pointer" />
		</Button.Root>
		<Button.Root
			class="flex w-full cursor-pointer items-center border-b border-border p-2 pl-8 hover:bg-hover"
			href={resolve('/(app)/settings/(settings)/appearance')}
		>
			<div>
				<h2 class="text-start">Appearance</h2>
				<h3 class="text-start">Spice up your {APP_NAME} visuals</h3>
			</div>

			<ChevronRight class="ml-auto cursor-pointer" />
		</Button.Root>
	</div>
</div>

<style>
	.settings {
		padding-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
