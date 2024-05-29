// src/pages/api/connectSpotify.ts

// Connect To Spotify
import type { NextApiRequest, NextApiResponse } from 'next';

const client_id = process.env.SPOTIFY_CLIENT_ID ?? 'CLIENT_ID';
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI ?? 'http://localhost:3000/callback';

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const state = generateRandomString(16);
  // Required scopes for the application 
  const scope = 'user-top-read user-library-read user-read-recently-played'; 

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
