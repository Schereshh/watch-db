"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

type RatingInputProps = {
  value: number | null;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
};

export default function RatingInput({
  value,
  onChange,
  max = 5,
  disabled = false,
  className,
  label = "Rating",
}: RatingInputProps) {
  const [previewValue, setPreviewValue] = useState<number | null>(null);
  const activeValue = previewValue ?? value ?? 0;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={() => setPreviewValue(null)}
    >
      {Array.from({ length: max }).map((_, index) => {
        const rating = index + 1;
        const isActive = rating <= activeValue;

        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${rating} out of ${max}`}
            disabled={disabled}
            className="rounded-md p-1 text-muted-foreground transition-transform hover:scale-105 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            onClick={() => onChange(rating)}
            onFocus={() => setPreviewValue(rating)}
            onBlur={() => setPreviewValue(null)}
            onMouseEnter={() => setPreviewValue(rating)}
          >
            <Star
              className={cn(
                "size-7 transition-colors",
                isActive
                  ? "fill-yellow-400 text-yellow-500"
                  : "text-muted-foreground/45",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
