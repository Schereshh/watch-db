"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchWatchedMovies,
  getWatchedMoviesQueryKey,
} from "@/services/watched";

export function useWatchedMoviesQuery() {
  return useQuery({
    queryKey: getWatchedMoviesQueryKey(),
    queryFn: fetchWatchedMovies,
  });
}