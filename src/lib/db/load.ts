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

const bootstrapCollection = async (db: IDBDatabase) => {
  const oracleData = await import("../../../oracle.json");
  const oracle = oracleData.default as Record<string, unknown>[];
  const collection = oracle.map((card) => {
    return {
      id: card.id,
      in_collection: {
        count: 0,
        count_foil: 0,
      },
      in_deck: {
        deck_ids: [],
      },
      trading: false,
    };
  });

  return new Promise<void>((resolve) => {
    const transaction = db.transaction(Stores.Collection, "readwrite");
    const store = transaction.objectStore(Stores.Collection);
    collection.forEach((card) => store.put(card));
    transaction.oncomplete = () => resolve();
  });
};

const loadDatabase = async (db: IDBDatabase) => {
  await loadOracle(db);
  await loadNeighbours(db);
  await bootstrapCollection(db);
};

export { loadDatabase };
