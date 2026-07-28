<!-- TODO: this should be handled by +page.svelte, not an always-there thing -->
<script>
	import { Search } from '@lucide/svelte';
</script>

<aside>
	<form>
		<label class="search-container">
			<Search class="shrink-0" />
			<input name="q" placeholder="Search" class="w-full" />
		</label>
	</form>
</aside>

<style>
	aside {
		padding-left: 2rem;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.search-container {
		width: 100%;
		height: 3rem;

		display: flex;
		gap: 1rem;
		padding: 1rem;

		align-items: center;

		border: 1px solid var(--color-border);
	}

	/* Remove the box outline focus thing on input, as we have a custom one */
	input:focus {
		outline: none;
	}

	/* Handle the custom outline */

	/* Hovering */
	.search-container:hover {
		border: 1px solid var(--color-hover);
	}

	/* Focused (text area selected) */
	.search-container:focus-within {
		outline: 1px solid var(--color-primary);
	}
</style>
