import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import type { SpotifyUser } from '~/lib/spotify';

interface SpotifyError {
    error: {
        status: number;
        message: string;
      };
}

export const fetchSpotifyUserData = async (req: NextApiRequest): Promise<SpotifyUser> => {
  const cookies = req.headers.cookie;
  if (!cookies) throw new Error('No cookies found');

  const parsedCookies = parse(cookies);
  const accessToken = parsedCookies.spotify_access_token;
  console.log('accessToken:', accessToken);
  if (!accessToken) throw new Error('Spotify access token not found');

  const response = await fetch('https://api.spotify.com/v1/me', {
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

  const userData = await response.json() as SpotifyUser;
  return userData;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
try {
    const userData = await fetchSpotifyUserData(req);
    res.status(200).json(userData);
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