import React from 'react';
import { X, Star, Calendar, Clock, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import WishlistButton from './WishlistButton';

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, isOpen, onClose }) => {
  if (!movie) return null;

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Hero section */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={movieApi.getBackdropUrl(movie.backdrop_path, 'w1280')}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
              
              {/* Play button */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50 hover:bg-white/30 transition-colors"
                >
                  <Play className="w-10 h-10 text-white ml-1" />
                </motion.button>
              </motion.div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex items-start gap-6">
                {/* Poster */}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex-shrink-0 w-48 h-72 rounded-xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={movieApi.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1"
                >
                  <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    {movie.title}
                  </h2>

                  <div className="flex items-center gap-6 mb-6 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium">{formatRating(movie.vote_average)}</span>
                      <span className="text-sm">({movie.vote_count} votes)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    {movie.overview}
                  </p>

                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300"
                    >
                      <Play className="w-5 h-5" />
                      Watch Now
                    </motion.button>
                    
                    <WishlistButton movie={movie} size="md" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;