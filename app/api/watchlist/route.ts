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

  const { data: watchlistRows, error: watchlistError } = await supabase
    .from("watchlist")
    .select("tmdb_movie_id, added_at")
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  if (watchlistError) {
    return jsonError("Failed to load watchlist", 500, {
      message: watchlistError.message,
    });
  }

  const watchlistMovies = await Promise.allSettled(
    (watchlistRows ?? []).map(async (row) => {
      const movie = await getMovieDetails(row.tmdb_movie_id);

      return {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath,
        addedAt: row.added_at,
      };
    }),
  );

  const resolvedWatchlistMovies = watchlistMovies.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  return jsonOk({ movies: resolvedWatchlistMovies });
}