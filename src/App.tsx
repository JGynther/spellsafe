import { useState, useEffect } from "react";
import { IDBAbstraction, databaseContext } from "./lib/db";

import Search from "./components/search";
import Export from "./components/export";

function App() {
  const [database, setDB] = useState<IDBAbstraction>();

  useEffect(() => {
    async function setup() {
      const db = await IDBAbstraction.initNewConnection("CardDatabase");
      if (!db.isSetup) await db.initialLoad();

      setDB(db);
    }
    setup();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 p-10 text-white">
      {database && (
        <databaseContext.Provider value={database}>
          <Search />
          <Export />
        </databaseContext.Provider>
      )}
      {!database && <p>Loading database...</p>}
    </div>
  );
}

export default App;
