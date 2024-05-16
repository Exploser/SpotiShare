// src/pages/api/spotify-token.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function apihandler(req: NextApiRequest, res: NextApiResponse) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return res.status(500).json({ error: 'Missing Spotify credentials' });
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }).toString(),
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json(data);
  } else {
    res.status(response.status).json(data);
  }
}
