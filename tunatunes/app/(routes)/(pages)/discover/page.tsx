'use client';
import { Heading } from "@/components/ui/heading";
import { Artist, SpotifyGenresResponse, SpotifyTopArtistsResponse, SpotifyTopTracksResponse, Tracks } from "@/types/type";
import { useEffect, useState } from "react";
import SelectTracksCarousel from "./components/select-tracks";
import SelectArtistsCarousel from "./components/select-artists";

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
            window.location.href = `/discover/results?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}&seed_genres=${genreQueryString}`;
        }
        if (trackIds && artistIds && !genres) {
            const trackQueryString = trackIds.join(',');
            const artistQueryString = artistIds.join(',');
            window.location.href = `/discover/results?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}`;
        }
        if (trackIds && !artistIds && !genres) {
            const trackQueryString = trackIds.join(',');
            window.location.href = `/discover/results?seed_tracks=${trackQueryString}`;
        }
        if (artistIds && !trackIds && !genres) {
            const artistQueryString = artistIds.join(',');
            window.location.href = `/discover/results?seed_artists=${artistQueryString}`;
        }
    };

    return (
        <div className="w-full">
            <Heading title="Discover" description="Find New music based on the tracks and artists you like, Choose Upto 5 Items" />
            <div className="flex flex-col items-start justify-between p-4 pb-0">
                <h2 className="text-3xl font-bold tracking-tight text-slate-600">
                    Choose Tracks,
                </h2>
                <div className="h-full w-full my-8 text-white">
                    <SelectTracksCarousel tracks={tracks} handleSelect={handleSelect} selectedTrackIds={selectedTrackIds} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-600">
                    Choose Artists,
                </h2>
                <div className="h-full w-full my-8 text-white">
                    <SelectArtistsCarousel artists={artists} handleSelect={handleSelect} selectedArtistsIds={selectedArtistIds} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-600">
                    Choose Genres,
                </h2>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 m-8">
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
        </div>
    );
}

export default DiscoverPage;