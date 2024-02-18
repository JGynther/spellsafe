import type { Card } from "../lib/db";

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  // For displaying multifaced cards properly
  const text = card.card_faces
    ? card.card_faces[0].oracle_text + "\n--\n" + card.card_faces[1].oracle_text
    : card.oracle_text!;

  const image = card.card_faces
    ? card.card_faces[0]?.image_uris?.normal
    : card.image_uris?.normal;

  return (
    <div className="flex py-5 space-x-8 mt-5">
      <div className="max-w-xs">
        <img src={image} className="rounded-[4.5%] border border-neutral-700" />
      </div>
      <div className="flex flex-col space-y-5 max-w-md">
        <span className="text-xl font-bold">
          {card.name} {card.mana_cost}
        </span>
        <span>{card.type_line}</span>
        <div className="space-y-2 max-w-sm">
          {text.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {card.power && card.toughness && (
          <span>
            {card.power} / {card.toughness}
          </span>
        )}
        <div className="flex rounded-lg bg-neutral-800 text-white divide-x divide-neutral-700 border border-neutral-700 text-center whitespace-nowrap max-w-min [&>*]:py-2 [&>*]:px-5">
          <span>EUR</span>
          <span>{card.prices.eur || "?"}</span>
          <span>FOIL {card.prices.eur_foil || "?"}</span>
        </div>
        <div className="text-sm">
          <a href={card.scryfall_uri} target="_blank" rel="noreferrer">
            Open in Scryfall ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default CardView;
