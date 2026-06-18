import { searchMovies, type SearchMovie } from "@/services/tmdb/search";
import { PaginationButtons } from "./pagination-buttons";
import { Film, Search, Ticket } from "lucide-react";
import SearchResultCard from "./components/search-result-card/search-result-card";

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
    <div className="py-8 sm:py-10">
      <section className="rounded-md border border-stone-200 bg-stone-50 p-5">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800">
            <Ticket className="size-4" aria-hidden="true" />
            Movie search
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              {trimmedQuery
                ? `Results for "${trimmedQuery}"`
                : "Find your next movie"}
            </h1>
            <p className="text-sm leading-6 text-stone-600 sm:text-base">
              Browse the TMDB catalog, then open a movie to save it, mark it as
              watched, or add your own rating.
            </p>
          </div>
        </div>
      </section>
      <div className="mt-8">
        {!trimmedQuery && (
          <div className="rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
            <Search
              className="mx-auto mb-3 size-8 text-stone-400"
              aria-hidden="true"
            />
            <p className="text-lg font-semibold text-stone-950">
              Start with a movie title
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Try searching for a film you watched recently or one you want to
              add to your watchlist.
            </p>
          </div>
        )}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {trimmedQuery && !error && results.length === 0 && (
          <div className="rounded-md border border-stone-200 bg-white p-8 text-center">
            <Film
              className="mx-auto mb-3 size-8 text-stone-400"
              aria-hidden="true"
            />
            <p className="text-lg font-semibold text-stone-950">
              No results found
            </p>
            <p className="mt-2 text-sm text-stone-600">
              Check the spelling or try a shorter title.
            </p>
          </div>
        )}
        {trimmedQuery && !error && results.length > 0 && (
          <div className="space-y-5">
            <div className="flex flex-col gap-1 border-b border-stone-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-stone-500">
                  Search results
                </p>
                <p className="mt-1 text-2xl font-semibold text-stone-950">
                  {pagination.totalResults.toLocaleString()} matches
                </p>
              </div>
              <p className="text-sm text-stone-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {results.map((movie) => (
                <SearchResultCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
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
