import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { fetchSpotifyRecent, fetchSpotifyTopArtists } from '@/lib/spotify';

export async function GET(req: NextRequest) {
  try {
    const cookies = req.headers.get('cookie');
    if (!cookies) throw new Error('No cookies found');

    const parsedCookies = parse(cookies);
    const accessToken = parsedCookies.spotify_access_token;
    if (!accessToken) throw new Error('Spotify access token not found');

    // Get query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const recent = await fetchSpotifyRecent(accessToken, limit);

    return NextResponse.json(recent, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error || 'An unexpected error occurred' }, { status: 500 });
  }
}
