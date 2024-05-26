'use client';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import ConnectBtn from '../_components/connectBtn';
import LogCookieButton from '~/_components/LogCookieButton';
import SpotifyProfile from '~/_components/SpotifyProfile';
import GetTopTracks from '~/_components/GetTopTracks';
import { VolumeProvider } from '~/context/VolumeContext';
import SpotifyFeatures from '~/_components/Features';

export const dynamic = 'force-dynamic';

interface SpotifyTokenResponse {
  access_token: string;
  error?: string;
}


export default function HomePage() {

  return (
    <main>
      <div className="h-auto w-full text-white flex flex-col items-center justify-center">
        <SignedOut>
          <div className="h-full w-full text-2xl text-center">Please Sign In :)</div>
        </SignedOut>
        <SignedIn>
          <VolumeProvider>
            <SpotifyProfile />  
            <ConnectBtn />
            <SpotifyFeatures />
          </VolumeProvider>
        </SignedIn>
      </div>
    </main>
  );
}