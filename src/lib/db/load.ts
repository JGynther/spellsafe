import oracleData from "../../../oracle.json";

const oracle = oracleData as Record<string, unknown>[];

export const loadOracle = (db: IDBDatabase) => {
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
