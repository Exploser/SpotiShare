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
export interface SpotifyError {
  error: {
    status: number;
    message: string;
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
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }

  const data = await response.json() as SpotifyTopTracksResponse;
  return data;
};

export const fetchSpotifyTopArtists = async (
  accessToken: string,
  time_range: string,
  limit: number,
  offset: number
): Promise<SpotifyTopTracksResponse> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }

  const data = await response.json() as SpotifyTopTracksResponse;
  return data;
};

export const fetchSpotifyRecommendations = async (
  accessToken: string,
  seed_tracks: string[],
  limit: number
): Promise<SpotifyTopTracksResponse> => {
  console.log(seed_tracks);
  console.log(`${seed_tracks.join(',')}&limit=${limit}`)
  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?seed_tracks=${seed_tracks.join(',')}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }

  const data = await response.json() as SpotifyTopTracksResponse;
  return data;
};

export const fetchSpotifyToken = async () => {
  const response = await fetch('/api/spotify-token');
  if (!response.ok) {
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }
  return response.json.toString();
};