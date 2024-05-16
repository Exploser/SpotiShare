'use client';
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ConnectBtn from '../_components/connectBtn';

export const dynamic = "force-dynamic";

export default function HomePage() {
    const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/getSpotifyToken');
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          console.error('Error fetching token:', data.error);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);
  return (
    <main className="">

      <SignedOut>
        <div className="h-full w-full text-2xl text-center">Please Sign In :)</div>
      </SignedOut>
      <SignedIn>
        <ConnectBtn />
      </SignedIn>
    </main>
  );
}