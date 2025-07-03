import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, isSearching }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Fetch suggestions when query changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          setIsLoadingSuggestions(true);
          const response = await movieApi.searchMovies(query.trim());
          setSuggestions(response.results.slice(0, 8)); // Show top 8 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClear();
  };

  const handleSuggestionClick = (movie: Movie) => {
    setQuery(movie.title);
    onSearch(movie.title);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <motion.div
      ref={searchRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-2xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused
              ? '0 0 0 2px rgba(59, 130, 246, 0.5)'
              : '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for movies..."
            className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
          <AnimatePresence>
            {(query || isSearching) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            {isLoadingSuggestions ? (
              <div className="p-4 text-center">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Searching...</p>
              </div>
            ) : (
              <div className="p-2">
                {suggestions.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(movie)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group"
                  >
                    {/* Movie Poster */}
                    <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                      {movie.poster_path ? (
                        <img
                          src={movieApi.getImageUrl(movie.poster_path, 'w92')}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Search className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* Movie Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors truncate">
                        {movie.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-400 text-xs">
                          {formatYear(movie.release_date)}
                        </span>
                        {movie.vote_average > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-gray-400 text-xs">
                              {formatRating(movie.vote_average)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-gray-400 group-hover:text-white transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchBar;