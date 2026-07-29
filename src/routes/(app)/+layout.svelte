<script lang="ts">
	import NavigatorPanel from '$lib/components/layout/NavigatorPanel.svelte';
	import UtilityPanel from '$lib/components/layout/UtilityPanel.svelte';

	let { children } = $props();
</script>

<div class="app-shell">
	<div class="side-region navigator-panel">
		<NavigatorPanel />
	</div>
	<main>
		{@render children()}
	</main>
	<div class="side-region utility-panel">
		<UtilityPanel />
	</div>
</div>

<style>
	.app-shell {
		width: 100%;
		min-height: 100dvh;

		max-width: 3000px;
		margin-inline: auto;

		display: grid;
		grid-template-columns: 320px minmax(0, 600px) 320px;
		grid-template-rows: auto;
		justify-content: center;
	}

	.side-region {
		top: 1rem;
		position: sticky;
		align-self: start;
		z-index: 1;
	}

	main {
		min-height: 100dvh;
		height: fit-content;
		border-inline: 1px solid var(--color-border);
	}

	@media (width < 1300px) {
		.app-shell {
			grid-template-columns: 160px minmax(0, 600px) 160px;
		}
	}

	@media (width < 1000px) {
		.app-shell {
			grid-template-columns: minmax(0, 600px);
			grid-template-rows: 160 minmax(0, 600px) 160px;
		}

		.utility-panel {
			order: -1;
			top: 0;

			/* Give safe area top to avoid the dynamic island or ripoff android ones */
			padding-bottom: env(safe-area-inset-top);
		}

		.navigator-panel {
			order: 1;

			/* Give safe area bottom to avoid the buttons or bar thingy */
			padding-bottom: env(safe-area-inset-bottom);
			bottom: 0;

			background-color: var(--color-background);
		}
	}
</style>
