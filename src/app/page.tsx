import { SignedIn, SignedOut } from '@clerk/nextjs';
import SpotifyProfile from '~/_components/SpotifyProfile';
import { VolumeProvider } from '~/context/VolumeContext';
import SpotifyFeatures from '~/_components/Features';

export const dynamic = 'force-dynamic';

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
            <SpotifyFeatures />
          </VolumeProvider>
        </SignedIn>
      </div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </main>
  );
}