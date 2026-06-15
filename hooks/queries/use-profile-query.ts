"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  email: string | null;
  createdAt: string | null;
};

function createAuthRequiredError() {
  const error = new Error("Authentication required") as Error & {
    status: number;
  };
  error.status = 401;

  return error;
}

export function getProfileQueryKey() {
  return ["profile"] as const;
}

export function useProfileQuery() {
  return useQuery<Profile>({
    queryKey: getProfileQueryKey(),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw createAuthRequiredError();
      }

      return {
        email: user.email ?? null,
        createdAt: user.created_at ?? null,
      };
    },
  });
}
