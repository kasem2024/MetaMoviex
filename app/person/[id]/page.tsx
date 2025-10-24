// app/person/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!TMDB_API_KEY) console.warn("NEXT_PUBLIC_TMDB_API_KEY missing.");

async function tmdbFetch(path: string, params: Record<string, string | number | boolean> = {}) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("api_key", String(TMDB_API_KEY));
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "-";
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [details, credits] = await Promise.all([
      tmdbFetch(`/person/${id}`),
      tmdbFetch(`/person/${id}/combined_credits`),
    ]);

    const base = "https://image.tmdb.org/t/p/original";
    const profile = details.profile_path ? `${base}${details.profile_path}` : null;

    const genderLabel = ["", "Female", "Male", "Non-binary"][details.gender] || "-";
    const knownForDept = details.known_for_department || "-";
    const knownCredits = (credits.cast?.length ?? 0) + (credits.crew?.length ?? 0);
    const alsoKnownAs = details.also_known_as?.length ? details.also_known_as.join(", ") : "-";
    const contentScore = Math.min(100, Math.floor(Math.random() * 20) + 80); // playful fake score

    // Sort all combined credits by year (descending)
    const allCredits = [...(credits.cast || []), ...(credits.crew || [])].sort((a, b) => {
      const dateA = new Date(a.release_date || a.first_air_date || "1900").getTime();
      const dateB = new Date(b.release_date || b.first_air_date || "1900").getTime();
      return dateB - dateA;
    });

    const knownFor = credits.cast
      ?.filter((c: any) => c.poster_path)
      ?.sort((a: any, b: any) => b.popularity - a.popularity)
      ?.slice(0, 12);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 pt-[50px]">
        {/* Header */}
        <div className="relative">
          {profile && (
            <Image
              src={profile}
              alt={details.name}
              fill
              style={{ objectFit: "cover", opacity: 0.2 }}
              className="absolute inset-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row gap-10">
            {/* Profile Image */}
            <div className="w-64 h-64 md:w-72 md:h-96 relative flex-shrink-0">
              {profile ? (
                <Image
                  src={profile}
                  alt={details.name}
                  width={400}
                  height={600}
                  className="rounded-2xl shadow-xl object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 rounded-2xl flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <h1 className="text-5xl font-extrabold mb-2">{details.name}</h1>
              {details.known_for_department && (
                <p className="text-gray-400 text-lg mb-4">{details.known_for_department}</p>
              )}

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300 max-w-xl">
                <div>
                  <span className="block font-semibold text-gray-200">Known For</span>
                  {knownForDept}
                </div>
                <div>
                  <span className="block font-semibold text-gray-200">Known Credits</span>
                  {knownCredits}
                </div>
                <div>
                  <span className="block font-semibold text-gray-200">Gender</span>
                  {genderLabel}
                </div>
                <div>
                  <span className="block font-semibold text-gray-200">Birthday</span>
                  {formatDate(details.birthday)}
                </div>
                <div>
                  <span className="block font-semibold text-gray-200">Place of Birth</span>
                  {details.place_of_birth || "-"}
                </div>
                <div>
                  <span className="block font-semibold text-gray-200">Also Known As</span>
                  {alsoKnownAs}
                </div>
              </div>

              {/* Content Score */}
              <div className="mt-6 border-t border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Content Score</div>
                    <div className="text-2xl font-bold">{contentScore}</div>
                    <div className="text-gray-500 text-sm">
                      {contentScore > 90 ? "Yes! Looking good!" : "Almost there..."}
                    </div>
                  </div>
                  <button className="text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded hover:bg-gray-700">
                    Edit Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Biography</h2>
          {details.biography ? (
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{details.biography}</p>
          ) : (
            <p className="text-gray-500 italic">We don't have a biography for {details.name}.</p>
          )}
        </div>

        {/* Known For */}
        {knownFor?.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {knownFor.map((item: any) => (
                <Link
                  key={item.id}
                  href={item.media_type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
                  className="group bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition"
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={`${base}${item.poster_path}`}
                      alt={item.title || item.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="p-2 text-center text-sm">
                    <div className="font-semibold group-hover:text-white truncate">
                      {item.title || item.name}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {item.media_type === "movie" ? "Movie" : "TV"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Filmography */}
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold border-b border-gray-700 pb-2 mb-4">Acting Credits</h2>
          {allCredits.length > 0 ? (
            <ul className="divide-y divide-gray-800 text-sm">
              {allCredits.map((c: any, i: number) => (
                <li key={i} className="flex items-start justify-between py-2">
                  <div className="flex-1">
                    <Link
                      href={c.media_type === "movie" ? `/movie/${c.id}` : `/tv/${c.id}`}
                      className="font-semibold hover:underline"
                    >
                      {c.title || c.name}
                    </Link>
                    {c.character && (
                      <span className="text-gray-400"> as {c.character}</span>
                    )}
                  </div>
                  <div className="text-gray-500 text-xs w-16 text-right">
                    {(c.release_date || c.first_air_date || "").slice(0, 4)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No credits found.</p>
          )}
        </div>

        <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800">
          Data provided by TMDB • Built with ❤️ by MetaMoviex
        </footer>
      </div>
    );
  } catch (err) {
    console.error(err);
    notFound();
  }
}
