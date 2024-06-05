import "server-only"
import { db } from "./db";

export async function getMyTracks(userId: string) {
    
  const tracks = await db.query.tracks.findMany({
    where: (model, { eq }) => eq(model.user_id, userId),
    orderBy: (model, { desc }) => desc(model.id),
  });

    return tracks;
  }
 