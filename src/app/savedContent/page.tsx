import { db } from "~/server/db";

export default async function Test() {
    const test = await db.query.savedTracks.findMany();
    return (
        <div>
            <ul>
                {test.map((track) => (
                    <li key={track.id}>
                        {track.track_name} - {track.album_name} - {track.artists_name}
                    </li>
                ))}
            </ul>
        </div>
    );
}