"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchWatchlistState,
  getWatchlistQueryKey,
} from "@/services/watchlist";

export function useWatchlistQuery(movieId: number) {
  return useQuery({
    queryKey: getWatchlistQueryKey(movieId),
    queryFn: () => fetchWatchlistState(movieId),
  });
}