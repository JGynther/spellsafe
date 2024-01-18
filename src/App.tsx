import { useState, useEffect } from "react";

import { connect, isNotSetup } from "./lib/db/setup";
import { loadOracle } from "./lib/db/load";
import { createSearchIndex } from "./lib/db/search";

import type { SearchIndex } from "./lib/db/search";

import Search from "./components/search";

function App() {
  const [database, setDB] = useState<IDBDatabase>();
  const [searchIndex, setSearchIndex] = useState<SearchIndex>();
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function setup() {
      const db = await connect();

      if (await isNotSetup(db)) await loadOracle(db);

      const index = await createSearchIndex(db);

      setDB(db);
      setSearchIndex(index);
      setIsReady(true);
    }
    setup();
  }, []);

  if (isReady && database && searchIndex) {
    return (
      <div className="min-h-screen bg-[#e5decf] p-5">
        <div className="font-semibold text-2xl">🗝️ SpellSafe</div>
        <Search index={searchIndex} />
      </div>
    );
  }
}

export default App;
