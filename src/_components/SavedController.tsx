// src/app/discover/page.tsx

'use client';

import { useState } from 'react';

interface SavedControllerProps {
    seedtracks: string;
    setSeedTracks: (value: string) => void;
    seedartists: string;
    setSeedArtists: (value: string) => void;
    seedgenres: string;
    setSeedGenres: (value: string) => void;
    handleRefetch: () => void;
}

const RecommendationsController: React.FC<SavedControllerProps> = (
    {
        seedtracks,
        setSeedTracks,
        seedartists,
        setSeedArtists,
        seedgenres,
        setSeedGenres,
        handleRefetch
    }: {
        seedtracks: string;
        setSeedTracks: (value: string) => void;
        seedartists: string;
        setSeedArtists: (value: string) => void;
        seedgenres: string;
        setSeedGenres: (value: string) => void;
        handleRefetch: () => void;
        
    }) => {

    const [refetchAttempted, setRefetchAttempted] = useState(false);

    const handleSeedTracksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeedTracks(e.target.value);
    };

    const handleSeedArtistsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeedArtists(e.target.value);
    };

    const handleSeedGenresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeedGenres(e.target.value);
    };

    const handleRefetchIfDifferent = () => {
        setRefetchAttempted(true);
        // Refetch logic here
        handleRefetch();
    };

    return (
        <div className="flex flex-col items-center text-white justify-center p-6 bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 rounded-lg shadow-xl transition-transform transform my-12" id="top-tracks-controller">
            <h1 className="text-3xl font-bold text-white mb-4">Customize Track Options</h1>
            {refetchAttempted && (
                <p className="text-red-500 mt-2">Please change the input fields to refetch tracks.</p>
            )}
            <div className='flex flex-col justify-center items-center w-full'>
                <div className="flex flex-col my-2 w-full px-24 justify-center items-center">
                    <div className="flex flex-col justify-between items-center mb-4">
                        <label>
                            Seed Tracks
                            <input
                                type="text"
                                value={seedtracks}
                                onChange={handleSeedTracksChange}
                                className="ml-2 p-2 rounded-md text-black bg-white"
                                placeholder="Comma-separated track IDs"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col justify-between items-center mb-4">
                        <label>
                            Seed Artists
                            <input
                                type="text"
                                value={seedartists}
                                onChange={handleSeedArtistsChange}
                                className="ml-2 p-2 rounded-md text-black bg-white"
                                placeholder="Comma-separated artist IDs"
                            />
                        </label>
                    </div>
                    <div className="flex flex-col justify-between items-center mb-4">
                        <label>
                            Seed Genres
                            <input
                                type="text"
                                value={seedgenres}
                                onChange={handleSeedGenresChange}
                                className="ml-2 p-2 rounded-md text-black bg-white"
                                placeholder="Comma-separated genres"
                            />
                        </label>
                    </div>
                </div>
                <div id='controller-buttons'>
                    <button
                        onClick={handleRefetchIfDifferent}
                        id='refetch-controller-button'
                    >
                        Refetch
                    </button>
                    <button
                        // onClick={handleSaveTracks} disabled={isSaving}
                        id='save-controller-button'
                    >
                        {/* {isSaving ? 'Saving...' : 'Save'} */}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecommendationsController;
