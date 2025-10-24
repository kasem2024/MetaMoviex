'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type KnownFor = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
};

type Person = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for: KnownFor[];
};

export default function PopularPeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchPopularPeople = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&page=${pageNum}`
      );
      const data = await res.json();
      setPeople(data.results || []);
    } catch (err) {
      console.error("Error fetching people:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularPeople(page);
  }, [page]);

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white pt-[60px] lg:pt-[80px] py-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">🌟 Popular People</h1>
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 bg-zinc-800 text-sm rounded-full hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>
            <span className="text-gray-400">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 bg-zinc-800 text-sm rounded-full hover:bg-zinc-700 transition"
            >
              Next →
            </button>
          </div>
        </div>
        {/* People Grid */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {people.map((person) => (
              <Link 
                href={`/person/${person.id}`}
                key={person.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow hover:shadow-lg hover:scale-[1.03] transition-transform cursor-pointer"
              >
                {/* Profile Image */}
                {person.profile_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    width={500}
                    height={750}
                    className="w-full h-[350px] object-cover"
                  />
                ) : (
                  <div className="w-full h-[350px] bg-zinc-800 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-1 mb-1">
                    {person.name}
                  </h3>

                  <p className="text-sm text-gray-400 line-clamp-2">
                    {person.known_for && person.known_for.length > 0
                      ? person.known_for
                          .map((kf) => kf.title || kf.name)
                          .slice(0, 3)
                          .join(", ")
                      : "No known works available"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-zinc-800 text-sm rounded-full hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ← Previous
          </button>
          <span className="text-gray-400">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-zinc-800 text-sm rounded-full hover:bg-zinc-700 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
