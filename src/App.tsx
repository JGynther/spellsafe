import { useState, useEffect } from "react";

import { connect, isNotSetup } from "./lib/db/setup";
import { loadDatabase } from "./lib/db/load";
import { createSearchIndex } from "./lib/db/search";

import type { SearchIndex } from "./lib/db/search";

import Search from "./components/search";

function App() {
  const [database, setDB] = useState<IDBDatabase>();
  const [searchIndex, setSearchIndex] = useState<SearchIndex>();

  useEffect(() => {
    async function setup() {
      const db = await connect();

      if (await isNotSetup(db)) await loadDatabase(db);

      const index = await createSearchIndex(db);

      setDB(db);
      setSearchIndex(index);
    }
    setup();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 p-10 text-white">
      {database && searchIndex && <Search index={searchIndex} db={database} />}
      {!database && <p>Loading database...</p>}
    </div>
  );
}

export default App;
