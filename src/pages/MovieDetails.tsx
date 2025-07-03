import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, Play, ArrowLeft, Globe, DollarSign } from 'lucide-react';
import { MovieDetails as MovieDetailsType, Movie } from '../types/Movie';
import { movieApi } from '../services/movieApi';
import MovieList from '../components/MovieList';
import LoadingSpinner from '../components/LoadingSpinner';
import WishlistButton from '../components/WishlistButton';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const [movieResponse, similarResponse] = await Promise.all([
          movieApi.getMovieDetails(parseInt(id)),
          movieApi.getSimilarMovies(parseInt(id))
        ]);

        setMovie(movieResponse);
        setSimilarMovies(similarResponse.results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleSimilarMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

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

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-full"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={movieApi.getBackdropUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 px-6 py-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Wishlist Button */}
        <div className="absolute top-6 right-6 z-20">
          <WishlistButton movie={movie} size="lg" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-start"
          >
            <div className="w-80 h-[480px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={movieApi.getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Movie Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-xl text-red-400 mb-6 italic">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-xl font-medium">{formatRating(movie.vote_average)}</span>
                <span className="text-sm">({movie.vote_count} votes)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span className="text-lg">{formatDate(movie.release_date)}</span>
              </div>
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  <span className="text-lg">{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white border border-white/20"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
              {movie.overview}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 shadow-xl"
              >
                <Play className="w-6 h-6" />
                Watch Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {movie.budget > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Budget</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(movie.budget)}</p>
            </div>
          )}

          {movie.revenue > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Revenue</h3>
              </div>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(movie.revenue)}</p>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Status</h3>
            </div>
            <p className="text-2xl font-bold text-purple-400">{movie.status}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Popularity</h3>
            </div>
            <p className="text-2xl font-bold text-yellow-400">{movie.popularity.toFixed(0)}</p>
          </div>
        </motion.div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <MovieList
            movies={similarMovies}
            title="Similar Movies"
            onMovieClick={handleSimilarMovieClick}
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetails;