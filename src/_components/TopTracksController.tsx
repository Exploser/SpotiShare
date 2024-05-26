// src/components/TopTracksController.tsx
'use client';

import React from 'react';

interface TopTracksControllerProps {
    timeRange: string;
    setTimeRange: (value: string) => void;
    limit: number;
    setLimit: (value: number) => void;
    handleRefetch: () => void;
}

const TopTracksController: React.FC<TopTracksControllerProps> = ({ timeRange, setTimeRange, limit, setLimit, handleRefetch }) => {
    const handleTimeRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTimeRange(e.target.value);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(Number(e.target.value));
    };

    return (
        <div className="flex flex-col items-center text-white justify-center p-6 bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 rounded-lg shadow-xl transition-transform transform my-12">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">Customize Track Options</h1>
                <label>
                    <input
                        type="radio"
                        name="timeRange"
                        value="short_term"
                        checked={timeRange === 'short_term'}
                        onChange={handleTimeRangeChange}
                    />
                    Short Term
                </label>
                <label>
                    <input
                        type="radio"
                        name="timeRange"
                        value="medium_term"
                        checked={timeRange === 'medium_term'}
                        onChange={handleTimeRangeChange}
                    />
                    Medium Term
                </label>
                <label>
                    <input
                        type="radio"
                        name="timeRange"
                        value="long_term"
                        checked={timeRange === 'long_term'}
                        onChange={handleTimeRangeChange}
                    />
                    Long Term
                </label>
            </div>
            <div>
                <label>
                    Limit:
                    <input
                        type="number"
                        value={limit}
                        onChange={handleLimitChange}
                        className="ml-2"
                    />
                </label>
            </div>
            <button
                onClick={handleRefetch}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
            >
                Refetch Tracks
            </button>
        </div>
    );
};

export default TopTracksController;
