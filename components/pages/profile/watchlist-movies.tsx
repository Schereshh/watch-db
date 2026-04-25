"use client";

import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { useWatchlistMoviesQuery } from "@/hooks/queries/use-watchlist-movies-query";

function formatAddedLabel(addedAt: string) {
  return `Added ${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(addedAt))}`;
}

export default function WatchlistMovies() {
  const watchlistQuery = useWatchlistMoviesQuery();

  if (watchlistQuery.isPending) {
    return <p className="text-muted-foreground">Loading your watchlist...</p>;
  }

  if (watchlistQuery.isError) {
    return (
      <p className="text-destructive">
        Failed to load your watchlist. Please try again.
      </p>
    );
  }

  const movies = watchlistQuery.data.movies;

  if (movies.length === 0) {
    return (
      <>
        <span>0 movies</span>
        <div className="border-t-2" />
        <p className="text-muted-foreground">
          You haven&apos;t added any movies to your watchlist yet.
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
        <div key={movie.id}>
          <MovieItem
            movieId={movie.id.toString()}
            movieName={movie.title}
            posterPath={movie.posterPath}
            status={formatAddedLabel(movie.addedAt)}
          />
          {index < movies.length - 1 && <div className="border-t-2" />}
        </div>
      ))}
    </>
  );
}