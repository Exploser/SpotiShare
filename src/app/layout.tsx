import "~/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs';

import { GeistSans } from "geist/font/sans";
import { Navbar } from "~/_components/navbar";
import { VolumeProvider } from "~/context/VolumeContext";

export const metadata = {
  title: "Wrapify",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <Navbar />
          <VolumeProvider>
            {children}
          </VolumeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
