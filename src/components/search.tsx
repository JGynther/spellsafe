import { type SearchIndex, query } from "../lib/db/search";
import type { Card, Cards } from "../lib/db";
import { useState } from "react";

import CardView from "./card";
import SimilarCards from "./similar";

const Search: React.FC<{ index: SearchIndex; db: IDBDatabase }> = ({
  index,
  db,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoComplete, setAutoComplete] = useState<Cards>([]);
  const [result, setResult] = useState<Card>();

  return (
    <div className="flex flex-col">
      <input
        type="text"
        placeholder="Black Lotus"
        className="bg-neutral-800 outline-none p-2 rounded-t-lg border-b border-neutral-700"
        value={searchQuery}
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setAutoComplete(
            query
              .index(index)
              .where("name_lowercase")
              .isLike(event.target.value)
          );
        }}
      />

      {autoComplete.length > 0 && (
        <div className="bg-neutral-800 divide-y divide-neutral-700 rounded-b-lg mb-5 overflow-hidden">
          {autoComplete.map((card) => {
            return (
              <div
                key={card.id}
                className="p-2 hover:bg-neutral-700"
                onClick={() => {
                  setSearchQuery(card.name!);
                  setResult(query.index(index).where("name").is(card.name!));
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

      <button
        className="bg-black text-white mt-5 rounded-lg py-2"
        onClick={() => {
          setResult(query.index(index).where("name").is(searchQuery));
        }}
      >
        Search
      </button>

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
