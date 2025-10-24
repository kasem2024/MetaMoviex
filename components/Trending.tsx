'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export default function Trending() {
  const [timeWindow, setTimeWindow] = useState<"day" | "week">("day");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/${timeWindow}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results || []);
      setLoading(false);
    };
    fetchTrending();
  }, [timeWindow]);

  return (
    <div className="w-full py-10 bg-zinc-950 text-white pt-[50px] lg:pt-[70px]">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">🔥 Trending</h2>

        <div className="flex gap-2">
          {["day", "week"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeWindow(t as "day" | "week")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                timeWindow === t
                  ? "bg-red-600 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700 text-gray-300"
              }`}
            >
              {t === "day" ? "Today" : "This Week"}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      <div className="max-w-6xl mx-auto mt-8 grid gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-10">
            Loading...
          </div>
        ) : (
          movies.slice(0, 10).map((movie) => (
            <div
              key={movie.id}
              className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
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

              <div className="p-3">
                <h3 className="text-sm font-semibold line-clamp-1">
                  {movie.title}
                </h3>
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
    </div>
  );
}
