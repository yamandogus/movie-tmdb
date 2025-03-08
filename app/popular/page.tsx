"use client";

import MovieCard from "@/components/MovieCard";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export default function PopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN}`,
          },
        };

        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?language=tr-TR&page=${page}`,
          options
        );
        const data = await response.json();
        
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }
      } catch (err) {
        console.error("Error fetching popular movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
        <Navbar />
        <main className="pt-16 px-4 md:px-6">
          <div className="max-w-[1400px] mx-auto">
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Popüler Filmler
            </h1>
            <div className="text-center py-10">Yükleniyor...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      <Navbar />
      <main className="pt-16 px-4 md:px-6">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Popüler Filmler
          </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="flex justify-center mt-8 mb-6">
            <button
              onClick={loadMore}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              {loading ? "Yükleniyor..." : "Daha Fazla"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 