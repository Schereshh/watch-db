"use client";

import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { Button } from "@/components/ui/button";
import { useWatchedMoviesQuery } from "@/hooks/queries/use-watched-movies-query";

function formatWatchedLabel(watchedAt: string | null, loggedAt: string) {
  const dateFormatterOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  if (watchedAt) {
    return `Watched ${new Intl.DateTimeFormat("en-US", {
      ...dateFormatterOptions,
      timeZone: "UTC",
    }).format(new Date(`${watchedAt}T00:00:00Z`))}`;
  }

  return `Logged ${new Intl.DateTimeFormat("en-US", dateFormatterOptions).format(
    new Date(loggedAt),
  )}`;
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

  const movies = watchedQuery.data.pages.flatMap((page) => page.movies);
  const totalCount = watchedQuery.data.pages[0]?.totalCount ?? 0;
  const showingAllMovies = !watchedQuery.hasNextPage && !watchedQuery.isFetchingNextPage;

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
        {showingAllMovies
          ? `${totalCount} movie${totalCount === 1 ? "" : "s"}`
          : `Showing ${movies.length} of ${totalCount} movies`}
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
      {watchedQuery.hasNextPage ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => watchedQuery.fetchNextPage()}
          disabled={watchedQuery.isFetchingNextPage}
        >
          {watchedQuery.isFetchingNextPage ? "Loading more..." : "Load more"}
        </Button>
      ) : null}
    </>
  );
}