const SpotifyFeatures: React.FC = () => {
    return (
        <div className="flex flex-col items-center bg-opacity-10 p-6 rounded-xl shadow-xl my-8"
            id="spotify-features">
            <h1 className="text-3xl font-bold text-white mb-4">Features!</h1>
                <a className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded my-4 h-fit hover:scale-105"
                    href="/toptracks"
                >
                    Top Tracks
                </a>
                <a className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded my-4 h-fit hover:scale-105"
                    href="/topartists"
                >
                    Top Artists
                </a>
            <h1 className="text-xl font-bold text-white my-4">More features coming soon....</h1>
        </div>
    )
};

export default SpotifyFeatures;
