<script lang="ts">
	import Navigator from '$lib/components/layout/Navigator.svelte';
	import RightSidebar from '$lib/components/layout/RightSidebar.svelte';

	let { children } = $props();
</script>

<div class="app-shell">
	<div class="side-region">
		<Navigator />
	</div>
	<main>
		{@render children()}
	</main>
	<div class="side-region">
		<RightSidebar />
	</div>
</div>

<style>
	.app-shell {
		width: 100%;
		min-height: 100dvh;

		max-width: 3000px;
		margin-inline: auto; /* i did not know this existed wow i am bad at css */

		display: grid;
		grid-template-columns: 320px minmax(0, 600px) 320px;
		justify-content: center;
	}

	.side-region {
		top: 1rem;
		position: sticky;
		align-self: start;
	}

	main {
		min-height: 100dvh;
		height: fit-content;
		border-inline: 1px solid var(--color-border);
	}

	@media (width < 1000px) {
		.app-shell {
			grid-template-columns: minmax(0, 600px);
		}

		.side-region {
			display: none;
		}
	}
</style>
