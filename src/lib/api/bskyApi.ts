import { loadSession, removeSession, saveSession } from '$lib/storage/sessions';
import { Agent, CredentialSession } from '@atproto/api';

const sessionName = 'bsky';

export const bskySession = new CredentialSession(
	new URL('https://bsky.social'),
	globalThis.fetch,
	async (evt, session) => {
		if ((evt === 'create' || evt === 'update') && session) {
			restorePromise = Promise.resolve(true);
			await saveSession(sessionName, session);
		}
	}
);

export const bskyAgent = new Agent(bskySession);

// ----- HELPERS -----
let restorePromise: Promise<boolean> | undefined;
export const restoreBskySession = () => {
	// If the promise already exists, return it
	if (restorePromise) return restorePromise;

	restorePromise = (async () => {
		const restoredSession = await loadSession(sessionName);

		if (!restoredSession) return false;

		const response = await bskySession.resumeSession(restoredSession);

		if (!response.success) {
			throw new Error('Failed to restore Bluesky session');
		}

		return true;
	})();

	return restorePromise;
};

export const signOutBskySession = async (): Promise<boolean> => {
	await bskySession.logout();
	const deletedSession = await removeSession(sessionName);
	restorePromise = undefined;
	return deletedSession;
};
