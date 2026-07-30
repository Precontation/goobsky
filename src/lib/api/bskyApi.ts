import { loadSession, saveSession } from '$lib/storage/sessions';
import { Agent, CredentialSession } from '@atproto/api';

const sessionName = 'bsky';

export const bskySession = new CredentialSession(
	new URL('https://bsky.social'),
	globalThis.fetch,
	async (evt, session) => {
		if ((evt === 'create' || evt === 'update') && session) {
			await saveSession(sessionName, session);
		}
	}
);

export const bskyAgent = new Agent(bskySession);

// ----- HELPERS -----
export const restoreBskySession = async () => {
	const restoredSession = await loadSession(sessionName);

	if (!restoredSession) return;

	const response = await bskySession.resumeSession(restoredSession);
	if (response.success) {
		console.log('Successfully resumed session!');
	} else {
		console.warn('Failed to load session!');
	}
};
