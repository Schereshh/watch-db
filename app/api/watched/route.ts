import { jsonError, jsonOk } from "@/app/api/_lib/responses";
import { createClient } from "@/lib/supabase/server";
import { getMovieDetails } from "@/services/tmdb/movie";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Authentication required", 401);
  }

  const { data: watchedRows, error: watchedError } = await supabase
    .from("watched")
    .select("tmdb_movie_id, rating, watched_at, logged_at")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false });

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

  return jsonOk({ movies: resolvedWatchedMovies });
}