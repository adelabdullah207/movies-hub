import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import SearchBar from '../components/SearchBar';
import MovieList from '../components/MovieList';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle URL search parameter
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      setSearchQuery(query);
      const response = await movieApi.searchMovies(query);
      setSearchResults(response.results);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setSearchQuery('');
    // Clear URL parameter
    navigate('/search', { replace: true });
  };

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-red-400 to-purple-600 bg-clip-text text-transparent">
            Search Movies
          </h1>
          <p className="text-xl text-gray-400">
            Discover your next favorite movie from thousands of titles
          </p>
        </motion.div>

        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          isSearching={isSearching}
        />

        {isSearching && <LoadingSpinner />}

        {searchResults.length > 0 && (
          <MovieList
            movies={searchResults}
            title={`Search Results for "${searchQuery}"`}
            onMovieClick={handleMovieClick}
          />
        )}

        {searchQuery && searchResults.length === 0 && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-white mb-4">No movies found</h3>
            <p className="text-gray-400">Try searching with different keywords</p>
          </motion.div>
        )}

        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Start your search</h3>
            <p className="text-gray-400">Enter a movie title, actor, or director to begin</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;