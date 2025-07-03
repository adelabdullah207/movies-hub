const API_KEY = '4e44d9029b1270a757cddc766a1bcb63'; // Demo API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const movieApi = {
  // Get popular movies
  getPopular: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    return response.json();
  },

  // Get trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/${timeWindow}?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Get top rated movies
  getTopRated: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );
    return response.json();
  },

  // Get now playing movies
  getNowPlaying: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=${page}`
    );
    return response.json();
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&page=${page}`
    );
    return response.json();
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    );
    return response.json();
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1) => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Get movie credits
  getMovieCredits: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Get movie videos
  getMovieVideos: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number) => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Get genres
  getGenres: async () => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.json();
  },

  // Helper function to get full image URL
  getImageUrl: (path: string, size: string = 'w500') => {
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  // Helper function to get backdrop URL
  getBackdropUrl: (path: string, size: string = 'w1280') => {
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};