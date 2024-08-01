// /app/api/spotify/getProfile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { SpotifyError, SpotifyUser } from '@/types/type';

const fetchSpotifyUserData = async (req: NextRequest): Promise<SpotifyUser> => {
  const cookies = req.headers.get('cookie');
  if (!cookies) throw new Error('No cookies found');

  const parsedCookies = parse(cookies);
  const accessToken = parsedCookies.spotify_access_token;

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

export const GET = async (req: NextRequest) => {
  try {
    const userData = await fetchSpotifyUserData(req);
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Unexpected error', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
};
