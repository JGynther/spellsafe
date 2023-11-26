enum Stores {
  Cards = "cards",
  Collection = "collection",
}

const connect = (): Promise<IDBDatabase> => {
  return new Promise((resolve) => {
    let db: IDBDatabase;
    const request = indexedDB.open("CardDatabase", 1);

    request.onupgradeneeded = () => {
      db = request.result;

      if (!db.objectStoreNames.contains(Stores.Cards)) {
        db.createObjectStore(Stores.Cards, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(Stores.Collection)) {
        db.createObjectStore(Stores.Collection, { keyPath: "id" });
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

const isNotSetup = (db: IDBDatabase): Promise<boolean> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(Stores.Cards, "readonly");
    const store = transaction.objectStore(Stores.Cards);
    const request = store.count();
    request.onsuccess = () => resolve(request.result ? false : true);
  });
};

export { connect, isNotSetup, Stores };
