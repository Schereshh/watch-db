import { redirect } from "next/navigation";
import Image from "next/image";

import MovieItem from "@/components/pages/profile/movie-item/movie-item";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";

export default async function Profile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <Tabs defaultValue="watched" className="w-full max-w-md">
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
        <MovieItem movieId="1" movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieId="2" movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieId="3" movieName="Parasite" rating={5} status="Favourite"/>
        <div className="border-t-2" />
        <MovieItem movieId="4" movieName="Parasite" rating={5} status="Favourite"/>
      </div>
    </div>
  );
}
