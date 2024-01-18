import type { Card } from "../lib/db";

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div className="flex py-5 space-x-5">
      <img
        src={card.image_uris?.normal}
        className="rounded-[3.5%] overflow-hidden max-w-xs"
      />
      <div className="flex flex-col space-y-5 max-w-md">
        <span className="text-xl font-bold">
          {card.name} {card.mana_cost}
        </span>
        <span>{card.type_line}</span>
        <div className="space-y-2 max-w-sm">
          {card.oracle_text?.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        {card.power && card.toughness && (
          <span>
            {card.power} / {card.toughness}
          </span>
        )}
        <div>
          <div className="flex rounded-lg bg-black text-white divide-x-2 border-2 text-center whitespace-nowrap max-w-min [&>*]:py-2 [&>*]:px-3">
            <span>EUR</span>
            <span>{card.prices.eur || "?"}</span>
            <span>FOIL {card.prices.eur_foil || "?"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardView;
