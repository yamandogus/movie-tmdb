"use client";

import { useEffect, useState } from "react";

interface Genre {
  id: number;
  name: string;
}

interface SidebarProps {
  onGenreSelect: (genreId: number | null) => void;
  selectedGenre: number | null;
}

const Sidebar = ({ onGenreSelect, selectedGenre }: SidebarProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isHovered, setIsHovered] = useState<number | null>(null);

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

  // Mobil ve tablet için yatay slider
  const MobileGenres = () => (
    <div className="md:hidden w-full overflow-x-auto scrollbar-hide bg-gray-50/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="flex space-x-2 p-4 min-w-full">
        <button
          onClick={() => onGenreSelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
            selectedGenre === null
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
              : "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50"
          }`}
        >
          Tümü
        </button>
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onGenreSelect(genre.id === selectedGenre ? null : genre.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
              selectedGenre === genre.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                : "bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700/50"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );

  // Desktop için sidebar
  const DesktopSidebar = () => (
    <aside className="hidden md:block w-64 bg-gray-50/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-gray-200/50 dark:border-gray-700/50">
      <div className="p-6">
        <div className="relative">
          <h2 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Kategoriler
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => onGenreSelect(null)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                selectedGenre === null
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200"
              }`}
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className="flex-1 font-medium">Tümü</span>
              </div>
            </button>
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => onGenreSelect(genre.id === selectedGenre ? null : genre.id)}
                onMouseEnter={() => setIsHovered(genre.id)}
                onMouseLeave={() => setIsHovered(null)}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  selectedGenre === genre.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="flex-1 font-medium">{genre.name}</span>
                  <div className={`transform transition-transform duration-300 ${
                    selectedGenre === genre.id || isHovered === genre.id ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
                  }`}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                {(selectedGenre === genre.id || isHovered === genre.id) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-600/20 transform scale-105 blur-xl" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <MobileGenres />
      <DesktopSidebar />
    </>
  );
};

export default Sidebar; 