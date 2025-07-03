import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

function AppContent() {
  const location = useLocation();
  const isMovieDetailsPage = location.pathname.startsWith('/movie/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {!isMovieDetailsPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:genreId" element={<CategoryPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <Footer />
      <FloatingButtons />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;