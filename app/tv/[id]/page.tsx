import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
if (!TMDB_API_KEY) {
  console.warn("NEXT_PUBLIC_TMDB_API_KEY is missing. The page will not fetch TMDB data.");
}

/** Generic typed TMDB fetch helper */
async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean> = {}
): Promise<T> {
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.set("api_key", String(TMDB_API_KEY));
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function getWatchProviders(
  providers: TmdbProvidersResponse,
  country = "US"
): TmdbProvidersResponse["results"][string] | null {
  return providers?.results?.[country] ?? providers?.results?.["US"] ?? null;
}

/* --- TMDB Response Types --- */
interface TmdbTvDetails {
  id: number;
  name: string;
  original_name?: string;
  overview?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  first_air_date?: string;
  last_air_date?: string;
  episode_run_time?: number[];
  seasons?: { id: number; name: string; poster_path?: string; episode_count: number }[];
  created_by?: { id: number; name: string }[];
}

interface TmdbProvidersResponse {
  results: Record<string, { link?: string; flatrate?: { provider_name: string }[] }>;
}

interface TmdbRecommendationsResponse {
  results: { id: number; name: string; poster_path?: string; vote_average?: number }[];
}

/* --- Main Page Component --- */
export default async function TvPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Removed unused data like credits, videos, images, similar
    const [details, providers, recommendations]: [
      TmdbTvDetails,
      TmdbProvidersResponse,
      TmdbRecommendationsResponse
    ] = await Promise.all([
      tmdbFetch<TmdbTvDetails>(`/tv/${id}`),
      tmdbFetch<TmdbProvidersResponse>(`/tv/${id}/watch/providers`),
      tmdbFetch<TmdbRecommendationsResponse>(`/tv/${id}/recommendations`),
    ]);

    const config = { base_image: "https://image.tmdb.org/t/p/original" };
    const backdrop = details.backdrop_path ? `${config.base_image}${details.backdrop_path}` : null;
    const poster = details.poster_path ? `${config.base_image}${details.poster_path}` : null;

    const provider = getWatchProviders(providers, "US");
    const creatorNames = details.created_by?.map((c) => c.name).join(", ");

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 pt-[50px]">
        <div className="relative">
          {backdrop && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backdrop}
                alt={`${details.name} backdrop`}
                fill
                style={{ objectFit: "cover", opacity: 0.25 }}
                priority
              />
            </div>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Poster + Info */}
            <div className="md:col-span-4">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                {poster ? (
                  <Image src={poster} alt={details.name} width={500} height={750} />
                ) : (
                  <div className="bg-gray-800 p-10 text-center text-gray-400">No Poster</div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                {provider?.flatrate && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-emerald-600 text-xs rounded">Now Streaming</span>
                    <a href={provider.link} target="_blank" rel="noreferrer" className="underline">
                      Watch on provider
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <div>
                    <div className="text-xl font-bold">{details.name}</div>
                    <div className="text-xs text-gray-400">
                      {details.original_name && details.original_name !== details.name
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
              </div>
            </div>

            {/* Main Details */}
            <div className="md:col-span-8">
              <h1 className="text-3xl font-extrabold mb-2">{details.name}</h1>
              {details.tagline && (
                <p className="text-gray-400 italic mb-4">&quot;{details.tagline}&quot;</p>
              )}
              <p className="text-gray-300 mb-4">{details.overview}</p>

              {creatorNames && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold">Created By</h4>
                  <p>{creatorNames}</p>
                </div>
              )}

              {/* Recommendations */}
              {recommendations.results.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-semibold mb-3">Recommendations</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {recommendations.results.slice(0, 12).map((r) => (
                      <Link
                        key={r.id}
                        href={`/tv/${r.id}`}
                        className="bg-gray-800 rounded overflow-hidden p-2 text-center text-sm hover:bg-gray-700 transition"
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
                          <div className="h-36 flex items-center justify-center text-gray-500">
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
              )}
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
