'use client';
import { LandingHero } from "@/components/landing-hero";
import { LandingNavbar } from "@/components/landing-navbar";
import SpotifyProfile from "@/components/spotify-profile";

export default function Home() {

  return (
    <div className="h-full bg-[#501069] w-full">
      <LandingNavbar />
      <LandingHero />
    </div>
  );
}
