"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addToWatchlist, getWatchlistQueryKey,
  removeFromWatchlist,
  type WatchlistState
} from "@/services/watchlist";

export function useWatchlistMutation(movieId: number) {
  const queryClient = useQueryClient();
  const queryKey = getWatchlistQueryKey(movieId);

  return useMutation({
    mutationFn: (isInWatchlist: boolean) =>
      isInWatchlist ? removeFromWatchlist(movieId) : addToWatchlist(movieId),
    onMutate: async (isInWatchlist) => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<WatchlistState>(queryKey);

      queryClient.setQueryData<WatchlistState>(queryKey, (currentState) => {
        const baseState = currentState ?? previousState;

        if (!baseState) {
          return {
            authenticated: true,
            inWatchlist: !isInWatchlist,
          };
        }

        return {
          ...baseState,
          inWatchlist: !isInWatchlist,
        };
      });

      return { previousState };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}