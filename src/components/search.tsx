import { useDatabase, type Card } from "../lib/db";
import { useState } from "react";

import CardView from "./card";
import SimilarCards from "./similar";
import CollectionEntry from "./collectionEntry";

const Search: React.FC = () => {
  const db = useDatabase();
  const [autoComplete, setAutoComplete] = useState<
    { name: string; id: string }[]
  >([]);
  const [result, setResult] = useState<Card>();

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search here... e.g. Black Lotus"
        className={`bg-neutral-800 outline-none px-5 py-3 text-lg border border-neutral-700 ${
          autoComplete.length > 0 ? "rounded-t-lg" : "rounded-lg"
        }`}
        onChange={async (event) => {
          const results = db.searchCards(event.target.value);
          setAutoComplete(results);
        }}
      />

      {autoComplete.length > 0 && (
        <div className="bg-neutral-800 divide-y divide-neutral-700 border-neutral-700 border-x border-b rounded-b-lg overflow-hidden">
          {autoComplete.map((card) => {
            return (
              <div
                key={card.id}
                className="px-5 py-3 hover:bg-neutral-700"
                onClick={async () => {
                  setResult(await db.getCard(card.id));
                  setAutoComplete([]);
                }}
                role="button"
              >
                {card.name}
              </div>
            );
          })}
        </div>
      )}

      {result && (
        <>
          <CardView card={result} />
          <CollectionEntry id={result.id} />
          <SimilarCards id={result.id} setCard={setResult} />
        </>
      )}
    </div>
  );
};

export default Search;
