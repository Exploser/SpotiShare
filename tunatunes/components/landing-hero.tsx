'use client';

import TypewriterComponent from 'typewriter-effect';
import { Button } from "./ui/button";
import Link from "next/link";

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;
const SCOPE = process.env.NEXT_PUBLIC_SCOPE;

export const LandingHero = () => {
    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold h-full">
                Welcome to TunaTunes
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 py-8">
                    <TypewriterComponent 
                        options = {{
                            strings: ["Top Artists", "Top Tracks", "Find new Music"],
                            autoStart: true,
                            loop: true,
                            delay: 50,
                            wrapperClassName: 'mt-2',
                        }}
                    />
                </div>
                <div className="text-sm md:text-xl font-light text-zinc-400">
                    Discover new music and artists with TunaTunes
                </div>
                <div>
                    <Link href={`https://accounts.spotify.com/authorize/?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`}>
                        <Button variant={'premium'} className="md:text-lg p-4 md:p-6 rounded-full font-semibold">
                            Continue with Spotify
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
};