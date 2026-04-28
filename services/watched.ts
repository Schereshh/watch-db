export type WatchedState = {
  authenticated: boolean;
  isWatched: boolean;
  rating: number | null;
  watchedAt: string | null;
  loggedAt: string | null;
  warning?: string;
};

export type WatchedMovie = {
  id: number;
  title: string;
  posterPath: string | null;
  rating: number | null;
  watchedAt: string | null;
  loggedAt: string;
};

export type WatchedMoviesPage = {
  movies: WatchedMovie[];
  page: number;
  pageSize: number;
  totalCount: number;
  nextPage: number | null;
};

type ApiEnvelope<T> = {
  data?: T;
  error?: string;
};

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getWatchedQueryKey(movieId: number) {
  return ["watched", movieId] as const;
}

export function getWatchedMoviesQueryKey() {
  return ["watched", "movies"] as const;
}

export const DEFAULT_WATCHED_MOVIES_PAGE_SIZE = 20;

async function readJsonOrThrow<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.data) {
    throw new ApiRequestError(
      payload.error ?? "Watched request failed",
      response.status,
    );
  }

  return payload.data;
}

export async function fetchWatchedState(movieId: number) {
  const response = await fetch(`/api/watched/${movieId}`, {
    method: "GET",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchedState>(response);
}

type FetchWatchedMoviesInput = {
  page?: number;
  limit?: number;
};

export async function fetchWatchedMovies({
  page = 1,
  limit = DEFAULT_WATCHED_MOVIES_PAGE_SIZE,
}: FetchWatchedMoviesInput = {}) {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(`/api/watched?${searchParams.toString()}`, {
    method: "GET",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchedMoviesPage>(response);
}

type MarkWatchedInput = {
  rating?: number | null;
  watchedAt?: string | null;
};

export async function markAsWatched(movieId: number, input: MarkWatchedInput = {}) {
  const response = await fetch(`/api/watched/${movieId}`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return readJsonOrThrow<WatchedState>(response);
}

export async function removeFromWatched(movieId: number) {
  const response = await fetch(`/api/watched/${movieId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchedState>(response);
}