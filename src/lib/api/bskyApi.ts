import { saveSession } from '$lib/storage/sessions';
import { Agent, CredentialSession } from '@atproto/api';

export const bskySession = new CredentialSession(
	new URL('https://bsky.social'),
	globalThis.fetch,
	async (evt, session) => {
		if (!session) return;
		await saveSession('bsky', session);
	}
);

export const bskyAgent = new Agent(bskySession);
