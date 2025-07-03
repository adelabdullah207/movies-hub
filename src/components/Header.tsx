import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Search, ChevronDown, Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Genre, Movie } from "../types/Movie";
import { movieApi } from "../services/movieApi";
import { useAppSelector } from "../hooks/redux";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const wishlistCount = useAppSelector((state) => state.wishlist.movies.length);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await movieApi.getGenres();
        setGenres(response.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          setIsLoadingSuggestions(true);
          const response = await movieApi.searchMovies(searchQuery.trim());
          setSearchSuggestions(response.results.slice(0, 5));
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
          setSearchSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      } else {
        setSearchSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const isActive = (path: string) => location.pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-600 bg-clip-text text-transparent">
                MoviesHub
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/movies-hub/"
              className={`text-lg font-medium transition-colors ${
                isActive("/") ? "text-red-400" : "text-white hover:text-red-400"
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-2 text-lg font-medium text-white hover:text-red-400 transition-colors"
              >
                Categories
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isCategoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCategoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl"
                  >
                    <div className="p-4 grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {genres.map((genre) => (
                        <Link
                          key={genre.id}
                          to={`/category/${genre.id}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {genre.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/wishlist"
              className={`text-lg font-medium transition-colors ${
                isActive("/wishlist")
                  ? "text-red-400"
                  : "text-white hover:text-red-400"
              }`}
            >
              Wishlist
            </Link>

            <Link
              to="/contact"
              className={`text-lg font-medium transition-colors ${
                isActive("/contact")
                  ? "text-red-400"
                  : "text-white hover:text-red-400"
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-white hover:text-red-400 transition-colors"
              >
                <Search className="w-6 h-6" />
              </motion.button>

              {/* Search Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl"
                  >
                    <div className="p-4">
                      <form
                        onSubmit={handleSearchSubmit}
                        className="relative mb-3"
                      >
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search movies..."
                          className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-sm"
                          autoFocus
                        />
                      </form>

                      {/* Search Suggestions */}
                      {isLoadingSuggestions && (
                        <div className="text-center py-4">
                          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-gray-400 text-xs">Searching...</p>
                        </div>
                      )}

                      {searchSuggestions.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-gray-400 text-xs font-medium">
                            Suggestions:
                          </p>
                          {searchSuggestions.map((movie) => (
                            <motion.div
                              key={movie.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleSuggestionClick(movie)}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            >
                              <div className="w-8 h-10 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                                {movie.poster_path ? (
                                  <img
                                    src={movieApi.getImageUrl(
                                      movie.poster_path,
                                      "w92"
                                    )}
                                    alt={movie.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                    <Film className="w-3 h-3 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">
                                  {movie.title}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {formatYear(movie.release_date)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {searchQuery.length >= 2 &&
                        searchSuggestions.length === 0 &&
                        !isLoadingSuggestions && (
                          <p className="text-gray-400 text-sm text-center py-4">
                            No movies found
                          </p>
                        )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon with Badge */}
            <Link to="/wishlist">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 text-white hover:text-red-400 transition-colors"
              >
                <Heart className="w-6 h-6" />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </motion.span>
                )}
              </motion.button>
            </Link>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-white hover:text-red-400 transition-colors"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full font-medium hover:from-red-700 hover:to-purple-700 transition-all"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-white/10"
            >
              <nav className="flex flex-col gap-4">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive("/") ? "text-red-400" : "text-white"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/search"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium text-white"
                >
                  Search
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive("/wishlist") ? "text-red-400" : "text-white"
                  }`}
                >
                  Wishlist ({wishlistCount})
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    isActive("/contact") ? "text-red-400" : "text-white"
                  }`}
                >
                  Contact Us
                </Link>
                <div className="flex gap-4 pt-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="px-4 py-2 text-white border border-white/20 rounded-full">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="px-6 py-2 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
