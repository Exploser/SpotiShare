'use client';
import { recentlyPlayed, SpotifyPlayHistory } from "@/types/type";
import { useEffect, useState } from "react";
import { RecentClient } from "./components/client";
import { Heading } from "@/components/ui/heading";

const RecentPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('short_term');
    const [tracks, setTracks] = useState<SpotifyPlayHistory[]>([]);
    const [limit, setLimit] = useState(19);

    const buildSpotifyTracksURL = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotify/getRecent';
        const params = new URLSearchParams({
            limit: limit.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const fetchRecent = async (limit: number) => {
        try {
            const url = buildSpotifyTracksURL(timeRange, limit);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top tracks');
            }
            const data: recentlyPlayed = await response.json() as recentlyPlayed;
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
        fetchRecent(limit).catch((err) => console.error(err));
        console.log('fetchRecent(limit):', fetchRecent(limit));
    }, []);

    return ( 
        <div>
            <Heading title="Recent" description="Your Recently played tracks" />
            <RecentClient data={tracks} />
        </div>
     );
}
 
export default RecentPage;