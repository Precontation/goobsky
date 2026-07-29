<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { bskySession } from '$lib/api/bskyApi';
	import CustomAlertDialog from '$lib/components/ui/CustomAlertDialog.svelte';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import PinInput from '$lib/components/ui/PinInput.svelte';
	import { XRPCError } from '@atproto/api';
	import { Button } from 'bits-ui';
	let identifier = $state<string>();
	let password = $state<string>();
	let errorMessage = $state<string>();

	const handleLoginBluesky = async (e?: SubmitEvent) => {
		e?.preventDefault();
		if (!identifier || !password) return;
		isLoading = true;
		errorMessage = undefined;

		let authValue;
		if (authFactorValue) {
			authValue =
				authFactorValue.slice(0, authFactorLength / 2) +
				'-' +
				authFactorValue.slice(authFactorLength / 2, authFactorLength);
		}

		try {
			const response = await bskySession.login({
				identifier: identifier,
				password: password,
				authFactorToken: authValue
			});

			if (response.success) {
				alert('success!');
				invalidateAll();
			}
		} catch (error) {
			authFactorValue = '';
			if (error instanceof XRPCError) {
				if (error.status == 401 && error.error === 'AuthFactorTokenRequired') {
					authFactorAlertOpen = true;
					return;
				}

				errorMessage = error.message;
			} else {
				errorMessage = 'An error occurred';
			}
		} finally {
			isLoading = false;
		}
	};

	let authFactorAlertOpen = $state(false);
	let isLoading = $state(false);
	let authFactorValue = $state<string>('');

	const authFactorLength = 10;
</script>

<CustomAlertDialog
	bind:open={authFactorAlertOpen}
	confirmable={authFactorValue.length === authFactorLength}
	onConfirm={() => {
		authFactorAlertOpen = false;
		handleLoginBluesky();
		// TODO: if fails, keep open
	}}
>
	{#snippet title()}
		<h2>2FA Confirmation</h2>
	{/snippet}
	{#snippet description()}
		<span>Check your email for a confirmation code!</span>
	{/snippet}
	<PinInput bind:value={authFactorValue} length={authFactorLength} />
</CustomAlertDialog>

<div class="flex flex-col gap-2 pl-8">
	<h2>Bluesky</h2>
	<form onsubmit={handleLoginBluesky} class="flex w-fit flex-col gap-2">
		<input type="text" placeholder="Username or email" bind:value={identifier} />
		<input type="password" placeholder="Password" bind:value={password} />
		<Button.Root
			class="flex w-full cursor-pointer justify-center bg-[#0f73ff] p-4 font-bold"
			type="submit"
		>
			{#if isLoading}
				<LoadingSpinner />
			{:else}
				Log in with Bluesky
			{/if}</Button.Root
		>

		{#if errorMessage}
			<span class="text-danger">{errorMessage}</span>
		{/if}
	</form>
</div>

<style>
	input {
		border: 1px solid var(--color-border);
		padding: 1rem;
	}
</style>
