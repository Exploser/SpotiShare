'use client';
import { useEffect, useState } from "react";

interface Track {
    id: string;
    name: string;
    image_url?: string;
    artists_name?: string;
    album_name?: string;
    user_id?: string;
    popularity?: number;
    created_at?: Date;
}  

export default function SavedContent() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const fetchSavedTracks = async () => {
        try {
            const url = '/api/spotifyAPICalls/getSavedContent';
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch top artists');
            }
            const data: Track[] = await response.json() as Track[];
            setTracks(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
        console.log(error);
        return error;
    };

    useEffect(() => {
        fetchSavedTracks().catch((err) => console.error(err));
    }, []);

  const removeTextInParentheses = (str: string) => {
    const splitStr = str.split('(');
    if (splitStr.length > 0) {
      return splitStr[0]?.trim();
    }
    return str;
  };

  const buildSpotifyAPIUrl = () => {
    const baseUrl = '/api/spotifyAPICalls/getSavedContent';
    return baseUrl;
  };

  const fetchTopTracks = async () => {
    try {
      const url = buildSpotifyAPIUrl();
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }
      const data: Track[] = await response.json() as Track[];
      setTracks(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchTopTracks().catch((err) => console.error(err));
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    // Ensure the format is "MMM-DD-YYYY"
    const [month, day, year] = formattedDate.replace(',', '').split(' ');
    return `${month}-${day}-${year}`;
  };

  return (
    <div>
      <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
        {error && <p className="text-red-500">{error}</p>}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {tracks.length > 0 && tracks.map((track) => (
            <li key={track.id} className="min-h-fit relative rounded-lg shadow-md p-2 flex flex-col items-center justify-center bg-slate-800">
              <div className="relative w-full" id="spotify-tracks-rest">
                <img src={track.image_url ?? ''} alt={track.name} className="w-full h-48 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                  <p className="text-sm text-gray-300 text-center mb-2">Album: {track.album_name}</p>
                  <p className="text-sm text-gray-300 text-center mb-2">By: {track.artists_name}</p>
                  <p className="text-sm text-gray-300 text-center mb-2">Saved at Popularity: {track.popularity}</p>
                  <p className="text-sm text-gray-300 text-center mb-2">
                    Created at: {track.created_at ? formatDate(track.created_at.toString()) : ''}
                  </p>
                </div>
                <p className="text-lg text-white text-center mt-2">{removeTextInParentheses(track.name)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
