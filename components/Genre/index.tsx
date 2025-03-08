"use client";

import { useState, useEffect } from "react";

interface Genre {
  id: number;
  name: string;
}

interface GenreProps {
  onGenreSelect: (genreId: number | null) => void;
}

const Genre = ({ onGenreSelect }: GenreProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN}`,
          },
        };

        const response = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?language=tr-TR",
          options
        );
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreId: number) => {
    const newSelectedGenre = genreId === selectedGenre ? null : genreId;
    setSelectedGenre(newSelectedGenre);
    onGenreSelect(newSelectedGenre);
  };

  return (
    <div className="mt-8">
      <h2 className="text-md font-semibold mb-4">Film Kategorileri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.id)}
            className={`bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-center cursor-pointer transition-colors ${
              selectedGenre === genre.id ? "bg-blue-500 text-white hover:bg-blue-600" : ""
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Genre;
