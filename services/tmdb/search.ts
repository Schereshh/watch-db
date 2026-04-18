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

export type SearchMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

export type SearchMoviesResponse = {
  page: number;
  results: SearchMovie[];
  totalPages: number;
  totalResults: number;
};

type SearchOptions = {
  page?: number;
  includeAdult?: boolean;
  language?: string;
};

export async function searchMovies(
  query: string,
  options: SearchOptions = {},
): Promise<SearchMoviesResponse> {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("TMDB_ACCESS_TOKEN is not set");
  }

  const client = createTmdbClient({ accessToken });

  const raw = await client.request<TmdbSearchResponse>("/search/movie", {
    query,
    page: options.page ?? 1,
    include_adult: options.includeAdult ?? false,
    language: options.language ?? "en-US",
  });

  return {
    page: raw.page,
    totalPages: raw.total_pages,
    totalResults: raw.total_results,
    results: raw.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    })),
  };
}
