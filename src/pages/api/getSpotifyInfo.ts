
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { SpotifyUser } from '~/lib/spotify';

interface SpotifyError {
    status: number;
    message: string;
  }

  export const fetchSpotifyUserData = async (accessToken: string): Promise<SpotifyUser> => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error: SpotifyError = await response.json();
      throw new Error(`Spotify API Error: ${error.message}`);
    }
  
    return response.json();
  };
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie;
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies['spotify_access_token'];
    if (!accessToken) throw new Error('Spotify access token not found');

    const userData = await fetchSpotifyUserData(accessToken);
    res.status(200).json(userData);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
}
