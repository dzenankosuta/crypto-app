import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import HomePage from "./pages/HomePage";
import Favorites from "./pages/Favorites";
import Details from "./pages/Details";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/favorites" element={<Favorites />}></Route>
          <Route path="/details" element={<Details />}></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
