import "./App.css";

import { useState } from "react";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import AuctionList from "./components/AuctionList";
import AuctionDetail from "./components/AuctionDetail";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<AuctionList />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
      </Routes>
    </div>
  );
}

export default App;
