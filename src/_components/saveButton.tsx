'use client';

import React, { useState } from 'react';
import { SpotifyTopTracksResponse } from '~/app/toptracks/page';

const SaveTracksButton: React.FC<SpotifyTopTracksResponse> = ({ items }) => {
    console.log(items);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <button onClick={handleSaveTracks} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save Tracks'}
    </button>
  );
};

export default SaveTracksButton;

