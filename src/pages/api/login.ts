import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const handler = nextConnect<NextApiRequest, NextApiResponse>();

const generateRandomString = (length: number) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

handler.get((req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: client_id || '',
    scope: scope,
    redirect_uri: redirect_uri || '',
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
});

export default handler;
