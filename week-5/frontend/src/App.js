import "./App.css";

import { useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import AuctionList from "./components/AuctionList";

function App() {
  // List of auctions
  const [auctions, setAuctions] = useState([1, 2, 3, 4]);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<AuctionList />} />
      </Routes>
    </div>
  );
}

export default App;
