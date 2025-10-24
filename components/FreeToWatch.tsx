'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

type Media = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
};

const categories = [
  { key: "movie", label: "Movies" },
  { key: "tv", label: "TV" },
];

export default function FreeToWatch() {
  const [category, setCategory] = useState<"movie" | "tv">("movie");
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFreeToWatch = async () => {
      setLoading(true);
      // TMDB “discover” endpoint - free-to-watch or popular titles
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/${category}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`
      );
      const data = await res.json();
      setItems(data.results || []);
      setLoading(false);
    };

    fetchFreeToWatch();
  }, [category]);

  return (
    <section className="w-full bg-zinc-950 text-white py-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0">🎬 Free To Watch</h2>

        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key as "movie" | "tv")}
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

      {/* Grid */}
      <div className="max-w-6xl mx-auto mt-8 grid gap-6 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {loading ? (
          <div className="col-span-full text-center text-gray-400 py-10">
            Loading...
          </div>
        ) : (
          items.slice(0, 10).map((item) => {
            const title = item.title || item.name;
            const date = item.release_date || item.first_air_date;

            return (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
              >
                {item.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={title || "Unknown"}
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
                  <h3 className="text-sm font-semibold line-clamp-1">{title}</h3>
                  <p className="text-xs text-gray-400">
                    {date
                      ? new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
