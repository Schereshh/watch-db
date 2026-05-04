"use client";

import { useState } from "react";

import AuthRequiredDialog from "@/components/auth-required-dialog";
import { Button } from "@/components/ui/button";
import { useWatchedMutation } from "@/hooks/mutations/use-watched-mutation";
import { useWatchedQuery } from "@/hooks/queries/use-watched-query";

type WatchedButtonProps = {
  movieId: number;
};

export default function WatchedButton({ movieId }: WatchedButtonProps) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const watchedQuery = useWatchedQuery(movieId);
  const mutation = useWatchedMutation(movieId);

  const watchedState = watchedQuery.data;

  if (watchedQuery.isPending && !watchedState) {
    return null;
  }

  if (watchedQuery.isError) {
    return (
      <Button type="button" variant="outline" disabled>
        Mark as Watched
      </Button>
    );
  }

  const handleClick = () => {
    if (!watchedState?.authenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (watchedState.isWatched) {
      mutation.mutate({ isWatched: true });
      return;
    }

    mutation.mutate({ isWatched: false });
  };

  const label = watchedState?.isWatched ? "Remove from Watched" : "Mark as Watched";

  return (
    <>
      <Button
        type="button"
        variant={watchedState?.isWatched ? "secondary" : "outline"}
        aria-busy={mutation.isPending}
        disabled={mutation.isPending}
        onClick={handleClick}
      >
        {label}
      </Button>
      <AuthRequiredDialog
        open={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        actionLabel="mark movies as watched"
      />
    </>
  );
}