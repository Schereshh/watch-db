import { unstable_cache } from "next/cache";

import { createTmdbClient } from "./client";

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  vote_count: number;
  status: string;
  original_language: string;
  genres: TmdbGenre[];
};

export type MovieDetails = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  runtime: number | null;
  voteAverage: number;
  voteCount: number;
  status: string;
  originalLanguage: string;
  genres: { id: number; name: string }[];
};

const getCachedMovieDetails = unstable_cache(
  async (movieId: number): Promise<MovieDetails> => {
    const accessToken = process.env.TMDB_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("TMDB_ACCESS_TOKEN is not set");
    }

    const client = createTmdbClient({ accessToken });

    const raw = await client.request<TmdbMovieDetails>(`/movie/${movieId}`, {
      language: "en-US",
    });

    return {
      id: raw.id,
      title: raw.title,
      tagline: raw.tagline,
      overview: raw.overview,
      posterPath: raw.poster_path,
      backdropPath: raw.backdrop_path,
      releaseDate: raw.release_date,
      runtime: raw.runtime,
      voteAverage: raw.vote_average,
      voteCount: raw.vote_count,
      status: raw.status,
      originalLanguage: raw.original_language,
      genres: raw.genres,
    };
  },
  ["tmdb-movie-details"],
  {
    revalidate: 60 * 60 * 24,
  },
);

export async function getMovieDetails(movieId: number): Promise<MovieDetails> {
  return getCachedMovieDetails(movieId);
}
