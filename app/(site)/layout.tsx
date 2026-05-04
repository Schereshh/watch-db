import type { ReactNode } from "react";
import "../globals.css";

import NavbarServer from "@/components/navbar-server";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarServer />
      <main
        id="content"
        className="container mx-auto flex-1 px-4 sm:px-6 lg:px-10 xl:px-16"
      >
        {children}
      </main>
    </div>
  );
}
