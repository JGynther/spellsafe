import { useState, useEffect } from "react";
import { connect, isNotSetup } from "./lib/db/setup";
import { loadOracle } from "./lib/db/load";

function App() {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function setup() {
      const db = await connect();
      if (await isNotSetup(db)) await loadOracle(db);
      setIsReady(true);
    }
    setup();
  }, []);

  if (isReady) {
    return (
      <>
        <div className="border-2 rounded">IndexedDB name is</div>
      </>
    );
  }
}

export default App;
