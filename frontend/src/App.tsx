import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Messages from "./pages/Messages";
import Create from "./pages/Create";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/listing/:itemId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  );
}

export default App;
