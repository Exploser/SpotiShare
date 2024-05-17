// src/components/SpotifyProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SpotifyUser } from '~/lib/spotify';

const SpotifyProfile: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getSpotifyInfo');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json() as SpotifyUser;
        setUser(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available.</div>;
  const secondImageUrl = user.images?.[1]?.url;

  return (
    <div className='h-fit'>
      <h1>Spotify Profile</h1>
      <div className="images">
        {secondImageUrl && (
          <img src={secondImageUrl} alt={`${user.display_name} second image`} />
        )}
      </div>
      {user.external_urls.spotify && (
        <p>Spotify Profile: <a href={user.external_urls.spotify} target='_blank'>{user.display_name}</a></p>
      )}
      {user.id && <p>ID: {user.id}</p>}
    </div>
  );
};

export default SpotifyProfile;
