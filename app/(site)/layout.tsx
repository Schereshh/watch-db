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
      <main id="content" className="flex-1 container mx-auto px-32">
        {children}
      </main>
    </div>
  );
}
