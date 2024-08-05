// src/app/api/spotifyAPICalls/getTopArtists/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fetchSpotifyTopArtists } from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieData = cookies().get('spotify_access_token');

    const accessToken = cookieData?.value
    if (!accessToken) throw new Error('Spotify access token not found');

    // Get query parameters
    const url = new URL(req.url);
    const time_range = url.searchParams.get('time_range') || 'medium_term';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    const topArtists = await fetchSpotifyTopArtists(accessToken, time_range, limit, offset);

    return NextResponse.json(topArtists, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error || 'An unexpected error occurred' }, { status: 500 });
  }
}
