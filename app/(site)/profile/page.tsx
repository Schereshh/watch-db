import { redirect } from "next/navigation";
import Image from "next/image";

import WatchedMovies from "@/components/pages/profile/watched-movies";
import WatchlistMovies from "@/components/pages/profile/watchlist-movies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <div className="pt-4">
      <div className="pl-2 pt-4 flex flex-col gap-4">
        <div className="flex">
          <Image
            src="/avatar.png"
            alt="Profile Avatar"
            width={75}
            height={75}
          />
          <div className="flex flex-col justify-center py-2.5 pl-3">
            <span className="font-medium text-xl">Your movies</span>
          </div>
        </div>
        <Tabs defaultValue="watched" className="w-full">
          <TabsList>
            <TabsTrigger value="watched">Watched</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          <TabsContent value="watched" className="pt-4">
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Watched</h2>
                <p className="text-sm text-muted-foreground">
                  Movies you&apos;ve already logged.
                </p>
              </div>
              <WatchedMovies />
            </section>
          </TabsContent>
          <TabsContent value="watchlist" className="pt-4">
            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Watchlist</h2>
                <p className="text-sm text-muted-foreground">
                  Movies you want to watch later.
                </p>
              </div>
              <WatchlistMovies />
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
