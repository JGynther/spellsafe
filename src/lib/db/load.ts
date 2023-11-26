const loadOracle = async (db: IDBDatabase) => {
  // Lazy load oracle.json for faster load times after initial setup
  const oracleData = await import("../../../oracle.json");
  const oracle = oracleData.default as Record<string, unknown>[];

  return new Promise<void>((resolve) => {
    const start = Date.now();
    const transaction = db.transaction("cards", "readwrite");
    const store = transaction.objectStore("cards");
    oracle.forEach((card) => store.put(card));
    transaction.oncomplete = () =>
      resolve(
        console.log(`Loaded ${oracle.length} cards in ${Date.now() - start}ms`)
      );
  });
};

export { loadOracle };
