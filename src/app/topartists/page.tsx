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
export default function TopArtists() {
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
            const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, 0.9`;
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
            <h1 className={`${imageLoaded ? "font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-tight font-bold my-4 mx-auto max-w-2xl" : "hidden"}`} id="top-track-heading">
                Top Artists
            </h1>
            <div className={`${imageLoaded ? "" : "hidden"}`}>
                <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>

                <div className="flex flex-row mb-4 p-4" id="spotify-top-artists-main">

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white rounded-2xl flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInLeft' : 'hidden'}`} id="spotify-track-second">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[1]?.id} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center`} style={{ backgroundColor: sampleColors[artists[1]?.id ?? ''] }}>
                                <div className={`relative w-full`} id="spotify-tracks-rest">
                                    <img
                                        src={artists[1]?.images[0]?.url}
                                        alt={artists[1]?.name}
                                        className={`w-full relative text-center object-contain rounded-md transition-all`}
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <p className="absolute bottom-2 left-4 text-lg font-semibold spotify-track-title">{removeTextInParentheses(artists[1]?.name ?? '')}</p>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                                        <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artists[1]?.popularity}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Followers: {artists[1]?.followers.total}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Genres: {artists[1]?.genres.map(genres => genres).join(', ')}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <a href={artists[1]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                        <h1>#2</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInDown' : 'hidden'}`} id="spotify-track-first">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[0]?.id} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center`} style={{ backgroundColor: sampleColors[artists[0]?.id ?? ''] }}>
                                <div className={`relative w-full`} id="spotify-tracks-rest">
                                    <img
                                        src={artists[0]?.images[0]?.url}
                                        alt={artists[0]?.name}
                                        className={`w-full relative text-center object-contain rounded-md transition-all`}
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <p className="absolute bottom-2 left-4 text-lg font-semibold spotify-track-title">{removeTextInParentheses(artists[0]?.name ?? '')}</p>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                                        <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artists[0]?.popularity}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Followers: {artists[0]?.followers.total}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Genres: {artists[0]?.genres.map(genres => genres).join(', ')}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <a href={artists[0]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                        <h1>#1</h1>
                    </div>

                    <div className={`max-w-screen-lg mx-auto p-4 h-full w-full text-white flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__backInRight' : 'hidden'}`} id="spotify-track-third">
                        <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>
                        {artists.length > 0 && (
                            <li key={artists[2]?.id} className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-md p-1 flex flex-col items-center`} style={{ backgroundColor: sampleColors[artists[2]?.id ?? ''] }}>
                                <div className={`relative w-full`} id="spotify-tracks-rest">
                                    <img
                                        src={artists[2]?.images[0]?.url}
                                        alt={artists[2]?.name}
                                        className={`w-full relative text-center object-contain rounded-md transition-all`}
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <p className="absolute bottom-2 left-4 text-lg font-semibold spotify-track-title">{removeTextInParentheses(artists[2]?.name ?? '')}</p>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                                        <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artists[2]?.popularity}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Followers: {artists[2]?.followers.total}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Genres: {artists[2]?.genres.map(genres => genres).join(', ')}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <a href={artists[2]?.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </li>

                        )}
                        <h1>#3</h1>
                    </div>
                </div>

                <div className="max-w-screen mx-auto p-4 h-auto text-white flex flex-col items-center justify-center bg-slate-500 bg-opacity-50 rounded-3xl">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-fit">
                        {artists.slice(3).map((artist) => (
                            <li key={artist.id} className={` w-fit h-fit rounded-xl shadow-md ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`} style={{ backgroundColor: sampleColors[artist.id] }}>
                                <div className={`relative w-full`} id="spotify-tracks-rest">
                                    <img
                                        src={artist.images[0]?.url}
                                        alt={artist.name}
                                        id="artist-img"
                                        className={`w-full relative text-center object-contain rounded-md transition-all`}
                                        onLoad={() => {
                                            setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                        }}
                                    />
                                    <p className="absolute top-2 left-4 text-lg font-sans spotify-track-title">#{position++}</p>
                                    <p className="absolute bottom-2 left-4 text-lg font-semibold spotify-track-title">{removeTextInParentheses(artist.name)}</p>
                                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                                        <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artist.popularity}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Followers: {artist.followers.total}</p>
                                        <p className="text-sm text-gray-300 text-center mb-2">Genres: {artist.genres.map(genres => genres).join(', ')}</p>
                                        <div className="flex flex-row justify-evenly items-center w-full">
                                            <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                                            </a>
                                        </div>
                                    </div>
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
                            items={artists}
                        />
                    </div>
                </div>
            </div>
            <div className={`${imageLoaded ? "hidden" : "flex flex-col justify-center items-center text-white h-screen"}`}>
                <p className="text-3xl">Loading...  &nbsp;</p>
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