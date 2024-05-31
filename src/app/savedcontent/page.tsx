import { db } from "~/server/db";
import { getMyTracks } from "~/server/queries";

export default async function Test() {
    const tracks = await getMyTracks();
    return (
        <div>
            <div className="max-w-screen-lg mx-auto p-4 h-auto w-full text-white flex flex-col items-center justify-center">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        {tracks.map((track) => (
                            <li key={track.id} className={`min-h-fit relative rounded-lg shadow-md p-2 flex flex-col items-center justify-center`}>
                                <div className="relative w-full" id="spotify-tracks-rest">
                                    <div className="flex flex-col items-center justify-center">
                                        <h1 className="text-lg font-bold">{track.track_name}</h1>
                                        <h2 className="text-sm">{track.artists_name}</h2>
                                        <h2 className="text-sm">{track.album_name}</h2>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
        </div>
    );
}