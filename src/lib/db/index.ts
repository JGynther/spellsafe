import { Stores, connect, isSetup } from "./setup";
import { loadDatabase } from "./load";
import { useContext, createContext, type Context } from "react";

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

type Neighbours = {
  id: string;
  neighbours: string[];
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

type Collection = CollectionEntry[];

class IDBAbstraction {
  private _db: IDBDatabase;
  private _nameIndex: Map<string, string>;
  private _idIndex: Map<string, string>;
  isSetup: boolean = false;

  private constructor(db: IDBDatabase) {
    this._db = db;
    this._nameIndex = new Map();
    this._idIndex = new Map();
  }

  private getAll<T>(store: Stores): Promise<T> {
    return new Promise((resolve) => {
      const transaction = this._db.transaction(store, "readonly");
      const _store = transaction.objectStore(store);
      const request = _store.getAll();
      request.onsuccess = () => resolve(request.result as T);
    });
  }

  private getId<T>(id: string, store: Stores): Promise<T> {
    return new Promise((resolve) => {
      const transaction = this._db.transaction(store, "readonly");
      const _store = transaction.objectStore(store);
      const request = _store.get(id);
      request.onsuccess = () => resolve(request.result);
    });
  }

  private async getBatchId<T>(ids: string[], store: Stores): Promise<T[]> {
    return await Promise.all(
      ids.map(async (id) => await this.getId<T>(id, store))
    );
  }

  private updateId<T>(
    valueWithId: T extends { id: string } ? T : never,
    store: Stores
  ): Promise<void> {
    return new Promise((resolve) => {
      const transaction = this._db.transaction(store, "readwrite");
      const _store = transaction.objectStore(store);
      const request = _store.put(valueWithId);
      request.onsuccess = () => resolve();
    });
  }

  private async createSearchIndexes() {
    const cards = await this.getCards();
    cards.forEach((card) => {
      this._nameIndex.set(card.name, card.id);
      this._idIndex.set(card.id, card.name);
    });
  }

  /**
   * Static Async Factory for a new IDBAbstract.
   */
  static async initNewConnection(dbName: string): Promise<IDBAbstraction> {
    const connection = await connect(dbName);
    const db = new IDBAbstraction(connection);

    db.isSetup = await isSetup(db._db);
    await db.createSearchIndexes();

    return db;
  }

  async initialLoad() {
    if (this.isSetup) return;
    this.isSetup = true;
    return await loadDatabase(this._db);
  }

  async getCards() {
    return await this.getAll<Cards>(Stores.Cards);
  }

  async getCard(id: string) {
    return await this.getId<Card>(id, Stores.Cards);
  }

  async batchGetCards(ids: string[]) {
    return await this.getBatchId<Card>(ids, Stores.Cards);
  }

  async getNeighbours(id: string) {
    return await this.getId<Neighbours>(id, Stores.Neighbours);
  }

  async getCollection() {
    return await this.getAll<Collection>(Stores.Collection);
  }

  async getCollectionEntry(id: string) {
    return await this.getId<CollectionEntry>(id, Stores.Collection);
  }

  async updateCollectionEntry(entry: CollectionEntry) {
    return await this.updateId(entry, Stores.Collection);
  }

  findCard(name: string) {
    return this._nameIndex.get(name);
  }

  searchCards(query: string) {
    if (!query) return [];

    const names: { name: string; id: string }[] = [];

    this._idIndex.forEach((v, k) => {
      if (v.toLowerCase().includes(query.toLowerCase()))
        names.push({ name: v, id: k });
    });

    return names;
  }

  idToName(id: string) {
    return this._idIndex.get(id);
  }
}

// @ts-ignore
const databaseContext: Context<IDBAbstraction> = createContext(); // Skipping default value because DB needs browser context...
const useDatabase = () => useContext(databaseContext);

export { IDBAbstraction, databaseContext, useDatabase };
export type { Card, Cards, CollectionEntry, Collection };
