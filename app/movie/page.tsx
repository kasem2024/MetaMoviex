// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// type Movie = {
//   id: number;
//   title: string;
//   poster_path: string | null;
//   release_date: string;
// };

// export default function PopularMovies() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const fetchMovies = async (pageNum: number) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${pageNum}`
//       );
//       const data = await res.json();
//       if (pageNum === 1) {
//         setMovies(data.results || []);
//       } else {
//         setMovies((prev) => [...prev, ...(data.results || [])]);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMovies(page);
//   }, [page]);

//   return (
//     <div className="w-full min-h-screen bg-zinc-950 text-white pt-[50px] lg:pt-[40px]">
     

//       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
//         {/* Sidebar Filters */}
//         <aside className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 h-fit">
//           <h2 className="text-2xl font-semibold mb-6">🎬 Popular Movies</h2>

//           <div className="space-y-5 text-sm">
//             <div>
//               <h3 className="font-semibold text-gray-300 mb-2">Sort</h3>
//               <select className="bg-zinc-800 text-white w-full rounded-md p-2 border border-zinc-700">
//                 <option>Popularity Descending</option>
//                 <option>Popularity Ascending</option>
//                 <option>Release Date Descending</option>
//                 <option>Release Date Ascending</option>
//               </select>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-300 mb-2">Country</h3>
//               <select className="bg-zinc-800 text-white w-full rounded-md p-2 border border-zinc-700">
//                 <option>Egypt</option>
//                 <option>USA</option>
//                 <option>UK</option>
//                 <option>Japan</option>
//               </select>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-300 mb-2">Genres</h3>
//               <div className="flex flex-wrap gap-2">
//                 {[
//                   'Action',
//                   'Comedy',
//                   'Drama',
//                   'Horror',
//                   'Romance',
//                   'Sci-Fi',
//                   'Animation',
//                 ].map((g) => (
//                   <span
//                     key={g}
//                     className="bg-zinc-800 px-3 py-1 rounded-full cursor-pointer hover:bg-red-600 transition"
//                   >
//                     {g}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <button className="w-full mt-6 bg-red-600 hover:bg-red-700 py-2 rounded-md transition font-semibold">
//               Search
//             </button>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="md:col-span-3">
//           <h2 className="text-3xl font-bold mb-6">Popular Movies</h2>

//           {loading && page === 1 ? (
//             <div className="text-center py-20 text-gray-400">Loading movies...</div>
//           ) : (
//             <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {movies.map((movie) => (
//                 <Link 
//                   href={`/movie/${movie.id}`}
//                   key={movie.id}
//                   className="bg-zinc-900 rounded-2xl overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer"
//                 >
//                   {movie.poster_path ? (
//                     <Image
//                       src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
//                       alt={movie.title}
//                       width={500}
//                       height={750}
//                       className="w-full h-[300px] object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-[300px] bg-zinc-800 flex items-center justify-center text-gray-500">
//                       No Image
//                     </div>
//                   )}

//                   <div className="p-4">
//                     <h3 className="font-semibold line-clamp-1">{movie.title}</h3>
//                     <p className="text-gray-400 text-sm">
//                       {movie.release_date
//                         ? new Date(movie.release_date).toLocaleDateString('en-US', {
//                             month: 'short',
//                             day: 'numeric',
//                             year: 'numeric',
//                           })
//                         : 'N/A'}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           )}

//           {/* Load More */}
//           <div className="flex justify-center mt-10">
//             <button
//               onClick={() => setPage((prev) => prev + 1)}
//               disabled={loading}
//               className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-sm rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Loading...' : 'Load More'}
//             </button>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

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
  genre_ids: number[];
};

type Genre = { id: number; name: string };

export default function DiscoverMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [minVotes, setMinVotes] = useState(0);
  const [language, setLanguage] = useState('');
  const [releaseFrom, setReleaseFrom] = useState('');
  const [releaseTo, setReleaseTo] = useState('');
  const [keywords, setKeywords] = useState('');

  // --- Fetch genres
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`)
      .then((r) => r.json())
      .then((data) => setGenres(data.genres || []))
      .catch(console.error);
  }, []);

  // --- Fetch movies based on filters
  const fetchMovies = async (pageNum: number, append = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        api_key: String(TMDB_API_KEY),
        language: 'en-US',
        page: String(pageNum),
        sort_by: sortBy,
      });

      if (selectedGenres.length) params.set('with_genres', selectedGenres.join(','));
      if (minScore) params.set('vote_average.gte', String(minScore));
      if (minVotes) params.set('vote_count.gte', String(minVotes));
      if (language) params.set('with_original_language', language);
      if (releaseFrom) params.set('primary_release_date.gte', releaseFrom);
      if (releaseTo) params.set('primary_release_date.lte', releaseTo);
      if (keywords) params.set('with_keywords', keywords);

      const res = await fetch(`https://api.themoviedb.org/3/discover/movie?${params.toString()}`);
      const data = await res.json();

      if (append) {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      } else {
        setMovies(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetchMovies(1, false);
  };

  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white pt-[50px] lg:pt-[40px]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Sidebar Filters */}
        <aside className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 h-fit space-y-6">
          <h2 className="text-2xl font-semibold">🎬 Filter Movies</h2>

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
              <option value="release_date.desc">Release Date Descending</option>
              <option value="release_date.asc">Release Date Ascending</option>
              <option value="vote_average.desc">Rating Descending</option>
              <option value="vote_average.asc">Rating Ascending</option>
            </select>
          </div>

          {/* Release Dates */}
          <div>
            <h3 className="font-semibold text-gray-300 mb-2">Release Dates</h3>
            <div className="flex gap-2 flex-wrap">
              <input
                type="date"
                value={releaseFrom}
                onChange={(e) => setReleaseFrom(e.target.value)}
                className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
              />
              <input
                type="date"
                value={releaseTo}
                onChange={(e) => setReleaseTo(e.target.value)}
                className="bg-zinc-800 text-white rounded-md p-2 border border-zinc-700 w-full"
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

        {/* Main Content */}
        <main className="md:col-span-3">
          <h2 className="text-3xl font-bold mb-6">Discover Movies</h2>

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
                    <p className="text-gray-400 text-sm">
                      ⭐ {movie.vote_average.toFixed(1)}
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
