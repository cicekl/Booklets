import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import MyLibrary from './pages/MyLibrary'
import InputNote from './pages/InputNote';
import Favourites from './pages/Favourites';
import BookDetails from './pages/BookDetails';
import EditNote from "./pages/EditNote";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/library" element={<MyLibrary />} />
      <Route path="/input" element={<InputNote />} />
      <Route path="/favourites" element={<Favourites />} />
      <Route path="/book/:id" element={<BookDetails />} />
      <Route path="/edit-book/:id" element={<EditNote />} />
    </Routes>
  </Router>
  );
}

export default App;
