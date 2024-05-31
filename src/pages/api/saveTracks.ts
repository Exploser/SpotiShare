import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { albums, artists, savedTracks, tracks, users } from "~/server/db/schema";
import { db } from '~/server/db';
import { SpotifyTopTracksResponse } from '~/app/toptracks/page';

const saveTracks = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        try {
          await db.insert(users).values({
            id: userId,
          });
        } catch (e) {
          console.error('Error inserting user:', e);
        }
      }

      const tracksData = req.body as SpotifyTopTracksResponse;

      if (!tracksData) {
        return res.status(400).json({ message: 'No tracks data provided' });
      }

      if (tracksData.items.length > 0) {
        const trackList = tracksData.items;

        for (const trackData of trackList) {
          const trackAlbum = trackData.album;
          const trackArtist = trackData.artists;

          if (!trackAlbum) {
            console.error('Album data or album id is missing:', trackAlbum);
            // continue; // Skip to the next trackData
          }

          try {
            await db.insert(albums).values({
              id: trackAlbum.id,
              name: trackAlbum.name,
              release_date: trackAlbum.release_date,
              total_tracks: trackAlbum.total_tracks.toString(),
            });
          } catch (error) {
            console.error('Error inserting album:', error);
            // continue; // Skip to the next trackData if album insertion fails
          }

          if (!trackArtist || !Array.isArray(trackArtist)) {
            console.error('Artists data is missing or not an array:', artists);
            // continue; // Skip to the next trackData
          }

          for (const artist of trackArtist) {
            if (!artist.id) {
              console.error('Artist id is missing:', artist);
              // continue; // Skip to the next artist
            }

            try {
              await db.insert(artists).values({
                id: artist.id,
                name: artist.name,
              });
            } catch (error) {
              console.error('Error inserting artist:', error);
            }
          }

          if (!trackData.id) {
            console.error('Track id is missing:', trackData);
            // continue; // Skip to the next trackData
          }

          try {
            await db.insert(tracks).values({
              id: trackData.id,
              name: trackData.name,
              preview_url: trackData.preview_url,
              track_number: trackData.track_number.toString(), // Convert track_number to string
              album_name: trackAlbum.name,
              artists_name: trackArtist.map((artist) => artist.name).join(', '),
              user_id: userId,
              popularity: trackData.popularity?.toString() || '0', // Convert popularity to string or default to '0'
            });
          } catch (error) {
            console.error('Error inserting track:', error);
          }

          try{
            await db.insert(savedTracks).values({
              user_id: userId,
              track_name: trackData.name,
              album_name: trackAlbum.name,
              artists_name: trackArtist.map((artist) => artist.name).join(', '),
            });
          } catch (error) {
            console.error('Error inserting saved track:', error);
          }
        }

        res.status(200).json({ message: 'Tracks saved successfully' });
      } else {
        res.status(400).json({ message: 'No tracks data available' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to save tracks', error: error.message });
      } else {
        res.status(500).json({ message: 'Failed to save tracks' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default saveTracks;