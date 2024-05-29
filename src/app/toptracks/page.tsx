'use client';

import { useEffect, useRef, useState } from "react";
import TopTracksController from "~/_components/TopTracksController";
import VolumeController from "~/_components/VolumeController";
import { VolumeProvider, useVolume } from "~/context/VolumeContext";
import 'animate.css';

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
    let position = 3;
    const { volume } = useVolume();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
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

    const handlePlay = (trackId: string) => {
        const audioElement = document.getElementById(`audio-${trackId}`) as HTMLAudioElement | null;
        if (!audioElement) return;

        if (currentTrackId === trackId) {
            // Pause the current track
            audioElement.pause();
            setCurrentTrackId(null);
        } else {
            // Pause any currently playing track
            const currentAudio = document.querySelector('audio.playing')! as HTMLAudioElement | null;
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.classList.remove('playing');
            }

            // Play the new track
            audioElement.volume = volume;
            audioElement.play().catch((err) => console.error(err));
            audioElement.classList.add('playing');
            setCurrentTrackId(trackId);
        }
    };

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

    return (
        <div>
            <VolumeController />
            <div className={`${imageLoaded ? "" : "hidden" }`}>
                <div className="flex flex-row mb-4 p-12" id="spotify-top-tracks-main">
                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInLeft' : 'hidden'}`} id="spotify-top-track-second">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[1]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center">
                                <div className="relative w-full h-64">
                                    <img
                                        src={tracks[1]?.album.images[0]?.url}
                                        alt={tracks[1]?.name}
                                        className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform"
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {tracks[1]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {tracks[1]?.track_number} of {tracks[1]?.album.total_tracks}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {tracks[1]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <button
                                            className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                            onClick={() => handlePlay(tracks[1]?.id ?? '')}
                                        >
                                            {currentTrackId === tracks[1]?.id ? 'Pause' : 'Play'}
                                        </button>
                                        <audio id={`audio-${tracks[1]?.id}`} src={tracks[1]?.preview_url} className="hidden"></audio>
                                        <a href={tracks[1]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[1]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-track-title">{removeTextInParentheses(tracks[1]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#2</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInDown' : 'hidden'}`} id="spotify-top-track-first">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[0]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center" style={{ backgroundColor: sampleColors[tracks[0]?.id ?? ""] }}>
                                <div className="relative w-full h-64" style={{ backgroundColor: sampleColors[tracks[0]?.id ?? ""] }}>
                                    <img src={tracks[0]?.album.images[0]?.url} alt={tracks[0]?.name} className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform" />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {tracks[0]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {tracks[0]?.track_number} of {tracks[0]?.album.total_tracks}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {tracks[0]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <button
                                            className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                            onClick={() => handlePlay(tracks[0]?.id ?? '')}
                                        >
                                            {currentTrackId === tracks[0]?.id ? 'Pause' : 'Play'}
                                        </button>
                                        <audio id={`audio-${tracks[0]?.id}`} src={tracks[0]?.preview_url} className="hidden"></audio>

                                        <a href={tracks[0]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[0]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-track-title">{removeTextInParentheses(tracks[0]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#1</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInRight' : 'hidden'}`} id="spotify-top-track-third">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {tracks.length > 0 && (
                            <li key={tracks[2]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center" style={{ backgroundColor: sampleColors[tracks[2]?.id ?? ""] }}>
                                <div className="relative w-full h-64">
                                    <img src={tracks[2]?.album.images[0]?.url} alt={tracks[2]?.name} className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform" />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {tracks[2]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {tracks[2]?.track_number} of {tracks[2]?.album.total_tracks}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {tracks[2]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <button
                                            className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                            onClick={() => handlePlay(tracks[2]?.id ?? '')}
                                        >
                                            {currentTrackId === tracks[2]?.id ? 'Pause' : 'Play'}
                                        </button>
                                        <audio id={`audio-${tracks[2]?.id}`} src={tracks[2]?.preview_url} className="hidden"></audio>
                                        <a href={tracks[2]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[tracks[2]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-track-title">{removeTextInParentheses(tracks[2]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#3</h1>
                    </div>
                </div>

                <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {tracks.slice(3).map((track) => (
                            <li key={track.id} className={`relative rounded-lg shadow-md p-2 flex flex-col items-center ${imageLoaded ? 'animate__animated animate__fadeInUpBig' : 'hidden'}`} style={{ backgroundColor: sampleColors[track.id] }}>
                                <div className="relative w-full" id="spotify-tracks-rest">
                                    <img src={track.album.images[0]?.url} alt={track.name} className="w-full object-contain shadow-xl rounded-md mb-2" />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">Album: {track.album.name}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Track: {track.track_number} of {track.album.total_tracks}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">By: {track.artists.map(artist => artist.name).join(', ')}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <button className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2" onClick={() => handlePlay(track.id)}>
                                                {currentTrackId === track.id ? 'Pause' : 'Play'}
                                            </button>
                                            <audio id={`audio-${track.id}`} src={track.preview_url} className="hidden"></audio>
                                            <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                    </div>
                                    <p className="text-lg font-semibold text-center spotify-track-title">#{position++} {removeTextInParentheses(track.name)}</p>
                                </div>
                            </li>

                        ))}
                    </ul>
                </div>
            </div>
            <div id="controller">
                <div className="flex flex-col items-center justify-center mb-4">
                    <TopTracksController
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        limit={limit}
                        setLimit={setLimit}
                        handleRefetch={() => fetchTopTracks(timeRange, limit)}
                    />
                </div>
            </div>
        </div>
    );
}