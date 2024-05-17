// src/pages/api/spotifyAPICalls/getTopTracks.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { fetchSpotifyTopTracks } from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies['spotify_access_token'];
    if (!accessToken) throw new Error('Spotify access token not found');

    // Get query parameters
    const time_range = req.query.time_range as string || 'medium_term';
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const topTracks = await fetchSpotifyTopTracks(accessToken, time_range, limit, offset);
    res.status(200).json(topTracks);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}
