'use client';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import ConnectBtn from '../_components/connectBtn';
import LogCookieButton from '~/_components/LogCookieButton';

export const dynamic = 'force-dynamic';

interface SpotifyTokenResponse {
  access_token: string;
  error?: string;
}


export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/getSpotifyToken');
        const data = (await response.json()) as SpotifyTokenResponse;
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          console.error('Error fetching token:', data.error);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken().catch((error) => {
      console.error('Error in fetchToken:', error);
    });
  }, []);

  return (
    <main>
      <div className="h-16 w-full text-white flex flex-col items-center justify-center">
        <SignedOut>
          <div className="h-full w-full text-2xl text-center">Please Sign In :)</div>
        </SignedOut>
        <SignedIn>
          <ConnectBtn />
          <LogCookieButton />
          {token ? <p>Access Token: {token}</p> : <p>Loading...</p>}
        </SignedIn>
      </div>
    </main>
  );
}