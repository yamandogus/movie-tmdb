"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

interface MovieListProps {
  selectedGenre: number | null;
}

const MovieList = ({ selectedGenre }: MovieListProps) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (pageNumber: number, isLoadMore: boolean = false) => {
    try {
      setLoading(true);
      let url = process.env.NEXT_PUBLIC_API_MOVIE_LIST;
      
      if (selectedGenre) {
        url = `https://api.themoviedb.org/3/discover/movie?with_genres=${selectedGenre}`;
      }

      if (!url) {
        throw new Error('Movie list API URL is not defined');
      }

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN}`,
        },
      };

      const response = await fetch(`${url}?language=tr-TR&page=${pageNumber}`, options);
      const data = await response.json();
      
      if (isLoadMore) {
        setMovies(prev => [...prev, ...data.results]);
      } else {
        setMovies(data.results);
      }
      
      setHasMore(data.page < data.total_pages);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMovies(1);
  }, [selectedGenre]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage, true);
  };

  if (loading && movies.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Popüler Filmler</h2>
        <div className="text-center">Filmler yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {selectedGenre ? "Kategori Filmleri" : "Popüler Filmler"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className="group"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="relative aspect-[2/3]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-medium text-sm mb-1" title={movie.title}>
                      {movie.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span>★ {movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Yükleniyor..." : "Daha Fazla Göster"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieList;