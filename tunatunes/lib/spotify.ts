import { SpotifyError, SpotifyTopArtistsResponse, SpotifyTopTracksResponse } from "@/types/type";

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
): Promise<SpotifyTopArtistsResponse> => {
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

  const data = await response.json() as SpotifyTopArtistsResponse;
  return data;
};

export const fetchSpotifyRecent = async (
  accessToken: string,
  limit: number,
): Promise<SpotifyTopTracksResponse> => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  console.log('response:', response);
  if (!response.ok) {
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }
  const data = await response.json() as SpotifyTopTracksResponse;
  console.log('data:', data);
  return data;
};

export const fetchSpotifyRecommendations = async (
  accessToken: string,
  seed_artist?: string,
  seed_tracks?: string,
  seed_genres?: string,
): Promise<SpotifyTopTracksResponse> => {
  if (!seed_artist && !seed_tracks && !seed_genres) {
    throw new Error('At least one of seed_artist, seed_tracks, or seed_genres must be provided');
  }

  const baseUrl = 'https://api.spotify.com/v1/recommendations';
  const params = new URLSearchParams();

  if (seed_tracks) {
    params.append('seed_tracks', seed_tracks);
  }
  if (seed_artist) {
    params.append('seed_artists', seed_artist);
  }
  if (seed_genres) {
    params.append('seed_genres', seed_genres);
  }

  const url = `${baseUrl}?${params.toString()}`;
  console.log('url:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

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

export const fetchSpotifyGenres = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json() as SpotifyError;
    throw new Error(`Spotify API Error: ${error.error.message}`);
  }

  const data: Array<string> = await response.json() as Array<string>;
  return data;
}
