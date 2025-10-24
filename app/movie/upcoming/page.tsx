'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

type Genre = { id: number; name: string };

export default function UpcomingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Filters
  const [sortBy, setSortBy] = useState('primary_release_date.asc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [releaseFrom, setReleaseFrom] = useState(() => new Date().toISOString().split('T')[0]);
  const [releaseTo, setReleaseTo] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [minVotes, setMinVotes] = useState(0);
  const [language, setLanguage] = useState('');
  const [keywords, setKeywords] = useState('');

  // Fetch genre list
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)
      .then((r) => r.json())
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // Fetch movies based on filters
  const fetchMovies = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        api_key: String(TMDB_API_KEY),
        language: 'en-US',
        page: String(pageNum),
        sort_by: sortBy,
        'primary_release_date.gte': releaseFrom, // only upcoming movies
      });

      if (releaseTo) params.set('primary_release_date.lte', releaseTo);
      if (selectedGenres.length) params.set('with_genres', selectedGenres.join(','));
      if (minScore) params.set('vote_average.gte', String(minScore));
      if (minVotes) params.set('vote_count.gte', String(minVotes));
      if (language) params.set('with_original_language', language);
      if (keywords) params.set('with_keywords', keywords);

      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
      const data = await res.json();

      if (append) setMovies((prev) => [...prev, ...(data.results || [])]);
      else setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setPage(1);
    fetchMovies(1, false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-[30px] lg:pt-[50px]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sidebar */}
        <aside className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 h-fit space-y-6">
          <h2 className="text-2xl font-semibold">🎬 Upcoming Movies</h2>

          {/* Sort */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Sort Results By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-800 text-white w-full rounded-md p-2 border border-zinc-700"
            >
              <option value="primary_release_date.asc">Release Date Ascending</option>
              <option value="primary_release_date.desc">Release Date Descending</option>
              <option value="popularity.desc">Popularity Descending</option>
              <option value="popularity.asc">Popularity Ascending</option>
              <option value="vote_average.desc">Rating Descending</option>
              <option value="vote_average.asc">Rating Ascending</option>
            </select>
          </div>

          {/* Release Dates */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Release Dates</h3>
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={releaseFrom}
                onChange={(e) => setReleaseFrom(e.target.value)}
                className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2"
              />
              <input
                type="date"
                value={releaseTo}
                onChange={(e) => setReleaseTo(e.target.value)}
                className="bg-zinc-800 text-white rounded-md border border-zinc-700 p-2"
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((g) => (
                <span
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-3 py-1 rounded-full cursor-pointer border text-sm transition ${
                    selectedGenres.includes(g.id)
                      ? 'bg-red-600 border-red-500'
                      : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {g.name}
                </span>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Language</h3>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g. en, fr, ja"
              className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
            />
          </div>

          {/* User Score */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">User Score ≥</h3>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
            />
          </div>

          {/* Minimum Votes */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Minimum User Votes</h3>
            <input
              type="number"
              value={minVotes}
              onChange={(e) => setMinVotes(Number(e.target.value))}
              className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
            />
          </div>

          {/* Keywords */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Keywords</h3>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Filter by keywords..."
              className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
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

        {/* Movies Section */}
        <main className="md:col-span-3">
          <h2 className="text-3xl font-bold mb-6">Upcoming Movies</h2>

          {loading && page === 1 ? (
            <div className="text-center py-20 text-gray-400">Loading movies...</div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <Link
                  href={`/movie/${movie.id}`}
                  key={movie.id}
                  className="bg-zinc-900 rounded-2xl overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer"
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
                    <div className="w-full h-[300px] bg-zinc-800 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
                    <p className="text-gray-400 text-sm">
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                    <p className="text-gray-400 text-sm">⭐ {movie.vote_average.toFixed(1)}</p>
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
                fetchMovies(next, true);
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
