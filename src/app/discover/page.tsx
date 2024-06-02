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

export default function Discover() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

    const [seed_genres, setSeedGenres] = useState('heavy-metal');
    const [seed_artists, setSeedArtists] = useState('2h93pZq0e7k5yf4dywlkpM');
    const [seed_tracks, setSeedTracks] = useState('0725YWm6Z0TpZ6wrNk64Eb');

    const buildSpotifyAPIUrl = (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
        const baseUrl = '/api/spotifyAPICalls/getRecommendations';
        if (!seed_tracks && !seed_artists && !seed_genres) {
            return baseUrl;
        } else if (seed_tracks && seed_artists && !seed_genres) {
            return `${baseUrl}?seed_tracks=${seed_tracks}&seed_artists=${seed_artists}`;
        } else if (seed_tracks && seed_artists && seed_genres) {
            const params = new URLSearchParams({
                seed_tracks: seed_tracks,
                seed_artists: seed_artists,
                seed_genres: seed_genres,
            });
            return `${baseUrl}?${params.toString()}`;
        } else {
            return 'Error';
        }
    };
    const fetchTopTracks = async (seed_tracks: string, seed_artists: string, seed_genres: string) => {
        console.log(seed_tracks, seed_artists, seed_genres);
        try {
            const url = buildSpotifyAPIUrl();
            console.log(url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top tracks');
            }
            const data: TracksResponse = await response.json() as TracksResponse;
            setTracks(data.tracks);
            console.log(data.tracks);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }

        console.log(error);
        return error;
    };

    useEffect(() => {
        fetchTopTracks(seed_tracks, seed_artists, seed_genres).catch((err) => console.error(err));
    }, []);

  return (
    <section>
        <SavedController 
            seedtracks={seed_tracks}
            setSeedTracks={setSeedTracks}
            seedartists={seed_artists}
            setSeedArtists={setSeedArtists}
            seedgenres={seed_genres}
            setSeedGenres={setSeedGenres}
            handleRefetch={() => fetchTopTracks(seed_tracks, seed_artists, seed_genres)}
         />
        {tracks.length > 0 && (
            <div>
                <h2>Recommendations</h2>
                <ul>
                    {tracks.map((track) => (
                        <li key={track.id}>
                            <h3>{track.name}</h3>
                            <img src={`${track.album.images[0]?.url}`} alt={track.name} />
                            <p>{track.album.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </section>
  );
}
