import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Play } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { removeFromWishlist, clearWishlist } from '../store/slices/wishlistSlice';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishlistMovies = useAppSelector((state) => state.wishlist.movies);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleRemoveFromWishlist = (movieId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(movieId));
  };

  const handleClearWishlist = () => {
    dispatch(clearWishlist());
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-red-400 to-purple-600 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-xl text-gray-400 mb-6">
            Your favorite movies collection ({wishlistMovies.length} movies)
          </p>
          
          {wishlistMovies.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearWishlist}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 rounded-full text-red-400 font-medium transition-all duration-300"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </motion.button>
          )}
        </motion.div>

        {wishlistMovies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart className="w-24 h-24 text-gray-600 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start adding movies to your wishlist by clicking the heart icon on any movie you love!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all duration-300"
            >
              Discover Movies
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden cursor-pointer shadow-2xl"
                onClick={() => handleMovieClick(movie)}
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
                  
                  {/* Remove from wishlist button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleRemoveFromWishlist(movie.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 bg-red-600/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-500/50 hover:bg-red-600 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-white fill-current" />
                  </motion.button>
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-white text-sm font-medium">
                      {formatRating(movie.vote_average)}
                    </span>
                  </div>
                </div>
                
                {/* Movie info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-3 text-gray-400">
                    <span className="text-sm">{formatYear(movie.release_date)}</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {movie.overview}
                  </p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 to-purple-500/0 group-hover:from-red-500/20 group-hover:to-purple-500/20 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;