"use client";

import { FormEvent, useEffect, useState } from "react";

import RatingInput from "@/components/rating-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export type MarkWatchedDraft = {
  rating: number;
  watchedAt: string | null;
};

type MarkWatchedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialRating?: number | null;
  initialWatchedAt?: string | null;
  isSaving?: boolean;
  errorMessage?: string | null;
  onSave: (draft: MarkWatchedDraft) => void;
};

function getTodayDateInputValue() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 10);
}

export default function MarkWatchedDialog({
  open,
  onOpenChange,
  initialRating = null,
  initialWatchedAt = null,
  isSaving = false,
  errorMessage = null,
  onSave,
}: MarkWatchedDialogProps) {
  const [rating, setRating] = useState<number | null>(initialRating);
  const [watchedAt, setWatchedAt] = useState(
    initialWatchedAt ?? getTodayDateInputValue(),
  );
  const [showRatingError, setShowRatingError] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setRating(initialRating);
    setWatchedAt(initialWatchedAt ?? getTodayDateInputValue());
    setShowRatingError(false);
  }, [initialRating, initialWatchedAt, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rating === null) {
      setShowRatingError(true);
      return;
    }

    onSave({
      rating,
      watchedAt: watchedAt || null,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSaving) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Log watched movie</DialogTitle>
            <DialogDescription>
              Choose your rating and the date you watched it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <span className="text-sm font-medium">Your rating</span>
            <RatingInput
              value={rating}
              onChange={(nextRating) => {
                setRating(nextRating);
                setShowRatingError(false);
              }}
              disabled={isSaving}
              label="Your rating"
            />
            {showRatingError && (
              <p className="text-sm text-destructive">
                Select a rating before saving.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="watched-at">
              Watched date
            </label>
            <Input
              id="watched-at"
              type="date"
              value={watchedAt}
              max={getTodayDateInputValue()}
              disabled={isSaving}
              onChange={(event) => setWatchedAt(event.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
