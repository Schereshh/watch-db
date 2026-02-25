import { createTmdbClient } from "./client";

type TmdbSearchMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
};

type TmdbSearchResponse = {
  page: number;
  results: TmdbSearchMovie[];
  total_pages: number;
  total_results: number;
};

type SearchOptions = {
  page?: number;
  includeAdult?: boolean;
  language?: string;
};

export async function searchMovies(query: string, options: SearchOptions = {}) {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("TMDB_ACCESS_TOKEN is not set");
  }

  const client = createTmdbClient({ accessToken });

  return client.request<TmdbSearchResponse>("/search/movie", {
    query,
    page: options.page ?? 1,
    include_adult: options.includeAdult ?? false,
    language: options.language ?? "en-US",
  });
}
