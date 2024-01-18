import { type SearchIndex, query } from "../lib/db/search";
import CardView from "../components/card";
import type { Card, Cards } from "../lib/db";
import { useState } from "react";

const Search: React.FC<{ index: SearchIndex }> = ({ index }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoComplete, setAutoComplete] = useState<Cards>([]);
  const [result, setResult] = useState<Card>();

  return (
    <div className="flex flex-col p-5 mt-10">
      <input
        type="text"
        placeholder="Black Lotus"
        className="border-2 outline-none p-2 rounded-t-lg"
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
        <div className="bg-white divide-y-2 border-x-2 rounded-b-lg mb-5">
          {autoComplete.map((card) => {
            return (
              <div
                key={card.id}
                className="p-2 hover:bg-neutral-100"
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

      {result && <CardView card={result} />}
    </div>
  );
};

export default Search;
