<script>
	import Icon from '$lib/assets/branding/Icon.svelte';
	import { HatGlasses, House, Settings } from '@lucide/svelte';
	import NavigatorButton from './NavigatorButton.svelte';
</script>

<nav>
	<a
		href="/"
		class="mb-2 flex aspect-square justify-center self-end rounded-full p-1 hover:bg-surface-hover"
	>
		<Icon />
	</a>
	<NavigatorButton href="/" name="Home"><House /></NavigatorButton>
	<NavigatorButton href="/public-feed" name="Public Feed"><HatGlasses /></NavigatorButton>
	<NavigatorButton href="/settings" name="Settings"><Settings /></NavigatorButton>
</nav>

<style>
	nav {
		margin-left: auto;
		padding-right: 1rem;
		width: min-content;

		display: flex;
		flex-direction: column;
	}
</style>
