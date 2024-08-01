// src/pages/api/spotifyAPICalls/getGenres.ts

import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { fetchSpotifyGenres } from '@/lib/spotify';

export const GET = async (req: NextRequest) => {
  try {
    const cookies = req.headers.get('cookie');
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.spotify_access_token;
    if (!accessToken) throw new Error('Spotify access token not found');

    const genres: Array<string> = await fetchSpotifyGenres(accessToken);

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
