export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  external_urls: {
    spotify: string;
  };
}
export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: Array<{ url: string; height: number; width: number }>;
  followers: { total: number };
  external_urls: { spotify: string };
  href: string;
  type: string;
  uri: string;
}
interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
}

export const fetchSpotifyTopTracks = async (
  accessToken: string,
  time_range: string,
  limit: number,
  offset: number
): Promise<SpotifyTopTracksResponse> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }

  return response.json();
};

export const fetchSpotifyToken = async () => {
  const response = await fetch('/api/spotify-token');
  if (!response.ok) {
    throw new Error('Failed to fetch Spotify token');
  }
  return response.json();
};