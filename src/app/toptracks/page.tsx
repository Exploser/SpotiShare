'use client';

import { useEffect, useState } from "react";

interface Artist {
    name: string;
}

interface Album {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
}

interface Track {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    preview_url: string;
    external_urls: {
        spotify: string;
    };
}

interface SpotifyTopTracksResponse {
    items: Track[];
}
export default function TopTracks() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await fetch('/api/spotifyAPICalls/getTopTracks?time_range=medium_term&limit=20&offset=0');
                if (!response.ok) {
                    throw new Error('Failed to fetch top tracks');
                }
                const data: SpotifyTopTracksResponse = await response.json() as SpotifyTopTracksResponse;
                setTracks(data.items);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        };

        fetchTopTracks().catch((err) => console.error(err));

    }, []);

    return (
        <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {tracks.map((track) => (
                        <li key={track.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center">
                            <img src={track.album.images[0]?.url} alt={track.name} className="w-full h-32 object-cover rounded-md mb-4" />
                            <p className="text-lg font-semibold text-center">{track.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">{track.artists.map(artist => artist.name).join(', ')}</p>
                            <button
                                className="play-button bg-blue-500 text-white px-4 py-2 rounded-md"
                                // onClick={() => handlePlay(track.id)}
                            >
                                {currentTrackId === track.id ? 'Pause' : 'Play'}
                            </button>
                            <audio id={`audio-${track.id}`} src={track.preview_url} className="hidden"></audio>
                            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                        </li>
                    ))}
                </ul>
        </div>
    );
}