import { createTransaction } from './database';

export const saveSession = async (name: string, session: object) => {
	// open a read/write db transaction, ready for adding the data
	const transaction = await createTransaction(['sessions'], 'readwrite');

	// create an object store on the transaction
	const objectStore = transaction.objectStore('sessions');

	// add our newItem object to the object store
	const request = objectStore.put(session, name);
	request.onsuccess = () => {
		console.log('Successfully saved session!');
	};
	request.onerror = () => {
		console.error('Error on object store put');
	};
};
