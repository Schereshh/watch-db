import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "../_lib/responses";

import { searchMovies } from "@/services/tmdb/search";

type SearchMovie = {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string;
  voteAverage: number;
};

export async function GET(request: NextRequest) {
  const query =
    (request.nextUrl.searchParams.get("query") ??
      request.nextUrl.searchParams.get("q"))?.trim() || null;
  if (!query) {
    return jsonError("Missing search query", 400);
  }

  const pageParam = request.nextUrl.searchParams.get("page");
  const page = pageParam ? Math.max(1, Math.floor(Number(pageParam))) : 1;

  try {
    const response = await searchMovies(query, { page });
    const results: SearchMovie[] = response.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    }));

    return jsonOk({
      page: response.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
      results,
    });
  } catch (error) {
    return jsonError("TMDB search failed", 502, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
