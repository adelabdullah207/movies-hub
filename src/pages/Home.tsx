import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import Hero from '../components/Hero';
import MovieList from '../components/MovieList';
import LoadingSpinner from '../components/LoadingSpinner';

const Home: React.FC = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [trendingResponse, popularResponse, topRatedResponse, nowPlayingResponse] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getNowPlaying()
        ]);

        const trending = trendingResponse.results.slice(0, 12);
        const popular = popularResponse.results.slice(0, 12);
        const topRated = topRatedResponse.results.slice(0, 12);
        const nowPlaying = nowPlayingResponse.results.slice(0, 12);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setNowPlayingMovies(nowPlaying);
        setHeroMovie(trending[0] || popular[0]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handlePlayClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Loading MoviesHub</h2>
          <p className="text-gray-400">Fetching the latest movies...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      {heroMovie && (
        <Hero movie={heroMovie} onPlayClick={handlePlayClick} />
      )}

      {/* Main Content */}
      <main className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Movie Lists */}
          {trendingMovies.length > 0 && (
            <MovieList
              movies={trendingMovies}
              title="🔥 Trending This Week"
              onMovieClick={handleMovieClick}
            />
          )}

          {nowPlayingMovies.length > 0 && (
            <MovieList
              movies={nowPlayingMovies}
              title="🎬 Now Playing"
              onMovieClick={handleMovieClick}
            />
          )}

          {popularMovies.length > 0 && (
            <MovieList
              movies={popularMovies}
              title="⭐ Most Watched"
              onMovieClick={handleMovieClick}
            />
          )}

          {topRatedMovies.length > 0 && (
            <MovieList
              movies={topRatedMovies}
              title="🏆 Top Rated"
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;