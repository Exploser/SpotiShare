// src/app/api/spotifyAPICalls/getTopArtists/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { fetchSpotifyTopArtists } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/spotify/getTopArtists');
    const cookies = req.headers.get('cookie');
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.spotify_access_token;
    if (!accessToken) throw new Error('Spotify access token not found');

    // Get query parameters
    const url = new URL(req.url);
    const time_range = url.searchParams.get('time_range') || 'medium_term';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    console.log('time_range:', time_range);
    console.log('limit:', limit);
    console.log('offset:', offset);

    const topArtists = await fetchSpotifyTopArtists(accessToken, time_range, limit, offset);

    return NextResponse.json(topArtists, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error || 'An unexpected error occurred' }, { status: 500 });
  }
}
