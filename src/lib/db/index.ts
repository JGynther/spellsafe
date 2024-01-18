import { Stores } from "./setup";

type Card = {
  id: string;
  name: string;
  image_uris?: { small: string; normal: string; large: string };
  prices: { eur: string; eur_foil: string };
  oracle_text?: string;
  type_line: string;
  mana_cost: string;
  power?: string;
  toughness?: string;
};

type Cards = Card[];

const getCards = (db: IDBDatabase): Promise<Cards> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(Stores.Cards, "readonly");
    const store = transaction.objectStore(Stores.Cards);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
};

type Neighbours = {
  id: string;
  neighbours: string[];
};

const getNeighboursForID = (
  id: string,
  db: IDBDatabase
): Promise<Neighbours> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(Stores.Neighbours, "readonly");
    const store = transaction.objectStore(Stores.Neighbours);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
  });
};

export { getCards, getNeighboursForID, Stores };
export type { Card, Cards };
