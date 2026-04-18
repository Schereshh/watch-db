import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

type Props = {
  movieId: string;
  movieName: string;
  posterPath?: string | null;
  rating?: number;
  status?: string;
};

export default function MovieItem({ movieId, movieName, posterPath, rating, status }: Props) {
  const starCount = Math.max(0, Math.floor(rating || 0));
  const posterUrl = posterPath ? `${TMDB_IMAGE_BASE}/w154${posterPath}` : null;

  const Stars = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
    );
  };

  return (
    <Link
      href={`/movies/${movieId}`}
      className="flex items-center gap-4 rounded-lg p-2 hover:bg-accent transition-colors"
    >
      <div className="shrink-0 w-[60px] h-[90px] rounded overflow-hidden bg-muted">
        {posterUrl ? (
          <Image
            alt={`${movieName} poster`}
            src={posterUrl}
            width={60}
            height={90}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs text-center px-1">
            No poster
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="font-medium text-base leading-snug truncate">{movieName}</span>
        <span className="text-sm text-muted-foreground">{status}</span>
        <Stars count={starCount} />
      </div>
    </Link>
  );
}
