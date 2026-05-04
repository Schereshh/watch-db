import Link from "next/link";
import { ArrowRight, Film } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="pt-56">
      <div className="max-w-2xl space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur">
          <Film className="h-4 w-4 text-amber-600" aria-hidden="true" />
          Movie diary, simplified
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight text-stone-950 lg:text-7xl">
            A clean home for the movies you watch.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-stone-600 lg:text-xl">
            Search fast, save what looks good, and rate what you finish.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-stone-950 px-6 text-base text-stone-50 hover:bg-stone-800"
          >
            <Link href="/sign-up">
              Start logging
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-stone-300 bg-white/80 px-6 text-base text-stone-900 hover:bg-stone-100"
          >
            <Link href="/search">Search movies</Link>
          </Button>
        </div>

        <div className="grid max-w-xl grid-cols-3 gap-4 border-t border-stone-200 pt-6">
          <div>
            <p className="text-2xl font-semibold text-stone-950">Search</p>
            <p className="mt-1 text-sm text-stone-500">Find it quickly</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-stone-950">Save</p>
            <p className="mt-1 text-sm text-stone-500">Keep a watchlist</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-stone-950">Rate</p>
            <p className="mt-1 text-sm text-stone-500">
              Remember the good ones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
