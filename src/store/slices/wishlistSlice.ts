import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types/Movie';

interface WishlistState {
  movies: Movie[];
}

const initialState: WishlistState = {
  movies: JSON.parse(localStorage.getItem('wishlist') || '[]'),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Movie>) => {
      const movieExists = state.movies.find(movie => movie.id === action.payload.id);
      if (!movieExists) {
        state.movies.push(action.payload);
        localStorage.setItem('wishlist', JSON.stringify(state.movies));
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.movies));
    },
    clearWishlist: (state) => {
      state.movies = [];
      localStorage.setItem('wishlist', JSON.stringify([]));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;