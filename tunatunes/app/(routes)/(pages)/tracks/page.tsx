'use client';
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { SpotifyTopTracksResponse, Tracks } from "@/types/type";
import { useEffect, useState } from "react";
import TopTracksDisplay from "./components/top-tracks";
import { Heading } from "@/components/ui/heading";
// import TopArtistsDisplay from "./components/top-tracks";

const ArtistsPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('short_term');
    const [tracks, setTracks] = useState<Tracks[]>([]);
    const [limit, setLimit] = useState(19);

    const buildSpotifyTracksURL = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotify/getTopTracks';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
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
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    }, []);

    const handleTabChange = (value: string) => {
        switch (value) {
            case 'this-month':
                setTimeRange('short_term');
                break;
            case 'this-year':
                setTimeRange('medium_term');
                break;
            case 'all-time':
                setTimeRange('long_term');
                break;
            default:
                setTimeRange('short_term');
        }
    };

    const loadMoreTracks = () => {
        setLimit(prevLimit => prevLimit + 10);
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    };

    return (
        <div className="h-full w-full">
            <Heading title="Top Tracks" description="Your top tracks" />
            <Tabs defaultValue="this-month" onValueChange={handleTabChange}>
                <TabsList className="h-full w-full">
                    <TabsTrigger value="this-month" className="text-xl px-8">This Month</TabsTrigger>
                    <TabsTrigger value="this-year" className="text-xl px-8">This Year</TabsTrigger>
                    <TabsTrigger value="all-time" className="text-xl px-8">All Time</TabsTrigger>
                </TabsList>
                <TabsContent value="this-month">
                    <TopTracksDisplay tracks={tracks} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
                <TabsContent value="this-year">
                    <TopTracksDisplay tracks={tracks} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
                <TabsContent value="all-time">
                    <TopTracksDisplay tracks={tracks} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ArtistsPage;
