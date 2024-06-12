const SpotifyFeatures: React.FC = () => {
    return (
        <div className="flex flex-col items-center bg-opacity-10 p-6 rounded-xl shadow-xl my-8  transition-transform transform hover:scale-105 "
            id="spotify-features">
            <h1 className="text-3xl font-bold text-white mb-4">Features!</h1>
            <div id="spotify-features-buttons">
                <div className="flex flex-col justify-center items-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded whitespace-nowrap text-center my-4 h-fit">
                    <img src="/images/top-tracks.svg"
                        alt="Top Tracks"
                        className="h-64 w-64 inline-block"
                    />
                    <a href="/toptracks">Top Tracks</a>
                </div>
                <div className="flex flex-col justify-center items-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded whitespace-nowrap text-center my-4 h-fit">
                    <img src="/images/top-artists.svg"
                        alt="Top Tracks"
                        className="h-64 w-64 inline-block"
                    />
                    <a href="/topartists">Top Artists</a>
                </div>
                <div className="flex flex-col justify-center items-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded whitespace-nowrap text-center my-4 h-fit hover:scale-105">
                    <img src="/images/saved-content.svg"
                        alt="Top Tracks"
                        className="h-64 w-64 inline-block"
                    />
                    <a href="/savedcontent">Saved</a>
                </div>
                <div className="flex flex-col justify-center items-center bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 border border-green-700 rounded whitespace-nowrap text-center my-4 h-fit hover:scale-105">
                    <img src="/images/discover-music.svg"
                        alt="Top Tracks"
                        className="h-64 w-64 inline-block"
                    />
                    <a href="/recommendations">Discover</a>
                </div>
            </div>
            {/* <h1 className="text-xl font-bold text-white my-4">More features coming soon....</h1> */}
        </div>
    )
};

export default SpotifyFeatures;
