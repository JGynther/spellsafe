import { type SearchIndex, query } from "../lib/db/search";
import { getNeighboursForID, type Cards, type Card } from "../lib/db";
import { useState, useEffect } from "react";

const SimilarCards: React.FC<{
  id: string;
  db: IDBDatabase;
  index: SearchIndex;
  setCard: (card: Card) => void;
}> = ({ id, db, index, setCard }) => {
  const [similar, setSimilar] = useState<Cards>([]);

  useEffect(() => {
    async function getSimilar() {
      const similar = await getNeighboursForID(id, db);
      setSimilar(query.index(index).where("id").isBatch(similar.neighbours));
    }
    getSimilar();
  }, [id, db, index]);

  if (similar.length === 0) return null;
  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold">Similar cards</h3>
      <div className="flex flex-wrap">
        {similar.map((card) => {
          return (
            <div
              key={card.id}
              className="flex flex-col p-3 justify-center items-center"
            >
              <img
                src={card.image_uris?.normal}
                className="rounded-[4.5%] w-40 border border-neutral-700"
                onClick={() => setCard(card)}
                role="button"
              />
              <span className="text-xs mt-2 font-semibold">{card.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarCards;
