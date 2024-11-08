// app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import ThemeToggle from "./components/UI/ThemeToggle";

export const metadata = {
  title: "PetPals",
  description: "A virtual pet care app to nurture your digital pet.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text font-sans">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">PetPals</h1>
          <ThemeToggle />
        </div>
        <main className="flex flex-col items-center min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
