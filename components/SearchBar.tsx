'use client';
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
};

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [trending , setTrending] = useState(true)

  // Fetch trending movies by default
  useEffect(() => {
    if (!showResults) return;
    const fetchTrending = async () => {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
      );
      const data = await res.json();
      setMovies(data.results.splice(0,9) || []);
      setTrending(true)
      setLoading(false);
    };
    fetchTrending();
  }, [showResults]);

  // Fetch suggestions when typing
  useEffect(() => {
    if (query.trim().length < 2) return;
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
      );
      const data = await res.json();
      setMovies(data.results.splice(0,9) || []);
      setLoading(false);
      setTrending(false)
    }, 400); // debounce for 400ms
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
   <div>
    <label htmlFor="search">
      <FaSearch/>
    </label >
    <div className="absolute -bottom-12 left-0   lg:pl-[400px] w-full bg-zinc-900  mx-auto border-b-[1px] border-b-gray-600" >
      {/* Input */}
      <input id="search"
        type="text"
        placeholder="🔎 Search here for a movie..."
         className="mx-auto w-full p-3 shadow-sm focus:outline-none focus:ring-0  "
        value={query}
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)} // delay so click works
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Dropdown results */}
      {showResults && (
        <div className="absolute left-0 z-100 w-full bg-zinc-900   shadow-lg max-h-fit ">
          {loading ? (
            <div className="p-4 text-gray-100 text-center">Loading...</div>
          ) : movies.length === 0 ? (
            <div className="p-4 text-gray-100 text-center">No results</div>
          ) : trending ?(
            <div className="w-full">
              <p className="lg:pl-[400px] py-3 font-bold text-lg bg-red-900">🔥 Trending</p>
              <ul className=" w-full">
              {movies.map((movie) => (
                <Link
                  href={`/movie/${movie.id}`}
                  key={movie.id}
                  className="flex p-2 item-center gap-3 py-1 lg:pl-[400px] text-sm hover:bg-red-900 cursor-pointer transition  border-b-[1px] border-gray-600"
                >
                  {movie.poster_path ? (
                    <Image
                      width={50}
                      height={50}
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-6 h-6 object-cover rounded-full "
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 " />
                  )}
                  <span className="text-gray-800 text-sm text-white ">
                    {`🔎 ${movie.title}`}
                  </span>
                </Link>
              ))}
            </ul>
            </div>
          ):(
             <ul className=" w-full">
              {movies.map((movie) => (
                <li
                  key={movie.id}
                  className="flex p-2 item-center gap-3 py-1 lg:pl-[400px] text-sm hover:bg-red-900 cursor-pointer transition  border-b-[1px] border-gray-600"
                >
                  {movie.poster_path ? (
                    <Image 
                      width={50}
                      height={50}
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-6 h-6 object-cover rounded-full "
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 " />
                  )}
                  <span className="text-gray-800 text-sm text-white ">
                    {`🔎 ${movie.title}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
   </div>
  );
}


// 'use client';

// import { useState, useEffect } from 'react';

// type Media = {
//   id: number;
//   media_type: 'movie' | 'tv' | 'person';
//   title?: string;
//   name?: string;
//   poster_path?: string | null;
//   profile_path?: string | null;
// };

// export default function MovieSearch() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Media[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showResults, setShowResults] = useState(false);

//   // Fetch trending (movies, tv, people combined)
//   useEffect(() => {
//     if (!showResults) return;
//     const fetchTrending = async () => {
//       setLoading(true);
//       const res = await fetch(
//         `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
//       );
//       const data = await res.json();
//       setResults(data.results || []);
//       setLoading(false);
//     };
//     fetchTrending();
//   }, [showResults]);

//   // Fetch search results (multi-search)
//   useEffect(() => {
//     if (query.trim().length < 2) return;
//     const delayDebounce = setTimeout(async () => {
//       setLoading(true);
//       const res = await fetch(
//         `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${query}`
//       );
//       const data = await res.json();
//       setResults(data.results || []);
//       setLoading(false);
//     }, 400);
//     return () => clearTimeout(delayDebounce);
//   }, [query]);

//   return (
//     <div className="relative w-full max-w-md mx-auto">
//       {/* Label + Input */}
//       <label htmlFor="search" className="sr-only">Search for a movie, show, or person</label>
//       <input
//         id="search"
//         type="text"
//         placeholder="🔍 Search movies, TV shows, or people"
//         className="w-full p-3 pl-4 pr-10 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-0"
//         value={query}
//         onFocus={() => setShowResults(true)}
//         onBlur={() => setTimeout(() => setShowResults(false), 200)}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {/* Dropdown results */}
//       {showResults && (
//         <div className="absolute z-10 mt-2 w-full bg-white border rounded-2xl shadow-lg max-h-80 overflow-y-auto">
//           {loading ? (
//             <div className="p-4 text-gray-500 text-center">Loading...</div>
//           ) : results.length === 0 ? (
//             <div className="p-4 text-gray-500 text-center">No results</div>
//           ) : (
//             <ul>
//               {results.map((item) => (
//                 <li
//                   key={`${item.media_type}-${item.id}`}
//                   className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer transition"
//                 >
//                   {/* Choose correct image */}
//                   {item.poster_path || item.profile_path ? (
//                     <img
//                       src={`https://image.tmdb.org/t/p/w92${
//                         item.poster_path || item.profile_path
//                       }`}
//                       alt={item.title || item.name || 'Media'}
//                       className="w-10 h-14 object-cover rounded-md"
//                     />
//                   ) : (
//                     <div className="w-10 h-14 bg-gray-200 rounded-md" />
//                   )}

//                   {/* Title + type */}
//                   <div>
//                     <p className="text-gray-800 text-sm font-medium">
//                       {item.title || item.name}
//                     </p>
//                     <p className="text-xs text-gray-500 capitalize">
//                       {item.media_type}
//                     </p>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

