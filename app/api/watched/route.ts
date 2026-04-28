import { jsonError, jsonOk } from "@/app/api/_lib/responses";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetails } from "@/services/tmdb/movie";

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 50;

function parsePositiveInteger(value: string | null, fallback: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parsePositiveInteger(searchParams.get("page"), 1);
  const requestedLimit = parsePositiveInteger(
    searchParams.get("limit"),
    DEFAULT_PAGE_SIZE,
  );

  if (page === null || requestedLimit === null) {
    return jsonError("Invalid pagination parameters", 400);
  }

  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE);
  const from = (page - 1) * limit;
  const to = from + limit;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Authentication required", 401);
  }

  const {
    data: watchedRows,
    error: watchedError,
    count: watchedCount,
  } = await supabase
    .from("watched")
    .select("tmdb_movie_id, rating, watched_at, logged_at", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .range(from, to);

  if (watchedError) {
    return jsonError("Failed to load watched movies", 500, {
      message: watchedError.message,
    });
  }

  const watchedMovies = await Promise.allSettled(
    (watchedRows ?? []).map(async (row) => {
      const movie = await getMovieDetails(row.tmdb_movie_id);

      return {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        rating: row.rating,
        watchedAt: row.watched_at,
        loggedAt: row.logged_at,
      };
    }),
  );

  const resolvedWatchedMovies = watchedMovies.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  const totalCount = watchedCount ?? 0;
  const hasMore = watchedRows !== null && watchedRows.length > limit;

  return jsonOk({
    movies: resolvedWatchedMovies.slice(0, limit),
    page,
    pageSize: limit,
    totalCount,
    nextPage: hasMore ? page + 1 : null,
  });
}