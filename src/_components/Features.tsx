import Link from "next/link";

const SpotifyFeatures: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 rounded-lg shadow-xl transition-transform transform my-12"
            id="spotify-features">
            <h1 className="text-3xl font-bold text-white mb-4">Features!</h1>
                <a className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded my-4 h-fit hover:scale-105"
                    href="/toptracks"
                >
                    Top Tracks
                </a>
            <h1 className="text-xl font-bold text-white my-4">More features coming soon....</h1>
        </div>
    )
};

export default SpotifyFeatures;
