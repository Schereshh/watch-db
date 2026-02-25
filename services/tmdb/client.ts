const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type RequestParams = Record<string, string | number | boolean | undefined>;

type TmdbClientConfig = {
  accessToken: string;
};

export function createTmdbClient({ accessToken }: TmdbClientConfig) {
  async function request<T>(path: string, params: RequestParams = {}) {
    const url = new URL(`${TMDB_BASE_URL}${path}`);

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`TMDB request failed (${response.status}): ${body}`);
    }

    return (await response.json()) as T;
  }

  return { request };
}
