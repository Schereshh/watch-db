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
    <div>
      <h1 className="text-2xl font-semibold pb-4">Search Results</h1>
      {!trimmedQuery && (
        <p className="text-muted-foreground">
          Type a movie title in the search bar to see results.
        </p>
      )}
      {error && <p className="text-destructive">{error}</p>}
      {trimmedQuery && !error && results.length === 0 && (
        <p className="text-muted-foreground">No results found.</p>
      )}

      <div className="pl-2 pt-4 flex flex-col gap-4">
        {results.map((movie, index) => (
          <div key={movie.id}>
            <MovieItem
              movieId={movie.id.toString()}
              movieName={movie.title}
              rating={getStars(movie.voteAverage)}
              status={getReleaseLabel(movie.releaseDate)}
            />
            {index < results.length - 1 && <div  />}
          </div>
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
