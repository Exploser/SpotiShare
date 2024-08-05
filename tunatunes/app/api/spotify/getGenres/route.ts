// src/pages/api/spotifyAPICalls/getGenres.ts

import { NextResponse } from 'next/server';
import { fetchSpotifyGenres } from '@/lib/spotify';
import { cookies } from 'next/headers';

export const GET = async () => {
  try {
    // Retrieve the Spotify access token from cookies
    const cookieData = cookies().get('spotify_access_token');
    const accessToken = cookieData?.value;

    if (!accessToken) {
      throw new Error('Spotify access token not found');
    }

    // Fetch genres using the access token
    const genres: Array<string> = await fetchSpotifyGenres(accessToken);

    // Return the genres as a JSON response
    return NextResponse.json(genres, { status: 200 });
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
