// Code: src/app/discover/page.tsx
'use client';

import { Heading } from "@/components/ui/heading";
import { useEffect, useRef, useState } from "react";
import TopTracksDisplay from "@/components/top-tracks";
import { SpotifyRecommendationsResponse, Tracks } from "@/types/type";
import VolumeController from "@/components/volume-controller";

export default function Discover() {
    const [tracks, setTracks] = useState<Tracks[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [seed_tracks, setSeedTracks] = useState('');
    const [seed_artists, setSeedArtists] = useState('');
    const [seed_genres, setSeedGenres] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const seedtracks = urlParams.get('seed_tracks');
            const seedartists = urlParams.get('seed_artists');
            const seedgenres = urlParams.get('seed_genres');

            if (seedtracks) {
                const selectedIds = seedtracks.split(',');
                const seedTracks = selectedIds.slice(0, 5).join(',');
                setSeedTracks(seedTracks);
            }
            if (seedartists) {
                const selectedIds = seedartists.split(',');
                const seedArtists = selectedIds.slice(0, 5).join(',');
                setSeedArtists(seedArtists);
            }
            if (seedgenres) {
                const selectedIds = seedgenres.split(',');
                const seedGenres = selectedIds.slice(0, 5).join(',');
                setSeedGenres(seedGenres);
            }
        }
    }, [isMounted]);

    useEffect(() => {
        if (seed_tracks || seed_artists) {
            fetchRecommendations(seed_tracks, seed_artists, seed_genres).catch((err) =>
                console.error(err)
            );
        }
    }, [seed_tracks, seed_artists, seed_genres]);

    const buildSpotifyAPIUrl = (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
        const baseUrl = '/api/spotify/getRecommendations';
        const params = new URLSearchParams();

        if (seed_tracks) {
            params.append('seed_tracks', seed_tracks);
        }

        if (seed_artists) {
            params.append('seed_artists', seed_artists);
        }

        if (seed_genres) {
            params.append('seed_genres', seed_genres);
        }

        return `${baseUrl}?${params.toString()}`;
    };

    const fetchRecommendations = async (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
        try {
            const url = buildSpotifyAPIUrl(seed_tracks, seed_artists, seed_genres);
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top tracks');
            }
            const data: SpotifyRecommendationsResponse = await response.json() as SpotifyRecommendationsResponse;
            console.log(data, 'data');
            setTracks(data.tracks);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    return (
        <section>
            <Heading title="Discover" description="Here are our top recommendations!" />
            <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
            <div className="max-w-screen-lg h-full w-fit text-white">
                <TopTracksDisplay tracks={tracks} />
            </div>
            <VolumeController />
        </section>
    );
}
