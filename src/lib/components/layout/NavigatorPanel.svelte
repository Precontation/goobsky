<script>
	import Icon from '$lib/assets/branding/Icon.svelte';
	import { HatGlasses, House, Settings } from '@lucide/svelte';
	import NavigatorButton from './NavigatorButton.svelte';
</script>

<nav>
	<a href="/" class="icon">
		<Icon />
	</a>
	<NavigatorButton href="/" name="Home"><House /></NavigatorButton>
	<NavigatorButton href="/public-feed" name="Public Feed"><HatGlasses /></NavigatorButton>
	<NavigatorButton href="/settings" name="Settings"><Settings /></NavigatorButton>
</nav>

<style>
	.icon {
		margin-bottom: 0.5rem;
		display: flex;
		aspect-ratio: 1/1;
		justify-content: center;
		align-self: flex-end;
		border-radius: 100%;
		padding: 0.25rem;
	}

	.icon:hover {
		background-color: var(--color-surface-hover);
	}

	nav {
		margin-left: auto;
		padding-right: 1rem;
		width: min-content;

		display: flex;
		flex-direction: column;
	}

	@media (width < 1000px) {
		.icon {
			display: none;
		}

		nav {
			margin-inline: auto;
			padding-right: 0px;

			flex-direction: row;
		}
	}
</style>
