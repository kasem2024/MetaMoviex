// app/movie/[id]/page.tsx (Next.js 13+ App Router)
// Server Component with Tailwind styling
// Requires: NEXT_PUBLIC_TMDB_API_KEY in .env
// Uses server-side fetch() calls (no getServerSideProps)

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!TMDB_API_KEY) {
  console.warn("NEXT_PUBLIC_TMDB_API_KEY is missing. The page will not fetch TMDB data.");
}

async function tmdbFetch(path: string, params: Record<string, string | number | boolean> = {}) {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("api_key", String(TMDB_API_KEY));
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), { next: { revalidate: 60 * 60 } }); // revalidate every hour
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

function formatRuntime(mins?: number) {
  if (!mins) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h > 0 ? `${h}h ` : ""}${m}m`;
}

function getReleaseDateForCountry(release_dates: any, country = "US") {
  const entry = release_dates?.results?.find((r: any) => r.iso_3166_1 === country);
  const rd = entry?.release_dates?.[0];
  return rd?.release_date ? new Date(rd.release_date).toLocaleDateString() : null;
}

function getWatchProviders(providers: any, country = "US") {
  return providers?.results?.[country] ?? providers?.results?.["US"] ?? null;
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const [details, credits, videos, images, release_dates, providers, recommendations] =
      await Promise.all([
        tmdbFetch(`/movie/${id}`),
        tmdbFetch(`/movie/${id}/credits`),
        tmdbFetch(`/movie/${id}/videos`),
        tmdbFetch(`/movie/${id}/images`, { include_image_language: "en,null" }),
        tmdbFetch(`/movie/${id}/release_dates`),
        tmdbFetch(`/movie/${id}/watch/providers`),
        tmdbFetch(`/movie/${id}/recommendations`),
      ]);

    const config = {
      base_image: "https://image.tmdb.org/t/p/original",
    };

    const backdrop = details.backdrop_path
      ? `${config.base_image}${details.backdrop_path}`
      : null;
    const poster = details.poster_path
      ? `${config.base_image}${details.poster_path}`
      : null;

    const releaseDateES = getReleaseDateForCountry(release_dates, "ES");
    const releaseDateUS = getReleaseDateForCountry(release_dates, "US");
    const provider = getWatchProviders(providers, "US");
    const director = credits?.crew?.find((c: any) => c.job === "Director");
    const screenplay =
      credits?.crew?.filter((c: any) =>
        /screenplay|writer|adaptation/i.test(c.job || "")
      ) || [];

    const trailer = videos?.results?.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );

    return (
      <div className="min-h-screen bg-zinc-900 text-gray-100 pt-[50px]">
        {/* Hero Section */}
        <div className="relative">
          {backdrop && (
            <div className="absolute inset-0 z-0">
              <div className="relative h-96 w-full">
                <Image
                  src={backdrop}
                  alt={`${details.title} backdrop`}
                  fill
                  style={{ objectFit: "cover", opacity: 0.22 }}
                  priority
                />
              </div>
            </div>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Left Panel */}
            <div className="md:col-span-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl w-full max-w-sm mx-auto">
                {poster ? (
                  <Image
                    src={poster}
                    alt={details.title}
                    width={500}
                    height={750}
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="bg-zinc-800 text-zinc-400 p-10 flex items-center justify-center">
                    No Poster
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {provider?.flatrate && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-600 text-xs rounded">
                      Now Streaming
                    </span>
                    <a
                      href={provider?.link}
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Watch on provider
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold">{details.title}</div>
                    <div className="text-xs text-zinc-300">
                      {details.original_title &&
                        details.original_title !== details.title
                        ? details.original_title
                        : ""}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-zinc-300">
                      User<br />Score
                    </div>
                    <div className="text-2xl font-semibold">
                      {Math.round((details.vote_average ?? 0) * 10)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-zinc-300 flex-wrap">
                  <div className="px-2 py-1 bg-zinc-800 rounded">
                    {details.adult ? "16+" : "PG-13"}
                  </div>
                  <div>{releaseDateES ?? releaseDateUS ?? details.release_date}</div>
                  <div>•</div>
                  <div>{details.genres?.map((g: any) => g.name).join(", ")}</div>
                  <div>•</div>
                  <div>{formatRuntime(details.runtime)}</div>
                </div>

                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-center mt-3"
                  >
                    ▶ Play Trailer
                  </a>
                )}
              </div>
            </div>
            {/* Right Panel */}
            <div className="md:col-span-8">
              <div className="mb-4">
                <h1 className="text-3xl font-extrabold">
                  {details.title}{" "}
                  <span className="text-gray-400 font-normal">
                    ({new Date(details.release_date || details.first_air_date || "")
                      .getFullYear()})
                  </span>
                </h1>
                <div className="mt-3 text-gray-300">
                  {details.tagline && <em>"{details.tagline}"</em>}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3>Overview</h3>
                <p>{details.overview}</p>

                <h4 className="mt-6">Director & Writers</h4>
                <ul className="list-disc ml-6">
                  {director && <li>{director.name} — Director</li>}
                  {screenplay.map((s: any) => (
                    <li key={s.credit_id}>
                      {s.name} — {s.job}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-6">Top Billed Cast</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {credits?.cast?.slice(0, 8).map((c: any) => (
                    <div
                      key={c.cast_id}
                      className="bg-zinc-800 rounded-lg p-3 text-sm"
                    >
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-gray-400">{c.character}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h4>Media</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images?.posters?.slice(0, 4).map((img: any, i: number) => (
                      <div key={i} className="rounded overflow-hidden">
                        <Image
                          src={`${config.base_image}${img.file_path}`}
                          alt={`poster-${i}`}
                          width={300}
                          height={450}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h4>Recommendations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {recommendations?.results?.slice(0, 6).map((r: any) => (
                      <Link
                        key={r.id}
                        href={`/movie/${r.id}`}
                        className="block bg-zinc-800 rounded overflow-hidden p-2 text-center text-sm"
                      >
                        {r.poster_path ? (
                          <Image
                            src={`${config.base_image}${r.poster_path}`}
                            alt={r.title}
                            width={200}
                            height={300}
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : (
                          <div className="h-36 flex items-center justify-center">
                            No Image
                          </div>
                        )}
                        <div className="mt-2">{r.title}</div>
                        <div className="text-xs text-gray-400">
                          {Math.round((r.vote_average ?? 0) * 10)}%
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <footer className="py-6 text-center text-gray-500">
          Data provided by TMDB. Built with ❤️ in MetaMoviex.
        </footer>
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
