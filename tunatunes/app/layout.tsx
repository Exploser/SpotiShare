import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TunaTunes",
  description: "Discover new music and listen to quick snippets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={inter.className}>
          <main className="h-full bg-[#501069] overflow-auto w-full">
            <div className="max-w-screen-xl h-full w-full mx-auto">
              {children}
            </div>
          </main>
        </body>
      </html>
  );
}
