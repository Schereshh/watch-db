import { Star } from "lucide-react";
import Image from "next/image";

type Props = {
  movieName: string;
  rating?: number;
  status?: string;
};

export default function MovieItem({ movieName, rating, status }: Props) {
  const starCount = Math.max(0, Math.floor(rating || 0));

  const Stars = ({ count }: { count: number }) => {
    if (count <= 0) return null;
    return (
      <div className="flex items-center gap-1 mt-1">
        {Array.from({ length: count }).map((_, i) => (
          <Star key={i} fill="currentColor" />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 ml-1">
      <Image
        alt="movie-item-placeholder"
        src="/movie-item-placeholder.jpg"
        width={100 / 1.5}
        height={150 / 1.5}
      />
      <div className="flex items-center justify-between w-full">
        <span className="flex flex-col">
          <span className="font-medium text-2xl">{movieName}</span>
          <span>{status}</span>
        </span>
        <Stars count={starCount} />
      </div>
    </div>
  );
}
