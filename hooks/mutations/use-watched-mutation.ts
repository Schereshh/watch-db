"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getWatchlistQueryKey,
  type WatchlistState,
} from "@/services/watchlist";
import {
  getWatchedQueryKey,
  markAsWatched,
  removeFromWatched,
  type WatchedState,
} from "@/services/watched";

type MarkWatchedInput = {
  rating?: number | null;
  watchedAt?: string | null;
};

type WatchedMutationVariables =
  | {
      isWatched: true;
    }
  | ({
      isWatched: false;
    } & MarkWatchedInput);

export function useWatchedMutation(movieId: number) {
  const queryClient = useQueryClient();
  const queryKey = getWatchedQueryKey(movieId);
  const watchlistQueryKey = getWatchlistQueryKey(movieId);

  return useMutation({
    mutationFn: (variables: WatchedMutationVariables) =>
      variables.isWatched
        ? removeFromWatched(movieId)
        : markAsWatched(movieId, {
            rating: variables.rating,
            watchedAt: variables.watchedAt,
          }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });
      await queryClient.cancelQueries({ queryKey: watchlistQueryKey });

      const previousState = queryClient.getQueryData<WatchedState>(queryKey);
      const previousWatchlistState = queryClient.getQueryData<WatchlistState>(
        watchlistQueryKey,
      );

      queryClient.setQueryData<WatchedState>(queryKey, (currentState) => {
        const baseState = currentState ?? previousState;

        if (variables.isWatched) {
          return {
            authenticated: baseState?.authenticated ?? true,
            isWatched: false,
            rating: null,
            watchedAt: null,
            loggedAt: null,
          };
        }

        return {
          authenticated: baseState?.authenticated ?? true,
          isWatched: true,
          rating: variables.rating ?? null,
          watchedAt: variables.watchedAt ?? null,
          loggedAt: baseState?.loggedAt ?? null,
        };
      });

      if (!variables.isWatched) {
        queryClient.setQueryData<WatchlistState>(watchlistQueryKey, (currentState) => {
          const baseState = currentState ?? previousWatchlistState;

          return {
            authenticated: baseState?.authenticated ?? true,
            inWatchlist: false,
          };
        });
      }

      return { previousState, previousWatchlistState };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }

      if (context?.previousWatchlistState) {
        queryClient.setQueryData(watchlistQueryKey, context.previousWatchlistState);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watched"] });
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}