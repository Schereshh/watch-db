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
    <div className="mb-12 mt-8 flex flex-col gap-3 rounded-md border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="text-center text-sm text-stone-500">
        Page <span className="font-medium text-stone-900">{page}</span> of{" "}
        <span className="font-medium text-stone-900">{totalPages}</span>
        <span className="hidden sm:inline">
          {" "}
          ({totalResults.toLocaleString()} results)
        </span>
      </span>
      <div className="grid grid-cols-2 gap-3 sm:contents">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={page <= 1 || isPending}
          className="w-full border-stone-300 bg-white text-stone-800 hover:bg-stone-100 sm:order-first sm:w-auto"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNext}
          disabled={page >= totalPages || isPending}
          className="w-full border-stone-300 bg-white text-stone-800 hover:bg-stone-100 sm:order-last sm:w-auto"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
