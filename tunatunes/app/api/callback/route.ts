// app/api/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export async function GET(req: NextRequest) {
  console.log('GET /api/callback');
  
  // Log the complete URL object for debugging
  const url = new URL(req.url);
  console.log('Complete URL:', url.href);

  // Parse the query parameters from the URL
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Log the parsed parameters for debugging purposes
  console.log('Parsed parameters:', { code, state, error });

  if (error !== null) {
    return NextResponse.json({ error: `Error during authentication: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  if (!client_id || !client_secret || !redirect_uri) {
    return NextResponse.json({ error: 'Missing Spotify credentials or redirect URI' }, { status: 500 });
  }

  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri,
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
    const cookie = serialize('spotify_access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    console.log('Access token:', token);
    console.log('Access token stored in cookie');

    const headers = new Headers();
    headers.append('Set-Cookie', cookie);
    headers.append('Location', '/dashboard');

    // Redirect to the home page
    return new NextResponse(null, {
      status: 302,
      headers,
    });
  } catch (err) {
    console.error('Error fetching access token:', err);
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }
}
