'use client';
import { Heading } from "@/components/ui/heading";
import { Artist, SpotifyTopArtistsResponse, SpotifyTopTracksResponse, Tracks } from "@/types/type";
import { useEffect, useState } from "react";

interface SpotifyGenresResponse {
    genres: string[];
}

const DiscoverPage = () => {
    const [artists, setArtist] = useState<Artist[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [tracks, setTracks] = useState<Tracks[]>([]);
    const [selectedTrackIds, setSelectedTrackIds] = useState<Array<string>>([]);
    const [selectedArtistIds, setSelectedArtistIds] = useState<Array<string>>([]);
    const [selectedGenres, setSelectedGenres] = useState<Array<string>>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(10);

    const buildSpotifyAPIUrl = (timeRange = 'medium_term', limit = 10, offset = 0) => {
        const baseUrl = '/api/spotify/getTopTracks';
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

    const removeTextInParentheses = (str: string) => {
        const splitStr = str.split('(');
        if (splitStr.length > 0) {
            return splitStr[0]?.trim();
        }
        return str;
    };

    const buildSpotifyAPI = (timeRange = 'medium_term', limit = 10, offset = 0) => {
        const baseUrl = '/api/spotify/getTopArtists';
        const params = new URLSearchParams({
            time_range: timeRange,
            limit: limit.toString(),
            offset: offset.toString(),
        });
        return `${baseUrl}?${params.toString()}`;
    };

    const fetchTopArtist = async (timeRange: string, limit: number) => {
        try {
            const url = buildSpotifyAPI(timeRange, limit);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
            }
            const data: SpotifyTopArtistsResponse = await response.json() as SpotifyTopArtistsResponse;
            setArtist(data.items);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        console.log(error);
        return error;
    };

    useEffect(() => {
        fetchTopArtist(timeRange, limit).catch((err) => console.error(err));
    }, []);

    const fetchGenres = async () => {
        try {
            const url = '/api/spotify/getGenres';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
            }
            const genres: SpotifyGenresResponse = await response.json() as SpotifyGenresResponse;
            setGenres(genres.genres);
            console.log(genres);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        console.log(error);
        return error;
    };

    useEffect(() => {
        fetchGenres().catch((err) => console.error(err));
    }, []);

    const handleSelect = (id: string, type: string) => {
        if (type === 'track' && selectedTrackIds.length < 5 && !selectedTrackIds.includes(id)) {
            const newSelectedTrackIds = [...selectedTrackIds, id];
            setSelectedTrackIds(newSelectedTrackIds);
        }

        if (type === 'artist' && selectedArtistIds.length < 5 && !selectedArtistIds.includes(id)) {
            const newSelectedArtistIds = [...selectedArtistIds, id];
            setSelectedArtistIds(newSelectedArtistIds);
        }
        if (type === 'genre' && selectedGenres.length < 5 && !selectedGenres.includes(id)) {
            const newSelectedGenres = [...selectedGenres, id];
            setSelectedGenres(newSelectedGenres);
        }
        if (selectedTrackIds.length + selectedArtistIds.length + selectedGenres.length >= 5) {
            redirectToDiscover(selectedTrackIds, selectedArtistIds, selectedGenres);
        }
    };

    const redirectToDiscover = (trackIds?: Array<string>, artistIds?: Array<string>, genres?: Array<string>) => {
        if (!trackIds || !artistIds) {
            return;
        }
        if (trackIds && artistIds && genres) {
            const trackQueryString = trackIds.join(',');
            const artistQueryString = artistIds.join(',');
            const genreQueryString = selectedGenres.join(',');
            window.location.href = `/discover?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}&seed_genres=${genreQueryString}`;
        }
        if (trackIds && artistIds && !genres) {
            const trackQueryString = trackIds.join(',');
            const artistQueryString = artistIds.join(',');
            window.location.href = `/discover?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}`;
        }
        if (trackIds && !artistIds && !genres) {
            const trackQueryString = trackIds.join(',');
            window.location.href = `/discover?seed_tracks=${trackQueryString}`;
        }
        if (artistIds && !trackIds && !genres) {
            const artistQueryString = artistIds.join(',');
            window.location.href = `/discover?seed_artists=${artistQueryString}`;
        }
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-tight font-bold my-4 mx-auto max-w-2xl" id="top-track-heading">
                Choose Tracks
            </h1>
            <div className="max-w-screen-lg h-full w-fit my-8 text-white">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {tracks.map((track) => (
                        <li
                            key={track.id}
                            className={`relative rounded-lg shadow-md p-4 flex flex-col items-center bg-gray-700 ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`}
                        >
                            <div className="relative w-full" id="spotify-tracks-rest">
                                <img
                                    src={track.album.images[0]?.url}
                                    alt={track.name}
                                    onLoad={() => {
                                        setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                    }}
                                    className="w-full object-contain shadow-xl rounded-md mb-2"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                                    <p className="text-sm text-gray-300 text-center mb-2">Album: {track.album.name}</p>
                                    <p className="text-sm text-gray-300 text-center mb-2">Track: {track.track_number} of {track.album.total_tracks}</p>
                                    <p className="text-sm text-gray-300 text-center mb-2">By: {track.artists.map(artist => artist.name).join(', ')}</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-center spotify-track-title">{removeTextInParentheses(track.name)}</p>
                            <button
                                onClick={() => handleSelect(track.id, 'track')}
                                className={`mt-2 px-4 py-2 rounded transition ${selectedTrackIds.includes(track.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                                disabled={selectedTrackIds.includes(track.id)}
                            >
                                {selectedTrackIds.includes(track.id) ? 'Selected' : 'Select Track'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-tight font-bold my-8 mx-auto max-w-2xl" id="top-track-heading">
                Choose Artist
            </h1>
            <div className="max-w-screen-lg mx-auto p-4 h-auto w-full my-8 text-white flex flex-col items-center justify-center">
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    {artists.map((artist) => (
                        <li
                            key={artist.id}
                            className={`min-h-fit relative rounded-lg shadow-md p-4 flex flex-col bg-green-900 items-center justify-center ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`}
                        >
                            <div className="relative w-full" id="spotify-tracks-rest">
                                <img
                                    src={artist.images[0]?.url}
                                    alt={artist.name}
                                    className="shadow-xl rounded-md mb-2 w-full"
                                    onLoad={() => {
                                        setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                                    }}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                                    <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artist.popularity}</p>
                                    <p className="text-sm text-gray-300 text-center mb-2">Followers: {artist.followers.total}</p>
                                    <p className="text-sm text-gray-300 text-center mb-2">{artist.genres.map(genre => genre).join(', ')}</p>
                                </div>
                            </div>
                            <p className="text-lg font-semibold text-center spotify-artist-title">{removeTextInParentheses(artist.name)}</p>
                            <button
                                onClick={() => handleSelect(artist.id, 'artist')}
                                className={`mt-2 px-4 py-2 rounded transition ${selectedArtistIds.includes(artist.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                                disabled={selectedArtistIds.includes(artist.id)}
                            >
                                {selectedArtistIds.includes(artist.id) ? 'Selected' : 'Select Artist'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-tight font-bold my-4 mx-auto max-w-2xl" id="top-track-heading">
                Choose Genre
            </h1>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-8">
                {genres.map((genre) => (
                    <li key={genre} className="">
                        <button
                            className={`p-4 rounded-lg shadow-md flex items-center justify-center transition ${selectedGenres.includes(genre) ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
                            onClick={() => handleSelect(genre, 'genre')}
                            disabled={selectedGenres.includes(genre)}
                        >
                            {selectedGenres.includes(genre) ? 'Selected' : genre}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DiscoverPage;