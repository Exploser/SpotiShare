'use client';
import { useEffect, useState } from "react";
import { SpotifyTopTracksResponse, Track } from "../toptracks/page";
import { useRouter } from 'next/router';

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

interface SpotifyTopArtistResponse {
    items: Artist[];
}

export default function Recommendations() {
    const [artists, setArtist] = useState<Artist[]>([]);
    const [selectedTrackIds, setSelectedTrackIds] = useState(Array<string>());
    const [selectedArtistIds, setSelectedArtistIds] = useState(Array<string>());
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
    const [sampleColors, setSampleColors] = useState<Record<string, string>>({}); // Track ID -> Color
    const [timeRange, setTimeRange] = useState('medium_term');
    const [limit, setLimit] = useState(5);
    
    const buildSpotifyAPIUrl = (timeRange = 'medium_term', limit = 5, offset = 0) => {
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

    const buildSpotifyAPI = (timeRange = 'medium_term', limit = 19, offset = 0) => {
        const baseUrl = '/api/spotifyAPICalls/getTopArtists';
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
            const data: SpotifyTopArtistResponse= await response.json() as SpotifyTopArtistResponse;
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

    const handleSelect = (id:string, type:string) => {
        if (type === 'track' && selectedTrackIds.length < 5 && !selectedTrackIds.includes(id)) {
          const newSelectedTrackIds = [...selectedTrackIds, id];
          setSelectedTrackIds(newSelectedTrackIds);
        }
    
        if (type === 'artist' && selectedArtistIds.length < 5 && !selectedArtistIds.includes(id)) {
          const newSelectedArtistIds = [...selectedArtistIds, id];
          setSelectedArtistIds(newSelectedArtistIds);
        }
        if (selectedTrackIds.length === 5) {
            console.log("HERE");
          redirectToDiscover(selectedTrackIds, selectedArtistIds);
        }

      };
      const redirectToDiscover = (trackIds: Array<string>, artistIds: Array<string>) => {
        const trackQueryString = trackIds.join(',');
        const artistQueryString = artistIds.join(',');
        window.location.href = `/discover?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}`;
      };

    // const redirectToDiscover = (trackIds?: Array<string>, artistIds?: Array<string>) => {
    //     if (!trackIds && !artistIds) {
    //         return;
    //     }
    //     try {
    //         if ((trackIds && trackIds.length < 5) && (artistIds && artistIds.length < 5)) {
    //             const artistQueryString = artistIds?.join(',');
    //             const trackQueryString = trackIds?.join(',');
    //             window.location.href = `/discover?seed_tracks=${trackQueryString}&seed_artists=${artistQueryString}`;
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <div className="flex flex-col flex-center items-center">
          <h1>Choose Tracks</h1>
          <div className="max-w-screen-lg h-full w-fit text-white">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 w-full">
              {tracks.map((track) => (
                <li key={track.id} className={`relative rounded-lg shadow-md p-2 flex flex-col items-center ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`} style={{ backgroundColor: sampleColors[track.id] }}>
                  <div className="relative w-full" id="spotify-tracks-rest">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      onLoad={() => {
                        setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                      }}
                      className="w-full object-contain shadow-xl rounded-md mb-2"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                      <p className="text-sm text-gray-300 text-center mb-2">Album: {track.album.name}</p>
                      <p className="text-sm text-gray-300 text-center mb-2">Track: {track.track_number} of {track.album.total_tracks}</p>
                      <p className="text-sm text-gray-300 text-center mb-2">By: {track.artists.map(artist => artist.name).join(', ')}</p>
                    </div>
                    <p className="text-lg font-semibold text-center spotify-track-title">{removeTextInParentheses(track.name)}</p>
                  </div>
                    <button onClick={() => handleSelect(track.id, 'track')} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Select Track</button>
                </li>
              ))}
            </ul>
          </div>
          <h1>Choose Artist</h1>
          <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
              {artists.map((artist) => (
                <li key={artist.id} className={`min-h-fit relative rounded-lg shadow-md p-2 flex flex-col items-center justify-center ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`} style={{ backgroundColor: sampleColors[artist.id] }}>
                  <div className="w-full" id="spotify-artists-rest">
                    <img src={artist.images[0]?.url} alt={artist.name} className="shadow-xl rounded-md mb-2" onLoad={() => {
                      setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                    }} />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4" id="spotify-artists-rest-details">
                      <p className="text-sm text-gray-300 text-center mb-2">Popularity: {artist.popularity}</p>
                      <p className="text-sm text-gray-300 text-center mb-2">Followers: {artist.followers.total}</p>
                      <div className="flex flex-row justify-evenly items-center w-full">
                        <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          <img className='h-14 object-contain' src="https://www.vectorlogo.zone/logos/spotify/spotify-icon.svg" alt="Listen on Spotify" />
                        </a>
                      </div>
                      <p className="text-sm text-gray-300 text-center mb-2">{artist.genres.map(genres => genres).join(', ')}</p>
                    </div>
                    <p className="text-lg font-semibold text-center spotify-artist-title object-contain text-nowrap">{removeTextInParentheses(artist.name)}</p>
                    <button onClick={() => handleSelect(artist.id, 'artist')} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">Select Artist</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <h1>Choose Genre</h1>
        </div>
      );
}