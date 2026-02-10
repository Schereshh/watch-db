import { ReactNode } from "react";



export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
   <div className="container mx-auto flex justify-center items-center min-h-screen">
      {children}
   </div>
  );
}
