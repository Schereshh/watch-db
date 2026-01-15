"use client";

import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 container items-center justify-between px-32">
        <div className="flex gap-12 w-full">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Film className="h-5 w-5" aria-hidden="true" />
            <span>WatchDB</span>
          </Link>
            <Input
              placeholder="Search movies..."
              className="w-56"
            />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
