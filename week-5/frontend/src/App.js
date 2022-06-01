import "./App.css";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";
import { getBlockchain } from "./utils/common";

function App() {
  const [blockchain, setBlockchain] = useState({});

  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain());
    })();
  }, []);

  return (
    <div>
      <Header blockchain={blockchain} />
      <Routes>
        <Route path="/" element={<AuctionList blockchain={blockchain} />} />
        <Route
          path="/auction/:id"
          element={<AuctionDetail blockchain={blockchain} />}
        />
      </Routes>
    </div>
  );
}

export default App;
