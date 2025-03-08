"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: {
    id: number;
    name: string;
    logo_path: string;
  }[];
}

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

interface Video {
  key: string;
  name: string;
  type: string;
}

export default function MovieDetail() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_ACCESS_TOKEN}`,
          },
        };

        // Film detaylarını çek
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}?language=tr-TR`,
          options
        );
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Oyuncu kadrosunu çek
        const castResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}/credits?language=tr-TR`,
          options
        );
        const castData = await castResponse.json();
        setCast(castData.cast?.slice(0, 6) || []);

        // Önce Türkçe videoları dene, yoksa İngilizce videoları al
        const trVideosResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${params.id}/videos?language=tr-TR`,
          options
        );
        let trVideosData = await trVideosResponse.json();
        
        if (!trVideosData.results?.length) {
          const enVideosResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${params.id}/videos?language=en-US`,
            options
          );
          trVideosData = await enVideosResponse.json();
        }

        // Önce resmi fragmanları, yoksa diğer video tiplerini göster
        const trailers = trVideosData.results?.filter((v: Video) => 
          v.type === "Trailer" || v.type === "Teaser"
        ) || [];
        setVideos(trailers.slice(0, 1));

      } catch (err) {
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-6 pt-24 min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto max-w-7xl px-6 pt-24 min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="text-center">Film bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-[#0A0A0A]">
      {/* Backdrop Image */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 -mt-32 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="md:w-1/4">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg shadow-lg"
              priority
            />
          </div>

          {/* Film Detayları */}
          <div className="md:w-3/4">
            <h1 className="text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-gray-300 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex items-center gap-4 mb-6 text-gray-300">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>•</span>
              <span>{movie.runtime} dakika</span>
              <span>•</span>
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 text-gray-200 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed mb-8">
              {movie.overview}
            </p>

            {/* Oyuncu Kadrosu */}
            {cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Oyuncu Kadrosu
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      <div className="relative w-full aspect-[2/3] mb-2">
                        <Image
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <p className="text-white text-sm font-medium">
                        {actor.name}
                      </p>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fragman */}
            {videos.length > 0 && (
              <div className="container mx-auto max-w-7xl px-6 py-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Fragman
                </h2>
                <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${videos[0].key}?autoplay=0&rel=0&showinfo=0&modestbranding=1`}
                      title="Film Fragmanı"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                    />
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {videos[0].name}
                </p>
              </div>
            )}

            {/* Film Bilgileri */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Durum</p>
                <p className="text-white">{movie.status}</p>
              </div>
              <div>
                <p className="text-gray-400">Bütçe</p>
                <p className="text-white">
                  {movie.budget > 0
                    ? `$${movie.budget.toLocaleString()}`
                    : "Bilinmiyor"}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Hasılat</p>
                <p className="text-white">
                  {movie.revenue > 0
                    ? `$${movie.revenue.toLocaleString()}`
                    : "Bilinmiyor"}
                </p>
              </div>
              {movie.production_companies?.length > 0 && (
                <div>
                  <p className="text-gray-400">Yapım Şirketi</p>
                  <p className="text-white">
                    {movie.production_companies[0].name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
