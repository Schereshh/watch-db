"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchWatchedState, getWatchedQueryKey } from "@/services/watched";

export function useWatchedQuery(movieId: number) {
  return useQuery({
    queryKey: getWatchedQueryKey(movieId),
    queryFn: () => fetchWatchedState(movieId),
  });
}