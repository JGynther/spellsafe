import { Card, Cards, getCards } from "./index";

type SearchIndex = (Card & { name_lowercase: string })[];

const createSearchIndex = async (db: IDBDatabase): Promise<SearchIndex> => {
  let cards = await getCards(db);
  // FIXME: this also removes some valid cards, seemingly double-sided and spit cards
  cards = cards.filter((card) => card.oracle_text);
  return cards.map((card) => {
    return {
      name_lowercase: card.name.toLowerCase(), // For faster comparisons
      ...card,
    };
  });
};

type FIELDS = "name" | "id" | "name_lowercase";

const matchFieldExact = (field: FIELDS, value: string, index: SearchIndex) => {
  const card = index.find((card) => card[field] === value);
  if (!card) throw new Error("Card not found");
  return card;
};

const matchStringFieldFuzzy = (
  field: FIELDS,
  value: string,
  index: SearchIndex,
  lowercase = true,
  n = 10
) => {
  if (!value) return []; // Empty string would still return results
  if (lowercase) value = value.toLowerCase();
  return index.filter((card) => card[field]?.includes(value)).slice(0, n);
};

const matchBatchStringsExact = (
  field: FIELDS,
  values: string[],
  index: SearchIndex
) => {
  return index.filter((card) => values.includes(card[field]));
};

type Query = {
  index: (index: SearchIndex) => {
    where: (field: FIELDS) => {
      is: (value: string) => Card;
      isLike: (value: string) => Cards;
      isBatch: (values: string[]) => Cards;
    };
  };
};

// const result = query.index(INDEX).where(FIELD).is(VALUE);
const query: Query = {
  index: (index) => {
    return {
      where: (field) => {
        return {
          is: (value) => matchFieldExact(field, value, index),
          isLike: (value) => matchStringFieldFuzzy(field, value, index),
          isBatch: (values) => matchBatchStringsExact(field, values, index),
        };
      },
    };
  },
};

export { createSearchIndex, query };
export type { SearchIndex };
