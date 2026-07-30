import type { AtpSessionData } from '@atproto/api';
import { createTransaction } from './database';

export const saveSession = async (name: string, session: object) => {
	// Open a read/write db transaction, ready for adding the data
	const transaction = await createTransaction(['sessions'], 'readwrite');

	// Create an object store on the transaction
	const objectStore = transaction.objectStore('sessions');

	// Add our newItem object to the object store
	const request = objectStore.put(session, name);
	request.onsuccess = () => {
		console.log('Successfully saved session!');
	};
	request.onerror = () => {
		console.error('Error on object store put');
	};
};

export const loadSession = async (name: string): Promise<AtpSessionData | undefined> => {
	// Open a read only db transaction
	const transaction = await createTransaction(['sessions'], 'readonly');

	// Create an object store on the transaction
	const objectStore = transaction.objectStore('sessions');

	// Request the object based on its name
	const request = objectStore.get(name);

	// This is an awaitable async function, so we want to return a new promise
	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			console.log('Successfully saved session!');
			resolve(request.result);
		};

		request.onerror = () => {
			console.error('Error on object store get');
			reject(request.error);
		};
	});
};
