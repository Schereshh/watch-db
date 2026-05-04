"use client";

import Link from "next/link";
import {
  Film,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type NavbarProps = {
  initialUserEmail: string | null;
};

export function Navbar({ initialUserEmail }: NavbarProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [userEmail, setUserEmail] = useState<string | null>(initialUserEmail);

  useEffect(() => {
    let mounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUserEmail(session?.user?.email ?? null);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 xl:px-16">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:max-w-3xl lg:gap-10">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Film className="h-5 w-5" aria-hidden="true" />
            <span>WatchDB</span>
          </Link>
          <Input
            placeholder="Search movies..."
            aria-label="Search movies"
            type="search"
            className="w-full sm:w-72"
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
        <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
          {userEmail ? (
            <>
              <Link href="/profile">
                <Button variant="ghost" size="icon" aria-label="Profile">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <span className="hidden text-sm text-muted-foreground md:inline">
                {userEmail}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <Button>Sign up</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
