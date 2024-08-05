import { NextRequest, NextResponse } from 'next/server';
import { fetchSpotifyRecent } from '@/lib/spotify';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieData = cookies().get('spotify_access_token');

    const accessToken = cookieData?.value
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
