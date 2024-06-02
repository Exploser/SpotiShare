// Code: src/app/discover/page.tsx

'use client';

import { useEffect, useState } from "react";
import SavedController from "~/_components/SavedController";

interface Image {
    url: string;
    height: number;
    width: number;
  }
  
  interface ExternalUrls {
    spotify: string;
  }
  
  interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
    followers?: {
      href: string;
      total: number;
    };
    genres?: string[];
    images?: Image[];
    popularity?: number;
  }
  
  interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: {
      reason: string;
    };
    type: string;
    uri: string;
    artists: Artist[];
  }
  
  interface ExternalIds {
    isrc: string;
    ean: string;
    upc: string;
  }
  
  interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from?: any; // Adjust the type if you have a specific structure for this field
    restrictions?: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  }
  
  interface TracksResponse {
    tracks: Track[];
  }

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