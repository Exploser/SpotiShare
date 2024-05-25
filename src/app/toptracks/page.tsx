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
    let position = 1;
    let trackNo = 0;
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({}); // Track ID -> Color
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(19);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const buildSpotifyAPIUrl = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotifyAPICalls/getTopTracks';
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

    useEffect(() => {
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
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
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
            setSampleColors(prevColors => ({ ...prevColors, [trackId]: color }));
        };
    };

    useEffect(() => {
        tracks.forEach(track => {
            if (track.album.images.length > 0 && track.album.images[0]) {
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
    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(e.target.value);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(e.target.value));
    };

    const handleRefetch = () => {
        fetchTopTracks(timeRange, limit).catch((err) => console.error(err));
    };

    return (
        <div>
            <div>
                <div className="flex flex-col items-center justify-center mb-4">
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="timeRange"
                                value="short_term"
                                checked={timeRange === 'short_term'}
                                onChange={handleTimeRangeChange}
                            />
                            Short Term
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="timeRange"
                                value="medium_term"
                                checked={timeRange === 'medium_term'}
                                onChange={handleTimeRangeChange}
                            />
                            Medium Term
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="timeRange"
                                value="long_term"
                                checked={timeRange === 'long_term'}
                                onChange={handleTimeRangeChange}
                            />
                            Long Term
                        </label>
                    </div>
                    <div>
                        <label>
                            Limit:
                            <input
                                type="number"
                                value={limit}
                                onChange={handleLimitChange}
                                className="ml-2"
                            />
                        </label>
                    </div>
                    <button
                        onClick={handleRefetch}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                        Refetch Tracks
                    </button>
                </div>
            </div>
            <div>
                <div className="flex flex-row items-center justify-center mb-4">
                    <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                        <h1>#{position++}</h1>
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                                <div className="relative w-full h-64" style={{ backgroundColor: sampleColors[tracks[trackNo]?.id ?? ""] }}>
                                    <img src={tracks[trackNo]?.album.images[0]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
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
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[trackNo]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center">{removeTextInParentheses(tracks[trackNo++]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                    </div>
                    <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                        <h1>#{position++}</h1>
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                                <div className="relative w-full h-64">
                                    <img src={tracks[trackNo]?.album.images[0]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
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
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[trackNo]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center">{removeTextInParentheses(tracks[trackNo++]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                    </div>
                    <div className="max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center">
                        <h1>#{position++}</h1>
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[trackNo]?.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-1 flex flex-col items-center">
                                <div className="relative w-full h-64">
                                    <img src={tracks[trackNo]?.album.images[0]?.url} alt={tracks[trackNo]?.name} className="w-full h-full object-cover rounded-xl" />
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
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[trackNo]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center">{removeTextInParentheses(tracks[trackNo++]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                    </div>
                </div>
                <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {tracks.slice(3).map((track) => (
                            <li key={track.id} className="rounded-lg shadow-md p-4 flex flex-col items-center" style={{ backgroundColor: sampleColors[track.id] }} >
                                <img src={track.album.images[0]?.url} alt={track.name} className="w-full h-45 object-contain shadow-xl rounded-md mb-4" />
                                <p className="text-lg font-semibold text-center">{removeTextInParentheses(tracks[trackNo++]?.name ?? '')}</p>
                                <p className="text-sm text-grey-600 dark:text-gray-400 text-center mb-2" id="tracks-rest-artist">{track.artists.map(artist => artist.name).join(', ')}</p>
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
            </div>
        </div>
    );
}