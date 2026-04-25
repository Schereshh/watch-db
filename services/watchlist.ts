export type WatchlistState = {
  authenticated: boolean;
  inWatchlist: boolean;
};

export type WatchlistMovie = {
  id: number;
  title: string;
  posterPath: string | null;
  addedAt: string;
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

export function getWatchlistQueryKey(movieId: number) {
  return ["watchlist", movieId] as const;
}

export function getWatchlistMoviesQueryKey() {
  return ["watchlist", "movies"] as const;
}

async function readJsonOrThrow<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.data) {
    throw new ApiRequestError(
      payload.error ?? "Watchlist request failed",
      response.status,
    );
  }

  return payload.data;
}

export async function fetchWatchlistState(movieId: number) {
  const response = await fetch(`/api/watchlist/${movieId}`, {
    method: "GET",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchlistState>(response);
}

export async function fetchWatchlistMovies() {
  const response = await fetch("/api/watchlist", {
    method: "GET",
    credentials: "same-origin",
  });

  return readJsonOrThrow<{ movies: WatchlistMovie[] }>(response);
}

export async function addToWatchlist(movieId: number) {
  const response = await fetch(`/api/watchlist/${movieId}`, {
    method: "POST",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchlistState>(response);
}

export async function removeFromWatchlist(movieId: number) {
  const response = await fetch(`/api/watchlist/${movieId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  return readJsonOrThrow<WatchlistState>(response);
}