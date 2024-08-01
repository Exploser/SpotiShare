'use client';
import SpotifyProfile from "@/components/spotify-profile";
import { Artist, SpotifyTopArtistsResponse, SpotifyTopTracksResponse, Tracks } from "@/types/type";
import { useEffect, useState } from "react";
import TopArtistsCarousel from "./components/top-artists-carousel";
import TopTracksCarousel from "./components/top-tracks-carousel";

const DashboardPage = () => {
    const [artists, setArtitst] = useState<Artist[]>([]);
    const [tracks, setTracks] = useState<Tracks[]>([]);
    const [error, setError] = useState<string | null>(null);
    const timeRange = 'short_term';
    const limit = 5;

    const buildSpotifyArtistsURL = (timeRange = 'short_term', limit = 5, offset = 0) => {
        const baseUrl = '/api/spotify/getTopArtists';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
    };
    const buildSpotifyTracksURL = (timeRange = 'short_term', limit = 5, offset = 0) => {
        const baseUrl = '/api/spotify/getTopTracks';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
    };
    const fetchTopArtists = async (timeRange: string, limit: number) => {
        try {
            const url = buildSpotifyArtistsURL(timeRange, limit);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
            }
            const data: SpotifyTopArtistsResponse = await response.json() as SpotifyTopArtistsResponse;
            setArtitst(data.items);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        console.log(error);
        return error;
    };
    const fetchTopTracks = async (timeRange: string, limit: number) => {
        try {
            const url = buildSpotifyTracksURL(timeRange, limit);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top tracks');
            }
            const data: SpotifyTopTracksResponse = await response.json() as SpotifyTopTracksResponse;
            setTracks(data.items);
            console.log(data.items);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        console.log(error);
        return error;
    };

    useEffect(() => {
        fetchTopArtists(timeRange, limit).catch((err) => console.error(err));
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    }, []);
    return (
        <div className="min-h-full">
            <h1 className="font-semibold text-4xl p-4">Dashboard</h1>
            <h3 className="font-bold text-2xl py-8 px-4"> Hello, </h3>
            <div className="flex justify-center items-center w-full">
                <SpotifyProfile />
            </div>
            <h3 className="font-bold text-2xl py-8 px-4"> Top Artists</h3>
            <div className="w-fit">
                <TopArtistsCarousel artists={artists} />
            </div>
            <h3 className="font-bold text-2xl py-8 px-4"> Top Tracks</h3>
            <div className="w-fit">
                <TopTracksCarousel tracks={tracks} />
            </div>
        </div>
    );
}

export default DashboardPage;