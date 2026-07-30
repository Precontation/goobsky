import { IDB_DATABASE_NAME } from '$lib/config';

let dbPromise: Promise<IDBDatabase> | undefined;
export const initializeDatabase = () => {
	// If the promise already exists, return it
	if (dbPromise) return dbPromise;

	dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
		// Let us open our database
		const request = window.indexedDB.open(IDB_DATABASE_NAME, 1);

		request.onerror = (event) => {
			console.error('Error when trying to open indexedDB db: ', event);
			dbPromise = undefined;
			reject(request.error);
		};
		request.onsuccess = () => {
			resolve(request.result);
		};
		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains('sessions')) {
				// Create another object store called "sessions" if it doesn't exist yet.
				db.createObjectStore('sessions');
			}
		};
	});

	return dbPromise;
};

export const createTransaction = async (
	storeNames: string | Iterable<string>,
	mode?: IDBTransactionMode,
	options?: IDBTransactionOptions
) => {
	const db = await initializeDatabase();
	return db.transaction(storeNames, mode, options);
};
