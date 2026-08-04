<!-- TODO: have this be like the right sidebar maybe? That could be cool where you can still see the main settings page -->
<script>
	import { page } from '$app/state';
	import { ChevronLeft } from '@lucide/svelte';
	import { Button } from 'bits-ui';

	let { children } = $props();
</script>

<div class="mb-4 flex items-center gap-2 border-b border-border p-8 pb-4">
	<Button.Root
		onclick={() => history.back()}
		class=" h-fit w-fit items-center rounded-full hover:bg-hover"
	>
		<ChevronLeft size="35" class="-translate-x-0.5" />
	</Button.Root>
	<h1>{page.data.title}</h1>
</div>

{@render children()}
