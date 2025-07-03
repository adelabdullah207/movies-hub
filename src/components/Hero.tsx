import React from 'react';
import { Play, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';

interface HeroProps {
  movie: Movie | null;
  onPlayClick: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ movie, onPlayClick }) => {
  if (!movie) return null;

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={movieApi.getBackdropUrl(movie.backdrop_path, 'w1280')}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {movie.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-6 text-gray-300">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-medium">{formatRating(movie.vote_average)}</span>
            </div>
            <div className="text-lg">{formatYear(movie.release_date)}</div>
          </div>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
            {movie.overview}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlayClick(movie)}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 shadow-xl"
          >
            <Play className="w-6 h-6" />
            Watch Now
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300"
          >
            <Info className="w-6 h-6" />
            More Info
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Hero;