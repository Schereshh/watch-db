"use client";

import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { useWatchedMoviesQuery } from "@/hooks/queries/use-watched-movies-query";

function formatWatchedLabel(watchedAt: string | null, loggedAt: string) {
  const date = watchedAt ?? loggedAt;

  return `${watchedAt ? "Watched" : "Logged"} ${new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(new Date(date))}`;
}

export default function WatchedMovies() {
  const watchedQuery = useWatchedMoviesQuery();

  if (watchedQuery.isPending) {
    return <p className="text-muted-foreground">Loading your watched movies...</p>;
  }

  if (watchedQuery.isError) {
    return (
      <p className="text-destructive">
        Failed to load your watched movies. Please try again.
      </p>
    );
  }

  const movies = watchedQuery.data.movies;

  if (movies.length === 0) {
    return (
      <>
        <span>0 movies</span>
        <div className="border-t-2" />
        <p className="text-muted-foreground">
          You haven&apos;t marked any movies as watched yet.
        </p>
      </>
    );
  }

  return (
    <>
      <span>
        {movies.length} movie{movies.length === 1 ? "" : "s"}
      </span>
      <div className="border-t-2" />
      {movies.map((movie, index) => (
        <div key={`${movie.id}-${movie.loggedAt}`}>
          <MovieItem
            movieId={movie.id.toString()}
            movieName={movie.title}
            posterPath={movie.posterPath}
            rating={movie.rating ?? undefined}
            status={formatWatchedLabel(movie.watchedAt, movie.loggedAt)}
          />
          {index < movies.length - 1 && <div className="border-t-2" />}
        </div>
      ))}
    </>
  );
}