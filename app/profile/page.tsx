import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

export default function Profile() {
  return (
    <div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="watched">Watched</TabsTrigger>
          <TabsTrigger value="toWatch">To Watch</TabsTrigger>
          <TabsTrigger value="favourites">Favourites</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="pl-2 pt-4 flex flex-col gap-4">
        <div className="flex">
          <Image
            src="/avatar.png"
            alt="Profile Avatar"
            width={75}
            height={75}
          />
          <div className="flex flex-col justify-between py-2.5 pl-3">
            <span className="font-medium text-xl">User&apos;s movies</span>
            <span>Watched: 12 | To Watch: 5 | Favourites: 8</span>
          </div>
        </div>
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieName="Parasite" rating={5} status="Favourite"/>
      </div>
    </div>
  );
}
