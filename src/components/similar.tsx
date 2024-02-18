import { useDatabase, type Cards, type Card } from "../lib/db";
import { useState, useEffect } from "react";

const SimilarCards: React.FC<{
  id: string;
  setCard: (card: Card) => void;
}> = ({ id, setCard }) => {
  const [similar, setSimilar] = useState<Cards>([]);
  const db = useDatabase();

  useEffect(() => {
    async function getSimilar() {
      const similar = await db.getNeighbours(id);
      setSimilar(await db.batchGetCards(similar.neighbours));
    }
    getSimilar();
  }, [id]);

  if (similar.length === 0) return null;
  return (
    <div className="mt-10">
      <h3 className="text-lg font-bold">Similar cards</h3>
      <div className="flex flex-wrap">
        {similar.map((card) => {
          // FIXME: for some reason a neighbour might not exist?
          // Temporarily just ignore an undefined card
          if (!card) return null;

          // For displaying multifaced cards properly
          const image = card.card_faces
            ? card.card_faces[0]?.image_uris?.normal
            : card.image_uris?.normal;

          return (
            <div
              key={card.id}
              className="flex flex-col p-3 justify-center items-center"
            >
              <img
                src={image}
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
