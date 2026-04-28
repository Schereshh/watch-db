"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  DEFAULT_WATCHED_MOVIES_PAGE_SIZE,
  fetchWatchedMovies,
  getWatchedMoviesQueryKey,
} from "@/services/watched";

export function useWatchedMoviesQuery() {
  return useInfiniteQuery({
    queryKey: getWatchedMoviesQueryKey(),
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchWatchedMovies({
        page: pageParam,
        limit: DEFAULT_WATCHED_MOVIES_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}