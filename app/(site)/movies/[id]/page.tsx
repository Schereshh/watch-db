import { notFound } from "next/navigation";
import Image from "next/image";
import { getMovieDetails } from "@/services/tmdb/movie";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function formatRuntime(minutes: number | null): string {
  if (minutes === null) return "Unknown runtime";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatVoteAverage(value: number): string {
  return value > 0 ? value.toFixed(1) : "N/A";
}

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

  const posterUrl = movie.posterPath
    ? `${TMDB_IMAGE_BASE}/w500${movie.posterPath}`
    : null;

  const backdropUrl = movie.backdropPath
    ? `${TMDB_IMAGE_BASE}/w1280${movie.backdropPath}`
    : null;

  const releaseYear = movie.releaseDate ? movie.releaseDate.slice(0, 4) : null;

  return (
    <div className="pb-10">
      <div className="relative w-screen left-1/2 -translate-x-1/2 mb-10 min-h-[420px] flex items-end">
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="z-10 px-32 container mx-auto pb-8 flex flex-col sm:flex-row gap-6 items-end">
          <div>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                width={180}
                height={270}
                className="rounded-lg shadow-2xl"
                priority
              />
            ) : (
              <div className="w-[180px] h-[270px] rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-sm">
                No poster
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pb-1 text-white text-shadow-black text-shadow-md">
            <h1 className="text-3xl font-bold">
              {movie.title}
              {releaseYear && (
                <span className="font-normal ml-2 text-2xl opacity-80">
                  ({releaseYear})
                </span>
              )}
            </h1>
            {movie.tagline && (
              <p className="italic opacity-70 text-sm">{movie.tagline}</p>
            )}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-2 py-0.5 text-xs rounded-full bg-white/20 backdrop-blur-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 text-sm opacity-80 mt-1">
              {movie.releaseDate && <span>{movie.releaseDate}</span>}
              <span>{formatRuntime(movie.runtime)}</span>
              <span className="font-medium opacity-100">
                ★ {formatVoteAverage(movie.voteAverage)}
                <span className="font-normal opacity-70 ml-1">
                  ({movie.voteCount.toLocaleString()} votes)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {movie.overview && (
          <div>
            <h2 className="font-semibold mb-1">Overview</h2>
            <p className="text-muted-foreground">
              {movie.overview}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-8 text-sm">
          <div>
            <span className="font-semibold">Status</span>
            <p className="text-muted-foreground">{movie.status}</p>
          </div>
          <div>
            <span className="font-semibold">Original Language</span>
            <p className="text-muted-foreground uppercase">
              {movie.originalLanguage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
