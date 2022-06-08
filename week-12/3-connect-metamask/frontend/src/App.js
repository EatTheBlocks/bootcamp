import "./App.css";

import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Connect from "./pages/Connect";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Connect />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
