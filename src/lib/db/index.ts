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

const genericGetByID = <T>(
  id: string,
  store: Stores,
  db: IDBDatabase
): Promise<T> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(store, "readonly");
    const _store = transaction.objectStore(store);
    const request = _store.get(id);
    request.onsuccess = () => resolve(request.result);
  });
};

const genericUpdateByID = <T>(
  valueWithID: T extends { id: string } ? T : never,
  store: Stores,
  db: IDBDatabase
): Promise<void> => {
  return new Promise((resolve) => {
    const transaction = db.transaction(store, "readwrite");
    const _store = transaction.objectStore(store);
    const request = _store.put(valueWithID);
    request.onsuccess = () => resolve();
  });
};

type Neighbours = {
  id: string;
  neighbours: string[];
};

const getNeighboursForID = (id: string, db: IDBDatabase) => {
  return genericGetByID<Neighbours>(id, Stores.Neighbours, db);
};

type CollectionEntry = {
  id: string;
  in_collection: {
    count: number;
    count_foil: number;
  };
  in_deck: {
    deck_ids: string[];
  };
  trading: boolean;
};

const getCollectionForCardID = (id: string, db: IDBDatabase) => {
  return genericGetByID<CollectionEntry>(id, Stores.Collection, db);
};

const updateCollectionForCardID = (
  updatedEntry: CollectionEntry,
  db: IDBDatabase
) => {
  return genericUpdateByID<CollectionEntry>(
    updatedEntry,
    Stores.Collection,
    db
  );
};

export {
  getCards,
  getNeighboursForID,
  getCollectionForCardID,
  updateCollectionForCardID,
  Stores,
};

export type { Card, Cards, CollectionEntry };
