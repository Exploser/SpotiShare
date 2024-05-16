// src/lib/spotify.ts
export const fetchSpotifyToken = async () => {
    const response = await fetch('/api/spotify-token');
    if (!response.ok) {
      throw new Error('Failed to fetch Spotify token');
    }
    return response.json();
  };
  