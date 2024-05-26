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
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center text-white justify-center p-6 bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 rounded-lg shadow-xl transition-transform transform my-12" id="top-tracks-controller">
      <h1 className="text-3xl font-bold text-white mb-4">Customize Track Options</h1>
      <div className="flex flex-row">
        <div className="flex flex-col justify-between mr-4">
          <label className="mb-2">
            Time Range:
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="ml-2 p-2 rounded-md text-black bg-white"
            >
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Limit:
            <input
              type="number"
              value={limit}
              onChange={handleLimitChange}
              className="w-12 text-black bg-white rounded-md p-1 ml-2"
            />
          </label>
        </div>
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
