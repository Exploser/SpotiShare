// src/pages/api/spotifyAPICalls/getGenres.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { fetchSpotifyGenres} from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) throw new Error('No cookies found');

        const parsedCookies = parse(cookies);
        const accessToken = parsedCookies.spotify_access_token;
        if (!accessToken) throw new Error('Spotify access token not found');

        
        const getGenres: Array<string> = await fetchSpotifyGenres(accessToken);

        res.status(200).json(getGenres);
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
