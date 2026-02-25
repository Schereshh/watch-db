import { searchMovies } from "@/services/tmdb/search";
import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { PaginationButtons } from "./pagination-buttons";

type SearchMovie = {
  id: number;
  title: string;
  releaseDate: string;
  voteAverage: number;
};

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
  const page = Math.max(1, Math.floor(Number(pageParam)));

  let results: SearchMovie[] = [];
  let pagination = { page: 1, totalPages: 0, totalResults: 0 };
  let error: string | null = null;

  if (trimmedQuery) {
    try {
      const response = await searchMovies(trimmedQuery, { page });
      results = response.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
      }));
      pagination = {
        page: response.page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
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
