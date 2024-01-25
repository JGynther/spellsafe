import { getCollection } from "../lib/db";

const Export: React.FC<{ db: IDBDatabase }> = ({ db }) => {
  return (
    <div className="mt-10">
      <button
        className="bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700 rounded-lg px-3 py-1"
        onClick={async () => {
          const collection = await getCollection(db);

          const partial = collection.filter(
            (entry) =>
              entry.in_collection.count || entry.in_collection.count_foil
          );

          const rows = partial.map((entry) =>
            [
              entry.id,
              entry.in_collection.count,
              entry.in_collection.count_foil,
            ].join(",")
          );

          const encoded = encodeURI(
            "data:text/csv;charset=utf-8," +
              "id,count,count_foil\r\n" +
              rows.join("\r\n")
          );

          window.open(encoded, "_blank");
        }}
      >
        Export collection
      </button>
    </div>
  );
};

export default Export;
