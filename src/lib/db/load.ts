import { Stores } from "./setup";

const loadOracle = async (db: IDBDatabase) => {
  // Lazy load oracle.json for faster load times after initial setup
  const oracleData = await import("../../../oracle.json");
  const oracle = oracleData.default as Record<string, unknown>[];

  return new Promise<void>((resolve) => {
    const start = Date.now();

    const transaction = db.transaction(Stores.Cards, "readwrite");
    const store = transaction.objectStore(Stores.Cards);
    oracle.forEach((card) => store.put(card));

    transaction.oncomplete = () =>
      resolve(
        console.log(`Loaded ${oracle.length} cards in ${Date.now() - start}ms`)
      );
  });
};

const loadNeighbours = async (db: IDBDatabase) => {
  const neighbourData = await import("../../../neighbours.json");
  const neighbours = neighbourData.default as Record<string, unknown>[];

  return new Promise<void>((resolve) => {
    const start = Date.now();

    const transaction = db.transaction(Stores.Neighbours, "readwrite");
    const store = transaction.objectStore(Stores.Neighbours);
    neighbours.forEach((card) => store.put(card));

    transaction.oncomplete = () =>
      resolve(
        console.log(`Loaded ${neighbours.length} NN in ${Date.now() - start}ms`)
      );
  });
};

const loadDatabase = async (db: IDBDatabase) => {
  await loadOracle(db);
  await loadNeighbours(db);
};

export { loadDatabase };
