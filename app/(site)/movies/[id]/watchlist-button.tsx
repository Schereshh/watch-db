"use client";

import { useState } from "react";

import AuthRequiredDialog from "@/components/auth-required-dialog";
import { useWatchlistMutation } from "@/hooks/mutations/use-watchlist-mutation";
import { useWatchlistQuery } from "@/hooks/queries/use-watchlist-query";
import { Button } from "@/components/ui/button";

type WatchlistButtonProps = {
  movieId: number;
};

export default function WatchlistButton({ movieId }: WatchlistButtonProps) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const watchlistQuery = useWatchlistQuery(movieId);
  const mutation = useWatchlistMutation(movieId);

  const watchlistState = watchlistQuery.data;

  if (watchlistQuery.isPending && !watchlistState) {
    return null;
  }

  const handleClick = () => {
    if (!watchlistState?.authenticated) {
      setIsAuthDialogOpen(true);
      return;
    } else {
      mutation.mutate(watchlistState.inWatchlist);
    }
  };

  const label = watchlistState?.inWatchlist
    ? "Remove from Watchlist"
    : "Add to Watchlist";

  return (
    <>
      <Button
        type="button"
        variant={watchlistState?.inWatchlist ? "secondary" : "default"}
        aria-busy={mutation.isPending}
        onClick={handleClick}
      >
        {label}
      </Button>
      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        actionLabel="save movies to your watchlist"
      />
    </>
  );
}
