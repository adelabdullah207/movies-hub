import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Movie, Genre } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import MovieList from '../components/MovieList';
import LoadingSpinner from '../components/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryMovies = async () => {
      if (!genreId) return;

      try {
        setIsLoading(true);
        const [moviesResponse, genresResponse] = await Promise.all([
          movieApi.getMoviesByGenre(parseInt(genreId)),
          movieApi.getGenres()
        ]);

        setMovies(moviesResponse.results);
        const foundGenre = genresResponse.genres.find((g: Genre) => g.id === parseInt(genreId));
        setGenre(foundGenre || null);
      } catch (error) {
        console.error('Error fetching category movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryMovies();
  }, [genreId]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black pt-24">
        <LoadingSpinner />
      </div>
    );
  }

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
            {genre?.name || 'Category'} Movies
          </h1>
          <p className="text-xl text-gray-400">
            Explore the best {genre?.name?.toLowerCase()} movies
          </p>
        </motion.div>

        {movies.length > 0 ? (
          <MovieList
            movies={movies}
            title={`${genre?.name || 'Category'} Movies`}
            onMovieClick={handleMovieClick}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <h3 className="text-2xl font-bold text-white mb-4">No movies found</h3>
            <p className="text-gray-400">Try exploring other categories</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;