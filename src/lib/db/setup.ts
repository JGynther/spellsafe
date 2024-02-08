enum Stores {
  Cards = "cards",
  Collection = "collection",
  Neighbours = "neighbours",
}

const connect = (dbName: string): Promise<IDBDatabase> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
      db = request.result;

      Object.keys(Stores).forEach((store) => {
        if (db.objectStoreNames.contains(store)) return;
        db.createObjectStore(store, { keyPath: "id" });
      });
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () => {
      throw Error(request.error?.message);
    };
  });
};

const isSetup = (db: IDBDatabase): Promise<boolean> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(Stores.Cards, "readonly");
    const store = transaction.objectStore(Stores.Cards);
    const request = store.count();
    request.onsuccess = () => resolve(!!request.result);
  });
};

export { connect, isSetup, Stores };
