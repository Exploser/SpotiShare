'use client';
import SpotifyProfile from "@/components/spotify-profile";
import { Artist, SpotifyTopArtistsResponse } from "@/types/type";
import { useEffect, useState } from "react";

const DashboardPage = () => {
    const [artists, setArtitst] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(19);

    const buildSpotifyAPIUrl = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotify/getTopArtists';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
    };
    const fetchTopTracks = async (timeRange: string, limit: number) => {
        try {
            const url = buildSpotifyAPIUrl(timeRange, limit);
            const response = await fetch(url);
            console.log('response:', response);
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

    useEffect(() => {
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    }, []);
    return ( 
        <div>
            <h1 className="font-semibold text-4xl p-4">Dashboard</h1>
            <h3 className="font-bold text-2xl py-8 px-4"> Hello, </h3>
            <div className="flex justify-center items-center w-full">
                <SpotifyProfile />
            </div>
            <h3 className="font-bold text-2xl py-8 px-4"> Top Artists</h3>
            <div>

            </div>
        </div>
     );
}
 
export default DashboardPage;