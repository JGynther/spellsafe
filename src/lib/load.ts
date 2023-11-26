import oracleData from "../../oracle.json";
import { write } from "./db";

const oracle = oracleData as Record<string, unknown>[];

export const loadTestFile = async (db: IDBDatabase) => {
  const start = Date.now();
  for (const card of oracle) {
    await write(card, db);
    console.log("wrote");
  }
  console.log(`Loaded ${oracle.length} cards in ${Date.now() - start}ms`);
};
