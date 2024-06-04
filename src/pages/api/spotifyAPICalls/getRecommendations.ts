// src/pages/api/spotifyAPICalls/getRecommendations.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { fetchSpotifyRecommendations, fetchSpotifyToken } from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    let accessToken = parsedCookies.spotify_access_token;
    if (!accessToken) {
      try {
        accessToken = await fetchSpotifyToken();
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
        res.status(500).json({ error: 'Error fetching Spotify token' });
        return; // Return early if there is an error fetching the token
      }
    }

    // Get query parameters
    const seed_tracks = req.query.seed_tracks as string || '';
    const seed_artist = req.query.seed_artist as string || '';
    const seed_genres = req.query.seed_genres as string || '';

    try {
      if (accessToken) {
        const recommendations = await fetchSpotifyRecommendations(accessToken, seed_artist, seed_tracks, seed_genres);
        res.status(200).json(recommendations);
      } else {
        throw new Error('Access token is not available');
      }
    } catch (fetchError) {
      console.error('Error fetching recommendations:', fetchError);
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
    } else {
      console.error('Unexpected error', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}
