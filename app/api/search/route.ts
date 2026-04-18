import type { NextRequest } from "next/server";
import { jsonError, jsonOk } from "../_lib/responses";

import { searchMovies } from "@/services/tmdb/search";
export type { SearchMovie } from "@/services/tmdb/search";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query")?.trim() || null;
  if (!query) {
    return jsonError("Missing search query", 400);
  }

  const pageParam = request.nextUrl.searchParams.get("page");
  const parsedPage = pageParam !== null ? Number.parseInt(pageParam, 10) : NaN;
  const page = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);

  try {
    const response = await searchMovies(query, { page });
    return jsonOk(response);
  } catch (error) {
    return jsonError("TMDB search failed", 502, {
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
