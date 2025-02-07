// src/pages/api/callback.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { serialize } from 'cookie';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, state, error } = req.query;

  // Log the callback parameters for debugging
  console.log('Callback parameters:', { code, state, error });

  if (Array.isArray(error) || Array.isArray(code)) {
    res.status(400).json({ error: 'Invalid parameter format' });
    return;
  }

  if (error) {
    res.status(400).json({ error: `Error during authentication: ${error}` });
    return;
  }

  if (!code) {
    res.status(400).json({ error: 'Missing code parameter' });
    return;
  }

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    res.status(500).json({ error: 'Missing Spotify credentials or redirect URI' });
    return;
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri,
  });

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: params.toString(),
  };

  try {
    const response = await axios(authOptions);
    const data = response.data as SpotifyTokenResponse;

    const token = data.access_token;

    // Set token in a cookie
    res.setHeader('Set-Cookie', serialize('spotify_access_token', token, {
      httpOnly: true,
      maxAge: 3600, // 1 hour
      path: '/',
    }));
    console.log('Access token:', token);
    console.log('Access token stored in cookie');

    // Redirect to the home page
    res.redirect('/');
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.error('Error fetching access token:', errorMessage);
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
}
