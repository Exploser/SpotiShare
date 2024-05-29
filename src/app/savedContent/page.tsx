import { db } from "~/server/db";

export default async function Test() {
    const test = await db.query.tracks.findMany();
    return (
        <div>
            <h1>Test</h1>
            <ul>
                {test.map((track) => (
                    <li key={track.id}>
                        {track.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}