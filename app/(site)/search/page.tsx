import { searchMovies, type SearchMovie } from "@/services/tmdb/search";
import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { PaginationButtons } from "./pagination-buttons";

function getStars(voteAverage: number) {
  if (!Number.isFinite(voteAverage)) return 0;
  return Math.max(0, Math.min(5, Math.round(voteAverage / 2)));
}

function getReleaseLabel(releaseDate: string) {
  if (!releaseDate) return "Release date unknown";
  return `Released ${releaseDate.slice(0, 4)}`;
}

type SearchPageProps = {
  searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query = "", page: pageParam = "1" } = await searchParams;
  const trimmedQuery = query.trim();

  const parsedPage = Number.parseInt(pageParam, 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  let results: SearchMovie[] = [];
  let pagination = { page: 1, totalPages: 0, totalResults: 0 };
  let error: string | null = null;

  if (trimmedQuery) {
    try {
      const response = await searchMovies(trimmedQuery, { page });
      results = response.results;
      pagination = {
        page: response.page,
        totalPages: response.totalPages,
        totalResults: response.totalResults,
      };
    } catch (err) {
      error =
        err instanceof Error ? err.message : "Search failed. Please try again.";
    }
  }

  return (
    <div className="pt-4">
      <div className="pb-4">
        <h1 className="text-2xl font-semibold">
          {trimmedQuery ? `Results for "${trimmedQuery}"` : "Search"}
        </h1>
        {trimmedQuery && !error && pagination.totalResults > 0 && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination.totalResults.toLocaleString()} results
          </p>
        )}
      </div>
      {!trimmedQuery && (
        <p className="text-muted-foreground">
          Type a movie title in the search bar to see results.
        </p>
      )}
      {error && <p className="text-destructive">{error}</p>}
      {trimmedQuery && !error && results.length === 0 && (
        <p className="text-muted-foreground">No results found.</p>
      )}

      <div className="flex flex-col">
        {results.map((movie) => (
          <MovieItem
            key={movie.id}
            movieId={movie.id.toString()}
            movieName={movie.title}
            posterPath={movie.posterPath}
            rating={getStars(movie.voteAverage)}
            status={getReleaseLabel(movie.releaseDate)}
          />
        ))}
      </div>

      {trimmedQuery && !error && results.length > 0 && (
        <PaginationButtons
          query={trimmedQuery}
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalResults={pagination.totalResults}
        />
      )}
    </div>
  );
}
