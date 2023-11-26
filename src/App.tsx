import { useState, useEffect } from "react";
import { connect, arbitaryDBRequest } from "./lib/db";
import { loadTestFile } from "./lib/load";

function App() {
  const [dbInfo, setDBInfo] = useState<{ name: string; count: number }>();
  useEffect(() => {
    async function test() {
      const db = await connect();
      console.log("start loading");
      loadTestFile(db);
      await arbitaryDBRequest((store) => {
        const count = store.count();
        count.onsuccess = () => {
          setDBInfo({ name: db.name, count: count.result });
        };
      }, db);
    }
    test();
  }, []);

  return (
    <>
      <div className="border-2 rounded">IndexedDB name is {dbInfo?.count}</div>
    </>
  );
}

export default App;
