export enum Stores {
  Cards = "cards",
}

export const connect = (): Promise<IDBDatabase> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open("CardDatabase", 1);

    request.onupgradeneeded = () => {
      db = request.result;

      if (!db.objectStoreNames.contains(Stores.Cards)) {
        db.createObjectStore(Stores.Cards, { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => {
      throw Error(request.error?.message);
    };
  });
};

export const write = (
  item: Record<string, unknown>,
  db: IDBDatabase
): Promise<boolean> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(Stores.Cards, "readwrite");
    const store = transaction.objectStore(Stores.Cards);
    const request = store.put(item);

    request.onerror = () => {
      throw Error(request.error?.message);
    };

    resolve(true);
  });
};

export const arbitaryDBRequest = (
  handler: (store: IDBObjectStore) => void,
  db: IDBDatabase,
  store = Stores.Cards,
  mode = "readonly" as IDBTransactionMode
) => {
  return new Promise((resolve) => {
    const transaction = db.transaction(store, mode);
    const objectStore = transaction.objectStore(store);
    resolve(handler(objectStore));
  });
};
