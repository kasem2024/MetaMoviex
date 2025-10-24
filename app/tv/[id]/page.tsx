// app/tv/[id]/page.tsx
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
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } }); // cache for 1 hour
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

function formatAirDates(first_air_date?: string, last_air_date?: string) {
  if (!first_air_date) return "";
  const start = new Date(first_air_date).getFullYear();
  const end = last_air_date ? new Date(last_air_date).getFullYear() : "Present";
  return start === end ? `${start}` : `${start}–${end}`;
}

function formatRuntime(mins?: number) {
  if (!mins) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h > 0 ? `${h}h ` : ""}${m}m`;
}

function getWatchProviders(providers: any, country = "US") {
  return providers?.results?.[country] ?? providers?.results?.["US"] ?? null;
}

export default async function TvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Fetch TV show data from multiple TMDB endpoints
    const [details, credits, videos, images, providers, recommendations, similar] =
      await Promise.all([
        tmdbFetch(`/tv/${id}`),
        tmdbFetch(`/tv/${id}/credits`),
        tmdbFetch(`/tv/${id}/videos`),
        tmdbFetch(`/tv/${id}/images`, { include_image_language: "en,null" }),
        tmdbFetch(`/tv/${id}/watch/providers`),
        tmdbFetch(`/tv/${id}/recommendations`),
        tmdbFetch(`/tv/${id}/similar`),
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

    const provider = getWatchProviders(providers, "US");
    const trailer = videos?.results?.find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer"
    );

    const creatorNames = details.created_by?.map((c: any) => c.name).join(", ");

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-[50px] lg:pt-[50px]">
        {/* Hero Section */}
        <div className="relative">
          {backdrop && (
            <div className="absolute inset-0 z-0">
              <div className="relative h-96 w-full">
                <Image
                  src={backdrop}
                  alt={`${details.name} backdrop`}
                  fill
                  style={{ objectFit: "cover", opacity: 0.25 }}
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
                    alt={details.name}
                    width={500}
                    height={750}
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <div className="bg-gray-800 text-gray-400 p-10 flex items-center justify-center">
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
                      href={provider.link}
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
                    <div className="text-xl font-bold">{details.name}</div>
                    <div className="text-xs text-gray-400">
                      {details.original_name &&
                        details.original_name !== details.name
                        ? details.original_name
                        : ""}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-300">
                      User<br />Score
                    </div>
                    <div className="text-2xl font-semibold">
                      {Math.round((details.vote_average ?? 0) * 10)}%
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                  <div className="px-2 py-1 bg-gray-800 rounded">
                    {details.adult ? "16+" : "TV-14"}
                  </div>
                  <div>{formatAirDates(details.first_air_date, details.last_air_date)}</div>
                  <div>•</div>
                  <div>{details.genres?.map((g: any) => g.name).join(", ")}</div>
                  {details.episode_run_time?.length > 0 && (
                    <>
                      <div>•</div>
                      <div>{formatRuntime(details.episode_run_time[0])} / ep</div>
                    </>
                  )}
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
                  {details.name}{" "}
                  <span className="text-gray-400 font-normal">
                    ({formatAirDates(details.first_air_date, details.last_air_date)})
                  </span>
                </h1>
                <div className="mt-3 text-gray-300">
                  {details.tagline && <em>"{details.tagline}"</em>}
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                <h3>Overview</h3>
                <p>{details.overview}</p>

                {creatorNames && (
                  <>
                    <h4 className="mt-6">Created By</h4>
                    <p>{creatorNames}</p>
                  </>
                )}

                {/* Next Episode Info */}
                {details.next_episode_to_air && (
                  <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">Next Episode</h4>
                    <div className="text-sm">
                      <strong>{details.next_episode_to_air.name}</strong> — Season{" "}
                      {details.next_episode_to_air.season_number}, Episode{" "}
                      {details.next_episode_to_air.episode_number}
                      <br />
                      Airs on:{" "}
                      {new Date(details.next_episode_to_air.air_date).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {/* Seasons Section */}
                <div className="mt-6">
                  <h4>Seasons</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {details.seasons?.map((s: any) => (
                      <div key={s.id} className="bg-gray-800 rounded-lg p-3 text-sm">
                        {s.poster_path ? (
                          <Image
                            src={`${config.base_image}${s.poster_path}`}
                            alt={s.name}
                            width={300}
                            height={450}
                            className="rounded mb-2"
                          />
                        ) : (
                          <div className="h-48 bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                        <div className="font-semibold">{s.name}</div>
                        <div className="text-gray-400">
                          {s.episode_count} episodes
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cast */}
                <div className="mt-8">
                  <h4>Top Billed Cast</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {credits?.cast?.slice(0, 8).map((c: any) => (
                      <div
                        key={c.cast_id || c.credit_id}
                        className="bg-gray-800 rounded-lg p-3 text-sm"
                      >
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-gray-400">{c.character}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8">
                  <h4>Recommendations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {recommendations?.results?.slice(0, 12).map((r: any) => (
                      <Link
                        key={r.id}
                        href={`/tv/${r.id}`}
                        className="block bg-gray-800 rounded overflow-hidden p-2 text-center text-sm"
                      >
                        {r.poster_path ? (
                          <Image
                            src={`${config.base_image}${r.poster_path}`}
                            alt={r.name}
                            width={200}
                            height={300}
                            style={{ width: "100%", height: "auto" }}
                          />
                        ) : (
                          <div className="h-36 flex items-center justify-center">
                            No Image
                          </div>
                        )}
                        <div className="mt-2">{r.name}</div>
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
          Data provided by TMDB. Built with ❤️ for MetaMoviex.
        </footer>
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
