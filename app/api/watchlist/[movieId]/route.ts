import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/app/api/_lib/responses";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ movieId: string }>;
};

function parseMovieId(rawMovieId: string) {
  const movieId = Number.parseInt(rawMovieId, 10);

  if (Number.isNaN(movieId) || movieId < 1) {
    return null;
  }

  return movieId;
}

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

function revalidateWatchlistPaths(movieId: number) {
  revalidatePath(`/movies/${movieId}`);
  revalidatePath("/profile");
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { movieId: rawMovieId } = await context.params;
  const movieId = parseMovieId(rawMovieId);

  if (movieId === null) {
    return jsonError("Invalid movie id", 400);
  }

  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return jsonOk({ authenticated: false, inWatchlist: false });
  }

  const { data, error } = await supabase
    .from("watchlist")
    .select("id")
    .eq("user_id", user.id)
    .eq("tmdb_movie_id", movieId)
    .maybeSingle();

  if (error) {
    return jsonError("Failed to load watchlist state", 500, {
      message: error.message,
    });
  }

  return jsonOk({ authenticated: true, inWatchlist: Boolean(data) });
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { movieId: rawMovieId } = await context.params;
  const movieId = parseMovieId(rawMovieId);

  if (movieId === null) {
    return jsonError("Invalid movie id", 400);
  }

  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return jsonError("Authentication required", 401);
  }

  const { error } = await supabase.from("watchlist").upsert(
    {
      user_id: user.id,
      tmdb_movie_id: movieId,
    },
    {
      onConflict: "user_id,tmdb_movie_id",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    return jsonError("Failed to add movie to watchlist", 500, {
      message: error.message,
    });
  }

  revalidateWatchlistPaths(movieId);

  return jsonOk({ authenticated: true, inWatchlist: true }, { status: 201 });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { movieId: rawMovieId } = await context.params;
  const movieId = parseMovieId(rawMovieId);

  if (movieId === null) {
    return jsonError("Invalid movie id", 400);
  }

  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return jsonError("Authentication required", 401);
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("tmdb_movie_id", movieId);

  if (error) {
    return jsonError("Failed to remove movie from watchlist", 500, {
      message: error.message,
    });
  }

  revalidateWatchlistPaths(movieId);

  return jsonOk({ authenticated: true, inWatchlist: false });
}