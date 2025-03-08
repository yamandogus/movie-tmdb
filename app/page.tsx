"use client";

import { useState } from "react";

import MovieList from "@/components/MovieList";
import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0A0A] transition-colors duration-200">
      <Navbar />
      <div className="pt-16">
        <Sidebar onGenreSelect={setSelectedGenre} selectedGenre={selectedGenre} />
        <main className="md:pl-64 min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
          <div className="p-4 md:p-6">
            <MovieList selectedGenre={selectedGenre} />
          </div>
        </main>
      </div>
    </div>
  );
}
