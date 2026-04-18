"use server";

import { redirect } from "next/navigation";

export async function goToPage(query: string, page: number) {
  redirect(`/search?query=${encodeURIComponent(query)}&page=${page}`);
}
