import React from 'react';
import { Star, Calendar, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import WishlistButton from './WishlistButton';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
      onClick={() => onClick(movie)}
    >
      <div className="relative overflow-hidden">
        <img
          src={
            movie.poster_path
              ? movieApi.getImageUrl(movie.poster_path, 'w500')
              : 'https://via.placeholder.com/500x750?text=No+Image'
          }
          alt={movie.title}
          className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Play button overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </motion.div>
        </motion.div>
        
        {/* Wishlist button */}
        <div className="absolute top-3 right-3">
          <WishlistButton movie={movie} size="md" />
        </div>
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-medium">
            {formatRating(movie.vote_average)}
          </span>
        </div>
      </div>
      
      {/* Movie info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-4 mb-3 text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formatDate(movie.release_date)}</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {movie.overview}
        </p>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default MovieCard;