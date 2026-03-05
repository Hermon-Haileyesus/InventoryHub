import "./App.css";
import InventoryPage from "./pages/InventoryPage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InventoryPage />} />
    </Routes>
  );
}

export default App;
