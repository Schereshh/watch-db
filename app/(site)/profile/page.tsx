"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Clapperboard,
  ListPlus, Sparkles
} from "lucide-react";

import WatchedMovies from "@/components/pages/profile/watched-movies";
import WatchlistMovies from "@/components/pages/profile/watchlist-movies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfileQuery } from "@/hooks/queries/use-profile-query";
import { useWatchedMoviesQuery } from "@/hooks/queries/use-watched-movies-query";
import { useWatchlistMoviesQuery } from "@/hooks/queries/use-watchlist-movies-query";

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "No activity yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatCount(value: number, isLoading: boolean) {
  return isLoading ? "Loading..." : value.toLocaleString("en-US");
}

function getLatestDate(...dates: Array<string | null | undefined>) {
  const latestTimestamp = dates.reduce<number | null>((latest, date) => {
    if (!date) {
      return latest;
    }

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) {
      return latest;
    }

    return latest === null ? timestamp : Math.max(latest, timestamp);
  }, null);

  return latestTimestamp === null
    ? null
    : new Date(latestTimestamp).toISOString();
}

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: unknown }).status === 401
  );
}

export default function Profile() {
  const router = useRouter();
  const profileQuery = useProfileQuery();
  const watchedQuery = useWatchedMoviesQuery();
  const watchlistQuery = useWatchlistMoviesQuery();

  useEffect(() => {
    if (
      isUnauthorizedError(profileQuery.error) ||
      isUnauthorizedError(watchedQuery.error) ||
      isUnauthorizedError(watchlistQuery.error)
    ) {
      router.replace("/login");
    }
  }, [profileQuery.error, router, watchedQuery.error, watchlistQuery.error]);

  const watchedMovies =
    watchedQuery.data?.pages.flatMap((page) => page.movies) ?? [];
  const watchlistMovies = watchlistQuery.data?.movies ?? [];
  const watchedCount = watchedQuery.data?.pages[0]?.totalCount ?? 0;
  const watchlistCount = watchlistMovies.length;
  const totalSavedCount = watchedCount + watchlistCount;
  const isLibraryLoading = watchedQuery.isPending || watchlistQuery.isPending;
  const latestActivityDate = getLatestDate(
    watchedMovies[0]?.loggedAt,
    watchlistMovies[0]?.addedAt,
  );

  const profileEmail = profileQuery.isPending
    ? "Loading profile..."
    : (profileQuery.data?.email ?? "Signed-in profile");
  const memberSince = profileQuery.isPending
    ? "Loading..."
    : formatDate(profileQuery.data?.createdAt);
  const librarySummary = isLibraryLoading
    ? "Loading your library"
    : `${totalSavedCount.toLocaleString("en-US")} saved ${
        totalSavedCount === 1 ? "movie" : "movies"
      }`;

  return (
    <article className="pb-16">
      <section className="relative left-1/2 w-screen -translate-x-1/2 border-b bg-stone-950 text-stone-50">
        <div className="mx-auto px-4 grid container py-10 ">
          <div className="flex flex-col gap-6">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-md border border-white/15 bg-stone-900 shadow-2xl sm:size-28">
              <Image
                src="/avatar.png"
                alt="Profile avatar"
                fill
                sizes="112px"
                className="object-cover"
                priority
              />
            </div>

            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Your movies
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-stone-300">
                <span>{profileEmail}</span>
                <span
                  className="hidden text-stone-500 sm:inline"
                  aria-hidden="true"
                >
                  /
                </span>
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 grid-cols-4 py-10">
        <Tabs defaultValue="watched" className="gap-4 col-span-3">
          <div className="flex gap-4 border-b pb-4 flex-row items-end justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Sparkles
                  className="size-4 text-amber-600"
                  aria-hidden="true"
                />
                Movie library
              </div>
              <h2 className="text-2xl font-semibold">
                {librarySummary}
              </h2>
            </div>
            <TabsList className="grid-cols-2">
              <TabsTrigger value="watched" >
                Watched
              </TabsTrigger>
              <TabsTrigger value="watchlist">
                Watchlist
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="watched">
            <section className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Watched</h3>
                  <p className="text-sm text-muted-foreground">
                    Movies you&apos;ve already logged.
                  </p>
                </div>
                <Clapperboard
                  className="mt-1 size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="rounded-md border bg-background p-3 shadow-sm sm:p-4">
                <WatchedMovies />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="watchlist">
            <section className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Watchlist</h3>
                  <p className="text-sm text-muted-foreground">
                    Movies you want to watch later.
                  </p>
                </div>
                <ListPlus
                  className="mt-1 size-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="rounded-md border bg-background p-3 shadow-sm sm:p-4">
                <WatchlistMovies />
              </div>
            </section>
          </TabsContent>
        </Tabs>

        <aside className="space-y-4">

          <section className="rounded-md border bg-muted/40 p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Watched</dt>
                <dd className="font-medium">
                  {formatCount(watchedCount, watchedQuery.isPending)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Want to watch</dt>
                <dd className="font-medium">
                  {formatCount(watchlistCount, watchlistQuery.isPending)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">Latest</dt>
                <dd className="text-right font-medium">
                  {isLibraryLoading
                    ? "Loading..."
                    : formatDate(latestActivityDate)}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </article>
  );
}
