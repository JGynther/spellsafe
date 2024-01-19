import { useState, useEffect } from "react";

import { connect, isNotSetup } from "./lib/db/setup";
import { loadDatabase } from "./lib/db/load";
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

      if (await isNotSetup(db)) await loadDatabase(db);

      const index = await createSearchIndex(db);

      setDB(db);
      setSearchIndex(index);
      setIsReady(true);
    }
    setup();
  }, []);

  if (isReady && database && searchIndex) {
    return (
      <div className="min-h-screen bg-neutral-900 p-10 text-white">
        <Search index={searchIndex} db={database} />
      </div>
    );
  }
}

export default App;
