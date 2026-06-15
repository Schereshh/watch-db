import Image from "next/image";
import {
  CalendarDays,
  Clock3,
  Film,
  Globe2,
  Ticket,
  UserRound,
  UsersRound,
} from "lucide-react";
import { notFound } from "next/navigation";

import { getMovieDetails } from "@/services/tmdb/movie";
import MovieDetailHero from "./movie-detail-hero/movie-detail-hero";
import {
  formatLanguage,
  formatReleaseDate,
  formatRuntime,
} from "@/util/formatters";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number.parseInt(id, 10);

  if (Number.isNaN(movieId)) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieDetails(movieId);
  } catch {
    notFound();
  }

  return (
    <article className="pb-16">
      <MovieDetailHero movie={movie} />

      <div className="mx-auto grid max-w-7xl gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-12">
          {movie.overview && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Ticket className="size-5" aria-hidden="true" />
                <h2 className="text-2xl font-semibold">Overview</h2>
              </div>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground">
                {movie.overview}
              </p>
            </section>
          )}

          {movie.cast.length > 0 && (
            <section>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <UsersRound className="size-5" aria-hidden="true" />
                  <h2 className="text-2xl font-semibold">Top cast</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {movie.cast.length} featured
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {movie.cast.map((member) => {
                  const profileUrl = member.profilePath
                    ? `${TMDB_IMAGE_BASE}/w185${member.profilePath}`
                    : null;

                  return (
                    <div
                      key={member.id}
                      className="flex min-w-0 items-center gap-3 rounded-md border bg-background p-2 transition-colors hover:bg-accent"
                    >
                      <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                        {profileUrl ? (
                          <Image
                            src={profileUrl}
                            alt={`${member.name} profile`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <UserRound className="size-5" aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {member.name}
                        </p>
                        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {member.character || "Cast member"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-md border bg-background p-5">
            <dl className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Release date</dt>
                  <dd className="text-muted-foreground">
                    {formatReleaseDate(movie.releaseDate)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Runtime</dt>
                  <dd className="text-muted-foreground">
                    {formatRuntime(movie.runtime)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe2 className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Original language</dt>
                  <dd className="text-muted-foreground">
                    {formatLanguage(movie.originalLanguage)}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Film className="mt-0.5 size-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Status</dt>
                  <dd className="text-muted-foreground">{movie.status}</dd>
                </div>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </article>
  );
}
