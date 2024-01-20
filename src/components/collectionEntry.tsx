import { useState, useEffect } from "react";
import {
  getCollectionForCardID,
  updateCollectionForCardID,
  type CollectionEntry,
} from "../lib/db";

const CollectionEntry: React.FC<{ id: string; db: IDBDatabase }> = ({
  id,
  db,
}) => {
  const [entry, setEntry] = useState<CollectionEntry>();

  useEffect(() => {
    async function getEntry() {
      const entry = await getCollectionForCardID(id, db);
      setEntry(entry);
    }
    getEntry();
  }, [id, db]);

  const refreshEntry = async () => {
    const entry = await getCollectionForCardID(id, db);
    setEntry(entry);
  };

  if (!entry) return null;

  return (
    <div className="flex bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden divide-x divide-neutral-700 whitespace-nowrap max-w-min [&>*]:py-2 [&>*]:px-5">
      <h3 className="font-bold bg-neutral-700">Collection</h3>
      <span>Is in collection?</span>
      <span>
        {entry.in_collection.count + entry.in_collection.count_foil > 0
          ? "Yes"
          : "No"}
      </span>
      <span>Count</span>
      <span>{entry.in_collection.count}</span>
      <span>Foil {entry.in_collection.count_foil}</span>
      <button
        className="bg-green-700 bg-opacity-20"
        onClick={async () => {
          // FIXME: this is messy
          const updated = {
            ...entry,
            in_collection: {
              ...entry.in_collection,
              count: entry.in_collection.count + 1,
            },
          };
          await updateCollectionForCardID(updated, db);
          await refreshEntry();
        }}
      >
        Add one
      </button>
      <button
        disabled={entry.in_collection.count === 0}
        className="bg-red-700 bg-opacity-20 disabled:opacity-20"
        onClick={async () => {
          // FIXME: this is messy
          const updated = {
            ...entry,
            in_collection: {
              ...entry.in_collection,
              count: Math.max(entry.in_collection.count - 1, 0),
            },
          };
          await updateCollectionForCardID(updated, db);
          await refreshEntry();
        }}
      >
        Remove one
      </button>
    </div>
  );
};

export default CollectionEntry;
