// src/pages/api/spotifyAPICalls/getTopArtists.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { fetchSpotifyRecommendations, fetchSpotifyToken, } from '../../../lib/spotify';

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
            }
        };

        // Get query parameters
        const seed_tracks = req.query.seed_tracks as string || '0725YWm6Z0TpZ6wrNk64Eb';
        const seed_artist = req.query.seed_artist as string || '2h93pZq0e7k5yf4dywlkpM';
        const seed_genres = req.query.seed_genres as string || 'heavy-metal';

        console.log('seed_genres:', seed_genres);

        try {
            if (accessToken) {
                const recommendations = await fetchSpotifyRecommendations(accessToken, seed_tracks, seed_artist, seed_genres);
                res.status(200).json(recommendations);
            }
        }
        catch {
            throw new Error('Something Went Wrong');
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
