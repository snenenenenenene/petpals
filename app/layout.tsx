import { Providers } from "@/providers";
import { ToastContainer } from "./components/ui/ToastContainer";
import "./globals.css"
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>

      <body>
        <ToastContainer />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
