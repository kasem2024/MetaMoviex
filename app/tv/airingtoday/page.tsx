'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type TvShow = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
};

type Genre = {
  id: number;
  name: string;
};

export default function AiringToday() {
  const [tvShows, setTvShows] = useState<TvShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filters
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [language, setLanguage] = useState('');
  const [country, setCountry] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [minVotes, setMinVotes] = useState(50);
  const [keywords, setKeywords] = useState('');

  // Fetch genres
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${TMDB_API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // Fetch shows airing today
  const fetchTvShows = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0]; // today’s date
      const params = new URLSearchParams({
        api_key: String(TMDB_API_KEY),
        language: 'en-US',
        page: String(pageNum),
        sort_by: sortBy,
        'first_air_date.lte': today,
        'first_air_date.gte': today,
        'vote_average.gte': String(minScore),
        'vote_count.gte': String(minVotes),
      });

      if (selectedGenres.length) params.set('with_genres', selectedGenres.join(','));
      if (language) params.set('with_original_language', language);
      if (country) params.set('with_origin_country', country);
      if (keywords) params.set('with_keywords', keywords);

     const res = await fetch(
          `https://api.themoviedb.org/3/tv/airing_today?api_key=${TMDB_API_KEY}&language=en-US&page=${pageNum}`
        );
      const data = await res.json();

      if (append) setTvShows((prev) => [...prev, ...(data.results || [])]);
      else setTvShows(data.results || []);
    } catch (err) {
      console.error('Error fetching airing today TV shows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTvShows(1);
  }, []);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setPage(1);
    fetchTvShows(1, false);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white pt-[50px] lg:pt-[60px]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 h-fit space-y-6">
          <h2 className="text-2xl font-semibold">📅 Airing Today</h2>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Sort Results By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-800 text-white w-full rounded-md p-2 border border-zinc-700"
            >
              <option value="popularity.desc">Popularity Descending</option>
              <option value="popularity.asc">Popularity Ascending</option>
              <option value="first_air_date.desc">Newest First</option>
              <option value="first_air_date.asc">Oldest First</option>
              <option value="vote_average.desc">Rating Descending</option>
              <option value="vote_average.asc">Rating Ascending</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Origin Country</h3>
            <input
              type="text"
              placeholder="e.g. US, GB, JP"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2 w-full"
            />
          </div>

          {/* Language */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Language</h3>
            <input
              type="text"
              placeholder="e.g. en, ja, ko"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2 w-full"
            />
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={`px-3 py-1 rounded-full cursor-pointer border text-sm transition ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-red-600 border-red-500'
                      : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Score */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">User Score ≥</h3>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2 w-full"
            />
          </div>

          {/* Votes */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Minimum Votes</h3>
            <input
              type="number"
              min="0"
              value={minVotes}
              onChange={(e) => setMinVotes(Number(e.target.value))}
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2 w-full"
            />
          </div>

          {/* Keywords */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Keywords</h3>
            <input
              type="text"
              placeholder="Search by keyword..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2 w-full"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full mt-4 bg-red-600 hover:bg-red-700 py-2 rounded-md transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-3">
          <h2 className="text-3xl font-bold mb-6">Airing Today on TV</h2>

          {loading && page === 1 ? (
            <div className="text-center py-20 text-gray-400">Loading TV shows...</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {tvShows.map((show) => (
                <Link
                  href={`/tv/${show.id}`}
                  key={show.id}
                  className="bg-zinc-900 rounded-2xl overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer"
                >
                  {show.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      width={500}
                      height={750}
                      className="w-full h-[300px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-zinc-800 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{show.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {show.first_air_date
                        ? new Date(show.first_air_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                    <p className="text-yellow-400 font-semibold mt-1">
                      ⭐ {show.vote_average.toFixed(1)} ({show.vote_count})
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchTvShows(next, true);
              }}
              disabled={loading}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
