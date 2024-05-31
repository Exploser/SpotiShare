import "server-only"
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { savedTracks } from "./db/schema";

export async function getMyTracks() {
    const user = auth();
  
    if (!user.userId) throw new Error("Unauthorized");

    const tracks = await db.query.tracks.findMany({
      where: (model, { eq }) => eq(model.user_id, user.userId),
      orderBy: (model, { desc }) => desc(model.id),
    });

    return tracks;
  }