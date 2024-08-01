'use client';
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Artist, SpotifyTopArtistsResponse } from "@/types/type";
import { useEffect, useState } from "react";
import TopArtistsDisplay from "./components/top-artists";
import { Heading } from "@/components/ui/heading";

const ArtistsPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [timeRange, setTimeRange] = useState('short_term');
    const [limit, setLimit] = useState(19);

    const buildSpotifyArtistsURL = (timeRange = 'short_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotify/getTopArtists';
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
            const data: SpotifyTopArtistsResponse = await response.json();
            setArtists(data.items);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    useEffect(() => {
        fetchTopArtists(timeRange, limit).catch((err) => console.error(err));
    }, [timeRange, limit]);

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
        fetchTopArtists(timeRange, limit).catch((err) => console.error(err));
    };

    return (
        <div className="h-full w-full">
            <Heading title="Top Artists" description="Your top artists" />
            <Tabs defaultValue="this-month" onValueChange={handleTabChange}>
                <TabsList className="h-full w-full">
                    <TabsTrigger value="this-month" className="text-xl px-8">This Month</TabsTrigger>
                    <TabsTrigger value="this-year" className="text-xl px-8">This Year</TabsTrigger>
                    <TabsTrigger value="all-time" className="text-xl px-8">All Time</TabsTrigger>
                </TabsList>
                <TabsContent value="this-month">
                    <TopArtistsDisplay artists={artists} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
                <TabsContent value="this-year">
                    <TopArtistsDisplay artists={artists} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
                <TabsContent value="all-time">
                    <TopArtistsDisplay artists={artists} loadMoreTracks={loadMoreTracks} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default ArtistsPage;
