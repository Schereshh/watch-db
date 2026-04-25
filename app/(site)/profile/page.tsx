import { redirect } from "next/navigation";
import Image from "next/image";

import WatchlistMovies from "@/components/pages/profile/watchlist-movies";
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
          <div className="flex flex-col justify-between py-2.5 pl-3">
            <span className="font-medium text-xl">Your watchlist</span>
          </div>
        </div>
        <WatchlistMovies />
      </div>
    </div>
  );
}
