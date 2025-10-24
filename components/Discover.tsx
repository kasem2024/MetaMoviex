'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { PlayCircle } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

const categories = [
  { key: "popular", label: "Popular" },
  { key: "now_playing", label: "In Theaters" },
  { key: "top_rated", label: "Top Rated" },
  { key: "upcoming", label: "Coming Soon" },
];

export default function Discover() {
  const [category, setCategory] = useState("popular");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
const [showModal, setShowModal] = useState(false);

const fetchTrailer = async (movieId: number) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const data = await res.json();
  const trailer = data.results.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
  return trailer ? trailer.key : null;
};
const handlePlay = async (movieId: number) => {
  const key = await fetchTrailer(movieId);
  if (key) {
    setTrailerKey(key);
    setShowModal(true);
  }
};

  // Fetch movies by category
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setMovies(data.results || []);
      setLoading(false);
    };
    fetchMovies();
  }, [category]);

  return (
    <section className="w-full bg-zinc-950 text-white py-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">🎥 Discover</h2>

        {/* Category buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c.key
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-6xl mx-auto mt-8 grid gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-10">
            Loading...
          </div>
        ) : (
          movies.slice(0, 10).map((movie) => (
            <div
              key={movie.id}
              className="relative group bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
            >
              {movie.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="w-full h-[300px] object-cover"
                />
              ) : (
                <div className="w-full h-[300px] bg-zinc-800 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Play Button on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <PlayCircle
  className="w-12 h-12 text-white hover:text-red-500 transition"
  onClick={() => handlePlay(movie.id)}
/>
              </div>

              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1">{movie.title}</h3>
                <p className="text-xs text-gray-400">
                  {movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && trailerKey && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="relative w-[90%] max-w-3xl aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${trailerKey}`}
        className="w-full h-full rounded-lg"
        allowFullScreen
      ></iframe>
      <button
        onClick={() => setShowModal(false)}
        className="absolute -top-10 right-0 text-white text-xl font-bold"
      >
        ✕
      </button>
    </div>
  </div>
)}

    </section>
  );
}
