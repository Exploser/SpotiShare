import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { Client } from 'pg';
import { tracks } from '~/server/db/schema';

const client = new Client({
  connectionString: process.env.POSTGRES_URL, // Ensure this is set in your environment variables
});

client.connect();

const saveTracks = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      try {
        const { userId } = getAuth(req);
  
        if (!userId) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
  
        let tracksData = req.body;

        if (!tracksData) {
          return res.status(400).json({ message: 'No tracks data provided' });
        }
        
  
        // Ensure tracksData is an array
        if (!Array.isArray(tracksData)) {
          tracksData = [tracksData];
        }
        
        if(tracksData.length>0){
            const tracks = tracksData[0].tracks;
        
        // Start a transaction
        await client.query('BEGIN');
        for (const trackData of tracks) {
            const album = trackData.album;
            const artists = trackData.artists;
            console.log([album.id, album.name, album.release_date, album.total_tracks])
            
            // Insert or update the album
            const albumResult = await client.query(
                `INSERT INTO albums (id, name, release_date, total_tracks)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
                RETURNING id`,
                [album.id, album.name, album.release_date, album.total_tracks]
            );
            
            console.log('Track : ' + trackData.name);
          // Insert images related to the album
          for (const img of album.images) {
            await client.query(
              `INSERT INTO images (url, height, width, album_id)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT DO NOTHING`,
              [img.url, img.height, img.width, albumResult.rows[0].id]
            );
          }
  
          // Insert or update artists
          for (const artist of artists) {
            await client.query(
              `INSERT INTO artists (id, name, external_url)
               VALUES ($1, $2, $3)
               ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
              [artist.id, artist.name, artist.external_urls.spotify]
            );
          }
  
          // Insert the track
          await client.query(
            `INSERT INTO tracks (id, name, preview_url, track_number, external_url, album_id, user_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (id) DO NOTHING`,
            [trackData.id, trackData.name, trackData.preview_url, trackData.track_number, trackData.external_urls.spotify, album.id, userId]
          );
          
  
          // Insert relations between tracks and artists
          for (const artist of artists) {
            await client.query(
              `INSERT INTO track_artists (track_id, artist_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [trackData.id, artist.id]
            );
          }
        }
  
        // Commit the transaction
        await client.query('COMMIT');
    }
  
        res.status(200).json({ message: 'Tracks saved successfully' });
      } catch (error: any) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: 'Failed to save tracks', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  };
  
  export default saveTracks;