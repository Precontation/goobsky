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
		console.error('Error on session object store put');
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
			console.log('Successfully loaded session!');
			resolve(request.result);
		};

		request.onerror = () => {
			console.error('Error on session object store get');
			reject(request.error);
		};
	});
};

export const removeSession = async (name: string): Promise<boolean> => {
	// Open a read and write db transaction
	const transaction = await createTransaction(['sessions'], 'readwrite');

	// Create an object store on the transaction
	const objectStore = transaction.objectStore('sessions');

	// Delete the object based on its name
	const request = objectStore.delete(name);

	// This is an awaitable async function, so we want to return a new promise
	return new Promise((resolve, reject) => {
		request.onsuccess = () => {
			console.log('Successfully deleted session!');
			resolve(true);
		};

		request.onerror = () => {
			console.error('Error on session object store delete');
			reject(false);
		};
	});
};
