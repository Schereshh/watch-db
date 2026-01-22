"use client";

import Link from "next/link";
import { Film, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-32">
        <div className="flex gap-12 w-full">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Film className="h-5 w-5" aria-hidden="true" />
            <span>WatchDB</span>
          </Link>
          <Input
            placeholder="Search movies..."
            aria-label="Search movies"
            type="search"
            className="w-56"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const query = (e.currentTarget as HTMLInputElement).value;
                if (query) {
                  router.push(`/search?query=${encodeURIComponent(query)}`);
                } else {
                  router.push(`/search`);
                }
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
