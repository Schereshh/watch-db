"use client";

import { useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { goToPage } from "./actions";

type PaginationButtonsProps = {
  query: string;
  page: number;
  totalPages: number;
  totalResults: number;
};

export function PaginationButtons({
  query,
  page,
  totalPages,
  totalResults,
}: PaginationButtonsProps) {
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const handlePrevious = () => {
    if (page > 1) {
      startTransition(() => goToPage(query, page - 1));
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      startTransition(() => goToPage(query, page + 1));
    }
  };

  return (
    <div className="mb-12 pt-12 flex items-center w-full justify-between">
      <Button
        variant="outline"
        onClick={handlePrevious}
        disabled={page <= 1 || isPending}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages} ({totalResults} results)
      </span>
      <Button
        variant="outline"
        onClick={handleNext}
        disabled={page >= totalPages || isPending}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
