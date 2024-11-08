// app/layout.tsx
import "./globals.css";
import { Inter, Quicksand, Caveat } from 'next/font/google';
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

export const metadata = {
  title: "PetPals",
  description: "Your virtual pet companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(
      inter.variable,
      quicksand.variable,
      caveat.variable,
    )}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}