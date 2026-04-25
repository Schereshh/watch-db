"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchWatchlistMovies,
  getWatchlistMoviesQueryKey,
} from "@/services/watchlist";

export function useWatchlistMoviesQuery() {
  return useQuery({
    queryKey: getWatchlistMoviesQueryKey(),
    queryFn: fetchWatchlistMovies,
  });
}