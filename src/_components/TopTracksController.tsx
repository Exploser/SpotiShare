'use client';

import React, { useState, useEffect } from 'react';
import VolumeController from './VolumeController';
import { Artist, Track } from '~/app/toptracks/page';

interface TopTracksControllerProps {
  timeRange: string;
  setTimeRange: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  handleRefetch: () => void;
  items: Track[] | Artist[];
}

const TopTracksController: React.FC<TopTracksControllerProps> = ({ timeRange, setTimeRange, limit, setLimit, handleRefetch, items }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [refetchAttempted, setRefetchAttempted] = useState(false);
  const initialTimeRange = 'medium_term';
  const initialLimit = 19;

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(Number(e.target.value));
  };

  const handleSaveTracks = async () => {
    if (isSaving) return; // Prevent the function from running if it's already in progress

    setIsSaving(true);
    try {
      const response = await fetch('/api/saveTracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tracks');
      }

      // Handle success (optional)
      console.log('Tracks saved successfully');
    } catch (error) {
      console.error(error);
      // Handle error (optional)
    } finally {
      setIsSaving(false); // Re-enable the button after the operation is complete
    }
  };

  const handleRefetchIfDifferent = () => {
    setRefetchAttempted(true);
    if (timeRange !== initialTimeRange || limit != initialLimit) {
      handleRefetch();
    }
  };

  return (
    <div className="flex flex-col items-center text-white justify-center p-6 bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 rounded-lg shadow-xl transition-transform transform my-12" id="top-tracks-controller">
      <h1 className="text-3xl font-bold text-white mb-4">Customize Track Options</h1>
      {refetchAttempted && (timeRange === initialTimeRange || limit === initialLimit) && (
        <p className="text-red-500 mt-2">Please change the time range or offset to refetch tracks.</p>
      )}
      <div className="flex flex-row my-2">
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
      <VolumeController />
      <button
        onClick={handleRefetchIfDifferent}
        className={`bg-blue-500 text-white px-4 py-2 rounded-md my-2`}
      >
        Refetch Tracks
      </button>
      <button onClick={handleSaveTracks} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Tracks'}
      </button>
    </div>
  );
};

export default TopTracksController;
