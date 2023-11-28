import { useState, useEffect } from "react";
import { connect, isNotSetup } from "./lib/db/setup";
import { loadOracle } from "./lib/db/load";
import { getCards } from "./lib/db";
import type { Card, Cards } from "./lib/db";

function App() {
  const [database, setDB] = useState<IDBDatabase>();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function setup() {
      const db = await connect();
      if (await isNotSetup(db)) await loadOracle(db);
      setDB(db);
      setIsReady(true);
    }
    setup();
  }, []);

  if (isReady && database) {
    return (
      <div className="min-h-screen bg-[#e5decf] p-5">
        <div className="font-semibold text-2xl">🗝️ SpellSafe</div>
        <Cards db={database} />
      </div>
    );
  }
}

const Cards: React.FC<{ db: IDBDatabase }> = ({ db }) => {
  const [cards, setCards] = useState<Cards>([]);

  useEffect(() => {
    async function _getCards() {
      const cards = await getCards(db);
      setCards(cards.slice(0, 100));
    }
    _getCards();
  }, [db]);

  return (
    <div className="border">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
};

const Card: React.FC<{ card: Card }> = ({ card }) => {
  return (
    <div>
      <img src={card?.image_uris?.small} />
      {card.name} {card.prices.eur} / {card.prices.eur_foil} €
    </div>
  );
};

export default App;
