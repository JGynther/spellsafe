import { type SearchIndex, query } from "../lib/db/search";
import type { Card, Cards } from "../lib/db";
import { useState } from "react";

import CardView from "./card";
import SimilarCards from "./similar";

const Search: React.FC<{ index: SearchIndex; db: IDBDatabase }> = ({
  index,
  db,
}) => {
  const [autoComplete, setAutoComplete] = useState<Cards>([]);
  const [result, setResult] = useState<Card>();

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Search here... e.g. Black Lotus"
        className={`bg-neutral-800 outline-none px-5 py-3 text-lg border border-neutral-700 ${
          autoComplete.length > 0 ? "rounded-t-lg" : "rounded-lg"
        }`}
        onChange={(event) => {
          setAutoComplete(
            query
              .index(index)
              .where("name_lowercase")
              .isLike(event.target.value)
          );
        }}
      />

      {autoComplete.length > 0 && (
        <div className="bg-neutral-800 divide-y divide-neutral-700 border-neutral-700 border-x border-b rounded-b-lg overflow-hidden">
          {autoComplete.map((card) => {
            return (
              <div
                key={card.id}
                className="px-5 py-3 hover:bg-neutral-700"
                onClick={() => {
                  setResult(query.index(index).where("name").is(card.name));
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
          <SimilarCards
            id={result.id}
            index={index}
            db={db}
            setCard={setResult}
          />
        </>
      )}
    </div>
  );
};

export default Search;
