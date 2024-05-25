'use client';

import { useEffect, useRef, useState } from "react";

interface Artist {
    name: string;
    external_urls: {
        spotify: string;
    };    
}

interface Album {
    name: string;
    release_date: string;
    total_tracks: number;
    images: Array<{ url: string; height: number; width: number }>;
}

interface Track {
    id: string;
    name: string;
    artists: Artist[];
    album: Album;
    preview_url: string;
    track_number: number;
    external_urls: {
        spotify: string;
    };
}

interface SpotifyTopTracksResponse {
    items: Track[];
}
export default function TopTracks() {
    var position = 1;
    var trackNo = 0;
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [sampleColors, setSampleColors] = useState<{ [key: string]: string }>({}); // Track ID -> Color

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await fetch('/api/spotifyAPICalls/getTopTracks?time_range=medium_term&limit=20&offset=0');
                if (!response.ok) {
                    throw new Error('Failed to fetch top tracks');
                }
                const data: SpotifyTopTracksResponse = await response.json() as SpotifyTopTracksResponse;
                console.log(data.items);
                setTracks(data.items);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                }
            }
        };

        fetchTopTracks().catch((err) => console.error(err));

    }, []);
    
    const getColorFromImage = (imageUrl: string, trackId: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
    
        const image = new Image();
        image.crossOrigin = "Anonymous"; // This is important to avoid CORS issues
        image.src = imageUrl;
    
        image.onload = () => {
            context.drawImage(image, 0, 0, 1, 1);
            const pixelData = context.getImageData(0, 0, 1, 1);
            if (!pixelData) return;
            const pixel = pixelData.data;
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
            console.log(`Track ID: ${trackId}, Sample Color: ${color}`); // Log the track ID and sample color
            setSampleColors(prevColors => ({ ...prevColors, [trackId]: color }));
        };
    };

    useEffect(() => {
        tracks.forEach(track => {
            if (track.album.images.length > 0) {
                console.log(`Extracting color for Track ID: ${track.id}`); // Log the track ID before extracting color
                getColorFromImage(track.album.images[0].url, track.id);
            }
        });
    }, [tracks]);

    const removeTextInParentheses = (str: string) => {
        const splitStr = str.split('(');
        if (splitStr.length > 0) {
            return splitStr[0]?.trim();
        }
        return str;
    };

    return (
        <div>
            <div className="flex flex-row items-center justify-center">
            <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                    <h1>#{position++}</h1>
                    <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                    {tracks.length > 0 && (
                        <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                            <div className="relative w-full h-64">
                                <img src={tracks[trackNo]?.album.images[trackNo]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
                                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                    <p className="text-sm text-gray-300 text-center mb-2">
                                        Album: {tracks[trackNo]?.album.name} 
                                    </p>
                                    <p className="text-sm text-gray-300 text-center mb-2">
                                        Track: {tracks[trackNo]?.track_number} of {tracks[trackNo]?.album.total_tracks}
                                    </p>
                                    <p className="text-sm text-gray-300 text-center mb-2">
                                        By: {tracks[trackNo]?.artists.map(artist => artist.name).join(', ')}
                                    </p>
                                    <button
                                        className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                        // onClick={() => handlePlay(tracks[0].id)}
                                    >
                                        {currentTrackId === tracks[trackNo]?.id ? 'Pause' : 'Play'}
                                    </button>
                                    <audio id={`audio-${tracks[trackNo]?.id}`} src={tracks[trackNo]?.preview_url} className="hidden"></audio>
                                    <a href={tracks[trackNo]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                </div>
                                <p className="text-lg font-semibold text-center">{tracks[trackNo]?.name}</p>
                            </div>
                            <div style={{ backgroundColor: sampleColors[tracks[trackNo++]?.id ?? ""] }} className="w-full h-8 rounded-b-lg"></div>
                        </li>
                    )}
                </div>
                <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                    <h1>#{position++}</h1>
                    {tracks.length > 1 && (
                        <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                            <div className="relative w-full h-64">
                                <img src={tracks[trackNo]?.album.images[0]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
                                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                    <p className="text-sm text-gray-300 text-center mb-2">
                                        By: {tracks[trackNo]?.artists.map(artist => artist.name).join(', ')}
                                    </p>
                                    <button
                                        className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                    // onClick={() => handlePlay(tracks[0].id)}
                                    >
                                        {currentTrackId === tracks[trackNo]?.id ? 'Pause' : 'Play'}
                                    </button>
                                    <audio id={`audio-${tracks[trackNo]?.id}`} src={tracks[trackNo]?.preview_url} className="hidden"></audio>
                                    <a href={tracks[trackNo]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                </div>
                                <p className="text-lg font-semibold text-center">{tracks[trackNo]?.name}</p>
                            </div>
                            <div style={{ backgroundColor: sampleColors[tracks[trackNo++]?.id ?? ""] }} className="w-full h-8 rounded-b-lg"></div>
                        </li>
                    )}
                </div>
                <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                    <h1>#{position++}</h1>
                    {tracks.length > 1 && (
                        <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                            <div className="relative w-full h-64">
                                <img src={tracks[trackNo]?.album.images[0]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
                                <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                    <p className="text-sm text-gray-300 text-center mb-2">
                                        By: {tracks[trackNo]?.artists.map(artist => artist.name).join(', ')}
                                    </p>
                                    <button
                                        className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                    // onClick={() => handlePlay(tracks[0].id)}
                                    >
                                        {currentTrackId === tracks[trackNo]?.id ? 'Pause' : 'Play'}
                                    </button>
                                    <audio id={`audio-${tracks[trackNo]?.id}`} src={tracks[trackNo]?.preview_url} className="hidden"></audio>
                                    <a href={tracks[trackNo]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                </div>
                                
                            </div>
                            <div style={{ backgroundColor: sampleColors[tracks[trackNo]?.id ?? ''] }} className="w-full h-8 rounded-b-lg"><p className="text-lg font-semibold text-center">{removeTextInParentheses(tracks[trackNo++]?.name ?? '')}</p></div>
                        </li>
                    )}
                </div>
                
            </div>
            <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {tracks.map((track) => (
                        <div className="track-card-rest">
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
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}