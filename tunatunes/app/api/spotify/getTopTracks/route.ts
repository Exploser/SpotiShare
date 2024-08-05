import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { fetchSpotifyTopTracks } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get('cookie');
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.spotify_access_token;
    if (!accessToken) throw new Error('Spotify access token not found');

    // Get query parameters from the URL
    const url = new URL(req.url);
    const time_range = url.searchParams.get('time_range') || 'medium_term';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    const topTracks = await fetchSpotifyTopTracks(accessToken, time_range, limit, offset);
    return NextResponse.json(topTracks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error || 'An unexpected error occurred' }, { status: 500 });
  }
}
