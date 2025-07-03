import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../types/Movie';
import MovieCard from './MovieCard';

interface MovieListProps {
  movies: Movie[];
  title: string;
  onMovieClick: (movie: Movie) => void;
}

const MovieList: React.FC<MovieListProps> = ({ movies, title, onMovieClick }) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
      >
        {title}
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            index={index}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default MovieList;