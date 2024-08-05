// /app/api/spotify/getProfile/route.ts
import { NextResponse } from 'next/server';
import { SpotifyError, SpotifyUser } from '@/types/type';
import { cookies } from 'next/headers';

const fetchSpotifyUserData = async (): Promise<SpotifyUser> => {  
  const cookieData = cookies().get('spotify_access_token');

  const accessToken = cookieData?.value
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

export const GET = async () => {
  try {
    const userData = await fetchSpotifyUserData();
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
