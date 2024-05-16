'user server';
// src/pages/api/getSpotifyToken.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosResponse } from 'axios';
import { Buffer } from 'buffer';

type Data = {
  access_token?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    res.status(500).json({ error: 'Missing Spotify credentials' });
    return;
  }

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(),
  };

  try {
    const response: AxiosResponse = await axios(authOptions);
    res.status(200).json({ access_token: response.data.access_token });
  } catch (error: any) {
    res.status(error.response ? error.response.status : 500).json({ error: 'Failed to fetch token' });
  }
}
