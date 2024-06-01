// src/pages/api/spotifyAPICalls/getTopArtists.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { fetchSpotifyRecommendations, fetchSpotifyToken,} from '../../../lib/spotify';
import { getMyTracks } from '~/server/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const cookies = req.headers.cookie;
        if (!cookies) throw new Error('No cookies found');

        const parsedCookies = parse(cookies);
        let accessToken = parsedCookies.spotify_access_token;
        // if (!accessToken) {
        //     try{
        //         accessToken = await fetchSpotifyToken();
        //     } catch (error) {
        //         console.error('Error fetching Spotify token:', error);
        //         res.status(500).json({ error: 'Error fetching Spotify token' });
        //     }
        // };

        // Get query parameters
        
        const offset = parseInt(req.query.offset as string) || 0;

        const seed_tracks = ['seed_artists=4NHQUGzhtTLFvgF5SZesLK'];
        const limit = 10;

        if (accessToken && seed_tracks) {
        const recommendations = await fetchSpotifyRecommendations(accessToken, seed_tracks, limit,);
        res.status(200).json(recommendations);
        }
        else {
            throw new Error('Spotify access token not found');
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
