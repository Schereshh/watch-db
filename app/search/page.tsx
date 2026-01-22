import MovieItem from "../../components/pages/profile/movie-item/movie-item";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold pb-4">Search Results</h1>
      <div className="pl-2 pt-4 flex flex-col gap-4">
        <MovieItem movieName="Parasite" rating={5} status="Favourite" />
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite" />
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite" />
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite" />
      </div>
    </div>
  );
}
