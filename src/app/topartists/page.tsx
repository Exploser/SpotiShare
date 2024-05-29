'use client';

import { useEffect, useRef, useState } from "react";
import TopTracksController from "~/_components/TopTracksController";
import { useVolume } from "~/context/VolumeContext";
import 'animate.css';

interface Artist {
    name: string;
    id: string;
    external_urls: {
        spotify: string;
    };
    spotify: string;
    images: Array<{ url: string; height: number; width: number }>;
    followers: { total: number };
    genres: string[];
    popularity: number;
}

interface SpotifyTopTracksResponse {
    items: Artist[];
}
export default function TopTracks() {
    let position = 4;
    const [artists, setTracks] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({}); // Track ID -> Color
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(19);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const buildSpotifyAPIUrl = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotifyAPICalls/getTopArtists';
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
                throw new Error('Failed to fetch top artists');
            }
            const data: SpotifyTopTracksResponse = await response.json() as SpotifyTopTracksResponse;
            setTracks(data.items);
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

    const getColorFromImage = (imageUrl: string, artistId: string) => {
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
            setSampleColors(prevColors => ({ ...prevColors, [artistId]: color }));
        };
    };

    useEffect(() => {
        artists.forEach(artist => {
            if (artist.images.length > 0 && artist.images[0]) {
                getColorFromImage(artist.images[0].url, artist.id);
            }
        });
    }, [artists]);

    const removeTextInParentheses = (str: string) => {
        const splitStr = str.split('(');
        if (splitStr.length > 0) {
            return splitStr[0]?.trim();
        }
        return str;
    };

    return (
        <div>
            <h1 className={`${imageLoaded ? "font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight artisting-tight font-bold my-4 mx-auto max-w-2xl" : "hidden"}`} id="top-artist-heading">
                Top Artists
            </h1>
            <div className={`${imageLoaded ? "" : "hidden"}`}>
            <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>

                {/* <div className="flex flex-row mb-4 p-4" id="spotify-top-artists-main">
                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInLeft' : 'hidden'}`} id="spotify-top-artist-second">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[1]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center">
                                <div className="relative w-full h-64">
                                    <img
                                        src={artists[1]?.album.images[0]?.url}
                                        alt={artists[1]?.name}
                                        className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform"
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {artists[1]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {artists[1]?.artist_number} of {artists[1]?.album.total_artists}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {artists[1]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <button
                                            className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                            onClick={() => handlePlay(artists[1]?.id ?? '')}
                                        >
                                            {currentTrackId === artists[1]?.id ? 'Pause' : 'Play'}
                                        </button>
                                        <audio id={`audio-${artists[1]?.id}`} src={artists[1]?.preview_url} className="hidden"></audio>
                                        <a href={artists[1]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[artists[1]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-artist-title">{removeTextInParentheses(artists[1]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#2</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInDown' : 'hidden'}`} id="spotify-top-artist-first">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[0]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center" style={{ backgroundColor: sampleColors[artists[0]?.id ?? ""] }}>
                                <div className="relative w-full h-64" style={{ backgroundColor: sampleColors[artists[0]?.id ?? ""] }}>
                                    <img src={artists[0]?.album.images[0]?.url} alt={artists[0]?.name} className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform" />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {artists[0]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {artists[0]?.artist_number} of {artists[0]?.album.total_artists}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {artists[0]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <button
                                            className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2"
                                            onClick={() => handlePlay(artists[0]?.id ?? '')}
                                        >
                                            {currentTrackId === artists[0]?.id ? 'Pause' : 'Play'}
                                        </button>
                                        <audio id={`audio-${artists[0]?.id}`} src={artists[0]?.preview_url} className="hidden"></audio>

                                        <a href={artists[0]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[artists[0]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-artist-title">{removeTextInParentheses(artists[0]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#1</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInRight' : 'hidden'}`} id="spotify-top-artist-third">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[2]?.id} className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center" style={{ backgroundColor: sampleColors[artists[2]?.id ?? ""] }}>
                                <div className="relative w-full h-64">
                                    <img src={artists[2]?.album.images[0]?.url} alt={artists[2]?.name} className="w-full h-full object-cover rounded-xl shadow-xl transition-transform transform" />
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Album: {artists[2]?.album.name}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            Track: {artists[2]?.artist_number} of {artists[2]?.album.total_artists}
                                        </p>
                                        <p className="text-sm text-gray-300 text-center mb-2">
                                            By: {artists[2]?.artists.map(artist => artist.name).join(', ')}
                                        </p>
                                        <audio id={`audio-${artists[2]?.id}`} src={artists[2]?.preview_url} className="hidden"></audio>
                                        <a href={artists[2]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen on Spotify</a>
                                    </div>
                                </div>
                                <div style={{ backgroundColor: sampleColors[artists[2]?.id ?? ""] }} className="w-full h-8 rounded-b-lg">
                                    <p className="text-lg font-semibold text-center mt-1 spotify-artist-title">{removeTextInParentheses(artists[2]?.name ?? '')}</p>
                                </div>
                            </li>
                        )}
                        <h1>#3</h1>
                    </div>
                </div> */}

                <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {artists.map((artist) => (
                            <li key={artist.id} className={`relative rounded-lg shadow-md p-2 flex flex-col items-center ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`} style={{ backgroundColor: sampleColors[artist.id] }}>
                                <div className="relative w-full" id="spotify-artists-rest">
                                    <img src={artist.images[0]?.url} alt={artist.name} className="w-full object-contain shadow-xl rounded-md mb-2" onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}/>
                                    <div className="absolute inset-0 bg-black bg-opacity-70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                        <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artist.popularity}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Followers: {artist.followers.total}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-gray-300 text-center mb-2">{artist.genres.map(genres => genres).join(', ')}</p>
                                    </div>
                                    <p className="text-lg font-semibold text-center spotify-artist-title">#{position++} {removeTextInParentheses(artist.name)}</p>
                                </div>
                            </li>

                        ))}
                    </ul>
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
            <div className={`${imageLoaded ? "hidden" : "flex justify-center items-center text-white h-screen"}`}>
                {/* <p className="text-3xl">Loading...  &nbsp;</p>  */}
                <svg width="126" height="126" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <style>
                        {`.spinner_GmWz{ 
                            fill: white;
                            animation: spinner_Ctle 0.8s linear infinite; 
                            animation-delay: -0.8s; }

                            .spinner_NuDr { animation-delay: -0.65s; }
                            .spinner_OlQ0 { animation-delay: -0.5s; }
                            @keyframes spinner_Ctle { 93.75%, 100% { opacity: 0.2; } }`}
                    </style>
                    <rect className="spinner_GmWz" x="1" y="4" width="6" height="14" />
                    <rect className="spinner_GmWz spinner_NuDr" x="9" y="4" width="6" height="14" />
                    <rect className="spinner_GmWz spinner_OlQ0" x="17" y="4" width="6" height="14" />
                </svg>
            </div>
        </div>
    );
}