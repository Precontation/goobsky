<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="error-page">
	<h1>404 not found!</h1>
	<code>{page.error?.message ?? 'No error message!'}</code>
</div>

<style>
	.error-page {
		padding: var(--post-padding);
	}
</style>
