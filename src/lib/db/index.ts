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

export { getCards };
export type { Card, Cards };
