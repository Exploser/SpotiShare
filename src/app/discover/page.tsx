'use client';
import { useEffect, useState } from "react";
import { SpotifyTopTracksResponse } from "../toptracks/page";

export default function discover() {
    const [error, setError] = useState<string | null>(null);
    const [artists, setTracks] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(19);
    const buildSpotifyAPIUrl = (timeRange = 'seed_artists=4NHQUGzhtTLFvgF5SZesLK', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotifyAPICalls/getRecommendations';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        // return `${baseUrl}?${params.toString()}`;
        return baseUrl;
    };
    const fetchTopTracks = async (timeRange: string, limit: number) => {
        try {
            const url = buildSpotifyAPIUrl(timeRange, limit);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
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
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    }, []);

    return (
        <section>
            {artists.map((track) => (
                <div key={track.id}>
                    <h1>{track.tracks.album.album_type}</h1>
                </div>
            ))}
        </section>
    )
}