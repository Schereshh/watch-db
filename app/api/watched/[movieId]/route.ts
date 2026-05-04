import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/app/api/_lib/responses";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ movieId: string }>;
};

type WatchedRequestBody = {
  rating?: unknown;
  watchedAt?: unknown;
};

function parseMovieId(rawMovieId: string) {
  const movieId = Number.parseInt(rawMovieId, 10);

  if (Number.isNaN(movieId) || movieId < 1) {
    return null;
  }

  return movieId;
}

function parseRating(rawRating: unknown) {
  if (rawRating === undefined || rawRating === null) {
    return null;
  }

  if (typeof rawRating !== "number") {
    return null;
  }

  if (!Number.isInteger(rawRating) || rawRating < 1 || rawRating > 5) {
    return null;
  }

  return rawRating;
}

function parseWatchedAt(rawWatchedAt: unknown) {
  if (rawWatchedAt === undefined || rawWatchedAt === null || rawWatchedAt === "") {
    return null;
  }

  if (typeof rawWatchedAt !== "string") {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawWatchedAt)) {
    return null;
  }

  const parsedDate = new Date(`${rawWatchedAt}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return rawWatchedAt;
}

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

function revalidateWatchedPaths(movieId: number) {
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
    return jsonOk({
      authenticated: false,
      isWatched: false,
      rating: null,
      watchedAt: null,
      loggedAt: null,
    });
  }

  const { data, error } = await supabase
    .from("watched")
    .select("rating, watched_at, logged_at")
    .eq("user_id", user.id)
    .eq("tmdb_movie_id", movieId)
    .order("logged_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return jsonError("Failed to load watched state", 500, {
      message: error.message,
    });
  }

  return jsonOk({
    authenticated: true,
    isWatched: Boolean(data),
    rating: data?.rating ?? null,
    watchedAt: data?.watched_at ?? null,
    loggedAt: data?.logged_at ?? null,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { movieId: rawMovieId } = await context.params;
  const movieId = parseMovieId(rawMovieId);

  if (movieId === null) {
    return jsonError("Invalid movie id", 400);
  }

  const body = (await request.json().catch(() => ({}))) as WatchedRequestBody;
  const rating = parseRating(body.rating);
  const watchedAt = parseWatchedAt(body.watchedAt);

  if (body.rating !== undefined && body.rating !== null && rating === null) {
    return jsonError("Rating must be an integer between 1 and 5", 400);
  }

  if (
    body.watchedAt !== undefined &&
    body.watchedAt !== null &&
    body.watchedAt !== "" &&
    watchedAt === null
  ) {
    return jsonError("watchedAt must be a valid YYYY-MM-DD date", 400);
  }

  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return jsonError("Authentication required", 401);
  }

  const payload: {
    user_id: string;
    tmdb_movie_id: number;
    rating?: number | null;
    watched_at?: string | null;
  } = {
    user_id: user.id,
    tmdb_movie_id: movieId,
  };

  if (rating !== null) {
    payload.rating = rating;
  }

  if (watchedAt !== null) {
    payload.watched_at = watchedAt;
  }

  const { data, error } = await supabase
    .from("watched")
    .insert(payload)
    .select("rating, watched_at, logged_at")
    .single();

  if (error) {
    return jsonError("Failed to mark movie as watched", 500, {
      message: error.message,
    });
  }

  const { error: watchlistError } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", user.id)
    .eq("tmdb_movie_id", movieId);

  let warning: string | undefined;

  if (watchlistError) {
    console.error("Failed to remove watched movie from watchlist", {
      userId: user.id,
      movieId,
      message: watchlistError.message,
    });
    warning = "Movie was marked as watched, but removing it from watchlist failed.";
  }

  revalidateWatchedPaths(movieId);

  return jsonOk(
    {
      authenticated: true,
      isWatched: true,
      rating: data.rating ?? null,
      watchedAt: data.watched_at ?? null,
      loggedAt: data.logged_at ?? null,
      ...(warning ? { warning } : {}),
    },
    { status: 201 },
  );
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
    .from("watched")
    .delete()
    .eq("user_id", user.id)
    .eq("tmdb_movie_id", movieId);

  if (error) {
    return jsonError("Failed to remove watched movie", 500, {
      message: error.message,
    });
  }

  revalidateWatchedPaths(movieId);

  return jsonOk({
    authenticated: true,
    isWatched: false,
    rating: null,
    watchedAt: null,
    loggedAt: null,
  });
}