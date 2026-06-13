"use client";

import { useState } from "react";

import AuthRequiredDialog from "@/components/auth-required-dialog";
import { Button } from "@/components/ui/button";
import { useWatchedMutation } from "@/hooks/mutations/use-watched-mutation";
import { useWatchedQuery } from "@/hooks/queries/use-watched-query";

import MarkWatchedDialog, {
  type MarkWatchedDraft,
} from "./mark-watched-dialog";

type WatchedButtonProps = {
  movieId: number;
};

export default function WatchedButton({ movieId }: WatchedButtonProps) {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isMarkWatchedDialogOpen, setIsMarkWatchedDialogOpen] = useState(false);
  const watchedQuery = useWatchedQuery(movieId);
  const mutation = useWatchedMutation(movieId);

  const watchedState = watchedQuery.data;
  const isWatched = Boolean(watchedState?.isWatched);

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

    mutation.reset();
    setIsMarkWatchedDialogOpen(true);
  };

  const handleMarkWatchedSave = (draft: MarkWatchedDraft) => {
    mutation.mutate(
      {
        isWatched: false,
        rating: draft.rating,
        watchedAt: draft.watchedAt,
      },
      {
        onSuccess: () => {
          setIsMarkWatchedDialogOpen(false);
        },
      },
    );
  };

  const label = isWatched ? "Remove from Watched" : "Mark as Watched";
  const markWatchedError =
    mutation.error instanceof Error ? mutation.error.message : null;

  return (
    <>
      <Button
        type="button"
        variant={isWatched ? "secondary" : "outline"}
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
      <MarkWatchedDialog
        open={isMarkWatchedDialogOpen}
        onOpenChange={setIsMarkWatchedDialogOpen}
        initialRating={watchedState?.rating}
        initialWatchedAt={watchedState?.watchedAt}
        isSaving={mutation.isPending}
        errorMessage={markWatchedError}
        onSave={handleMarkWatchedSave}
      />
    </>
  );
}
