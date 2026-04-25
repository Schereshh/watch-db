export type WatchlistState = {
  authenticated: boolean;
  inWatchlist: boolean;
};

type WatchlistEnvelope = {
  data?: WatchlistState;
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

async function readJsonOrThrow(response: Response): Promise<WatchlistState> {
  const payload = (await response.json()) as WatchlistEnvelope;

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

  return readJsonOrThrow(response);
}

export async function addToWatchlist(movieId: number) {
  const response = await fetch(`/api/watchlist/${movieId}`, {
    method: "POST",
    credentials: "same-origin",
  });

  return readJsonOrThrow(response);
}

export async function removeFromWatchlist(movieId: number) {
  const response = await fetch(`/api/watchlist/${movieId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  return readJsonOrThrow(response);
}