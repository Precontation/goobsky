<script>
	import { Button } from 'bits-ui';
	let { embed } = $props();
</script>

<Button.Root
	class="embed-content flex cursor-pointer flex-col border border-border hover:border-border-hover"
	href={embed.uri}
	target="_blank"
	rel="noopener noreferrer"
>
	<span class="p-2">Quote post, unfinished</span>
</Button.Root>
