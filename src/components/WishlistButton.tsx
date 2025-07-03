import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { Movie } from '../types/Movie';

interface WishlistButtonProps {
  movie: Movie;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  movie, 
  className = '', 
  size = 'md' 
}) => {
  const dispatch = useAppDispatch();
  const wishlistMovies = useAppSelector((state) => state.wishlist.movies);
  const isInWishlist = wishlistMovies.some(m => m.id === movie.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(movie.id));
    } else {
      dispatch(addToWishlist(movie));
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleWishlist}
      className={`${sizeClasses[size]} ${
        isInWishlist 
          ? 'bg-red-600 border-red-500' 
          : 'bg-white/10 border-white/20 hover:bg-red-600/20 hover:border-red-500/50'
      } backdrop-blur-sm rounded-full flex items-center justify-center border transition-all duration-300 ${className}`}
    >
      <Heart 
        className={`${iconSizes[size]} text-white transition-all duration-300 ${
          isInWishlist ? 'fill-current' : ''
        }`} 
      />
    </motion.button>
  );
};

export default WishlistButton;