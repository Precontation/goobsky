<script lang="ts">
	import { PinInput, REGEXP_ONLY_DIGITS_AND_CHARS, type PinInputRootSnippetProps } from 'bits-ui';

	type CellProps = PinInputRootSnippetProps['cells'][0];

	let { value = $bindable(''), length }: { value: string; length: number } = $props();
</script>

<PinInput.Root
	bind:value
	class="group/pininput text-foreground flex items-center has-disabled:opacity-30"
	maxlength={length}
	pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
	pasteTransformer={(text: string) => {
		let newText: string = '';
		for (let index = 0; index < text.length; index++) {
			if (text.charAt(index) !== '-') {
				newText += text.charAt(index);
			}
		}

		return newText;
	}}
>
	{#snippet children({ cells })}
		<div class="flex">
			{#each cells.slice(0, length / 2) as cell, i (i)}
				{@render Cell(cell)}
			{/each}
		</div>

		<div class="flex w-10 items-center justify-center">
			<div class="h-1 w-3 rounded-full bg-border"></div>
		</div>

		<div class="flex">
			{#each cells.slice(length / 2, length) as cell, i (i)}
				{@render Cell(cell)}
			{/each}
		</div>
	{/snippet}
</PinInput.Root>

{#snippet Cell(cell: CellProps)}
	<PinInput.Cell
		{cell}
		class="focus-override border-foreground/20 text-foreground group-focus-within/pininput:border-foreground/40 group-hover/pininput:border-foreground/40 relative flex h-14 w-10 items-center justify-center border-y border-r text-[2rem] outline-0 transition-all duration-75 first:rounded-l-md first:border-l last:rounded-r-md data-active:outline-1 data-active:outline-white"
	>
		{#if cell.char !== null}
			<div>
				{cell.char}
			</div>
		{/if}
		{#if cell.hasFakeCaret}
			<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
				<div class="h-8 w-px bg-white"></div>
			</div>
		{/if}
	</PinInput.Cell>
{/snippet}
