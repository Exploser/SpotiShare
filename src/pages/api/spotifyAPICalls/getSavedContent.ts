// src/pages/api/spotifyAPICalls/getTopArtists.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { getMyTracks } from '~/server/queries';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = getAuth(req);

        if (!userId) { return res.status(401).json({ error: 'Unauthorized' }) };

        const topArtists = await getMyTracks(userId);

        console.log('topArtists:', topArtists);

        res.status(200).json(topArtists);
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
