import Image from "next/image";
import { Film, Star, UsersRound } from "lucide-react";

import WatchedButton from "../watched-button";
import WatchlistButton from "../watchlist-button";
import type { MovieDetails } from "@/services/tmdb/movie";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type Props = {
  movie: MovieDetails;
};

function formatRuntime(minutes: number | null): string {
  if (minutes === null) return "Unknown runtime";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatVoteAverage(value: number): string {
  return value > 0 ? value.toFixed(1) : "N/A";
}

function formatVoteCount(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const MovieDetailHero = ({ movie }: Props) => {
  const posterUrl = movie.posterPath
    ? `${TMDB_IMAGE_BASE}/w500${movie.posterPath}`
    : null;

  const backdropUrl = movie.backdropPath
    ? `${TMDB_IMAGE_BASE}/w1280${movie.backdropPath}`
    : null;

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-neutral-950 text-white">
      {backdropUrl && (
        <Image
          src={backdropUrl}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25" />

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-end gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-10 lg:py-14 xl:px-16">
        <div className="mx-auto w-[190px] shrink-0 sm:mx-0 lg:w-[250px]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              width={500}
              height={750}
              className="aspect-[2/3] w-full rounded-md object-cover shadow-2xl ring-1 ring-white/20"
              priority
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-white/10 text-sm text-white/65 ring-1 ring-white/15">
              <Film className="mr-2 size-5" aria-hidden="true" />
              No poster
            </div>
          )}
        </div>

        <div className="max-w-4xl pb-1">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/75">
            {movie.releaseDate && (
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            )}
            {movie.runtime !== null && (
              <>
                <span aria-hidden="true">/</span>
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            )}
            {movie.directors.length > 0 && (
              <>
                <span aria-hidden="true">/</span>
                <span>Directed by {movie.directors.join(", ")}</span>
              </>
            )}
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="mt-3 max-w-3xl text-lg italic text-white/72">
              {movie.tagline}
            </p>
          )}

          {movie.genres.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 grid max-w-2xl grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <span className="flex items-center gap-2 text-xs uppercase text-white/60">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                TMDB score
              </span>
              <span className="mt-1 block text-xl font-semibold">
                {formatVoteAverage(movie.voteAverage)}
                <span className="text-sm font-normal text-white/60"> / 10</span>
              </span>
            </div>
            <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <span className="flex items-center gap-2 text-xs uppercase text-white/60">
                <UsersRound className="size-4" />
                Votes
              </span>
              <span className="mt-1 block text-xl font-semibold">
                {formatVoteCount(movie.voteCount)}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <WatchedButton movieId={movie.id} />
            <WatchlistButton movieId={movie.id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieDetailHero;
