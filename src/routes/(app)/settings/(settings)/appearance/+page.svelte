<script lang="ts">
	import FullPageSpinner from '$lib/components/ui/FullPageSpinner.svelte';
	import SettingsRadioGroup from '$lib/components/ui/SettingsRadioGroup.svelte';
	import { onMount } from 'svelte';

	let theme = $state('dark');
	let roundness = $state('square');
	let postPadding = $state('normal');
	let font = $state('theme');
	let fontSize = $state('normal');
	let loading = $state(true);

	// Load stored user settings when the component mounts in the browser
	onMount(() => {
		theme = localStorage.getItem('theme') ?? 'dark';
		roundness = localStorage.getItem('roundness') ?? 'square';
		postPadding = localStorage.getItem('postPadding') ?? 'normal';
		font = localStorage.getItem('font') ?? 'theme';
		fontSize = localStorage.getItem('fontSize') ?? 'normal';
		loading = false;
	});

	$effect(() => {
		if (loading) return;
		localStorage.setItem('theme', theme);

		const themeToSet =
			theme === 'system'
				? window.matchMedia('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light'
				: theme;

		document.documentElement.dataset.theme = themeToSet;
	});

	$effect(() => {
		if (loading) return;
		localStorage.setItem('roundness', roundness);

		document.documentElement.dataset.roundness = roundness;
	});

	$effect(() => {
		if (loading) return;
		localStorage.setItem('postPadding', postPadding);

		document.documentElement.dataset.postPadding = postPadding;
	});

	$effect(() => {
		if (loading) return;
		localStorage.setItem('font', font);

		document.documentElement.dataset.font = font;
	});

	$effect(() => {
		if (loading) return;
		localStorage.setItem('fontSize', fontSize);

		document.documentElement.dataset.fontSize = fontSize;
	});
</script>

{#if loading}
	<FullPageSpinner />
{:else}
	<div class="mb-4 flex flex-col gap-2 border-b border-border pb-4 pl-8">
		<h2>Theme</h2>
		<SettingsRadioGroup
			items={[
				{ name: 'Light', value: 'light' },
				{ name: 'Dark', value: 'dark' },
				{ name: 'System', value: 'system' }
			]}
			bind:value={theme}
			name="theme"
		/>
	</div>

	<!-- TODO: color scheme picker -->
	<!-- <div class="mb-4 flex flex-col gap-2 border-b border-border pb-4 pl-8">
		<h2>Color scheme</h2>
		<input type="color" />
	</div> -->

	<div class="mb-4 flex flex-col gap-2 border-b border-border pb-4 pl-8">
		<h2>Roundness</h2>
		<SettingsRadioGroup
			items={[
				{ name: 'Square', value: 'square' },
				{ name: 'Round', value: 'round' },
				{ name: 'Rounder', value: 'rounder' },
				{ name: 'Roundest', value: 'roundest' },
				{ name: "...don't", value: 'dont' }
			]}
			bind:value={roundness}
			name="roundness"
		/>
	</div>

	<div class="mb-4 flex flex-col gap-2 border-b border-border pb-4 pl-8">
		<div>
			<h2>Post Padding</h2>
			<span>The spacing around the actual post</span>
		</div>
		<SettingsRadioGroup
			items={[
				{ name: 'Small', value: 'small' },
				{ name: 'Normal', value: 'normal' },
				{ name: 'Large', value: 'large' }
			]}
			bind:value={postPadding}
			name="post-padding"
		/>
	</div>

	<div class="mb-4 flex flex-col gap-2 pl-8">
		<h2>Font</h2>
		<SettingsRadioGroup
			items={[
				{ name: 'System', value: 'system' },
				{ name: 'Theme', value: 'theme' }
			]}
			bind:value={font}
			name="font"
		/>
	</div>

	<div class="mb-4 flex flex-col gap-2 pl-8">
		<h2>Font Size</h2>
		<SettingsRadioGroup
			items={[
				{ name: 'Small', value: 'small', class: 'text-xs' },
				{ name: 'Normal', value: 'normal', class: 'text-sm' },
				{ name: 'Large', value: 'large', class: 'text-xl' }
			]}
			bind:value={fontSize}
			name="font-size"
		/>
	</div>
{/if}
