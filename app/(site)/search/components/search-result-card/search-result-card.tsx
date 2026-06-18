import { type SearchMovie } from "@/services/tmdb/search";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Film, Star } from "lucide-react";

import { formatVoteAverage } from "@/util/formatters";
import { TMDB_IMAGE_BASE } from "@/util/constants";

const getStars = (voteAverage: number) => {
  if (!Number.isFinite(voteAverage)) return 0;
  return Math.max(0, Math.min(5, Math.round(voteAverage / 2)));
};

const getReleaseLabel = (releaseDate: string) => {
  if (!releaseDate) return "Unknown release";
  return releaseDate.slice(0, 4);
};

const SearchResultCard = ({ movie }: { movie: SearchMovie }) => {
  const posterUrl = movie.posterPath
    ? `${TMDB_IMAGE_BASE}/w342${movie.posterPath}`
    : null;
  const starCount = getStars(movie.voteAverage);

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="grid rounded-md border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-md grid-cols-3"
    >
      <div className="relative bg-stone-100 sm:aspect-auto col-span-1 min-h-fit">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-sm text-stone-500">
            <Film className="size-7" aria-hidden="true" />
            No poster
          </div>
        )}
      </div>

      <div className="flex col-span-2 flex-col justify-between gap-5 p-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-stone-700">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {getReleaseLabel(movie.releaseDate)}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-800">
              <Star
                className="size-3.5 fill-amber-500 text-amber-500"
                aria-hidden="true"
              />
              {formatVoteAverage(movie.voteAverage)}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-stone-950">
              {movie.title}
            </h2>
            <p className="text-sm text-stone-600">
              {movie.overview || "No overview is available for this movie."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <div
            className="flex items-center gap-1 text-amber-500"
            aria-label={`${starCount} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="size-4"
                fill={index < starCount ? "currentColor" : "none"}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-sm font-medium text-stone-700 transition-colors group-hover:text-stone-950">
            View details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
