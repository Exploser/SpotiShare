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

    const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set isMounted to true when the component mounts
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const seed_tracks = urlParams.get('seed_tracks');
      const seed_artists = urlParams.get('seed_artist');
      
      if (seed_tracks) {
        const selectedIds = seed_tracks.split(',');
        console.log('Selected Discover Tracks:', selectedIds);  // Log the IDs
        const seedTracks = selectedIds.slice(0, 5).join(',');
        fetchRecommendations(seedTracks, '', '').catch((err) => console.error(err));
      }
      if (seed_artists) {
        const selectedIds = seed_artists.split(',');
        console.log('Selected Discover Artist:', selectedIds);  // Log the IDs
        const seedArtists = selectedIds.slice(0, 5).join(',');
        fetchRecommendations('', seedArtists, '').catch((err) => console.error(err));
      }
    }
  }, [isMounted]);


    const [seed_tracks, setSeedTracks] = useState('0725YWm6Z0TpZ6wrNk64Eb');
    const [seed_artists, setSeedArtists] = useState('2h93pZq0e7k5yf4dywlkpM');
    const [seed_genres, setSeedGenres] = useState('heavy-metal');

    const buildSpotifyAPIUrl = (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
      const baseUrl = '/api/spotifyAPICalls/getRecommendations';
      const params = new URLSearchParams();
    
      if (seed_tracks) {
        params.append('seed_tracks', seed_tracks);
      }
    
      if (seed_artists) {
        params.append('seed_artists', seed_artists);
      }
    
      if (seed_genres) {
        console.log('HELLO'+seed_genres);
        params.append('seed_genres', seed_genres);
      }
    
      return `${baseUrl}?${params.toString()}`;
    };
    
    const fetchRecommendations = async (seed_tracks: string, seed_artists: string, seed_genres: string) => {
        console.log(seed_tracks, seed_artists, seed_genres);
        try {
            const url = buildSpotifyAPIUrl(seed_tracks, seed_artists, seed_genres);
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
      fetchRecommendations(seed_tracks, seed_artists, seed_genres).catch((err) => console.error(err));
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
            handleRefetch={() => fetchRecommendations(seed_tracks, seed_artists, seed_genres)}
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
