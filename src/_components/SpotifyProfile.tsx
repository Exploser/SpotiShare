// src/components/SpotifyProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { SpotifyUser } from '~/lib/spotify';
import ConnectBtn from './connectBtn';

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

  if (error) return (
    <div>
      <div className='flex flex-col'>
        Please Connect your Spotify Account
        <ConnectBtn />
      </div>
    </div>
    );

  if (!user) return <div>No user data available.</div>;
  const secondImageUrl = user.images?.[1]?.url;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105 my-12"
    id='spotify-profile-card'>
      <h1 className="text-2xl font-bold text-white mb-4">Spotify Profile</h1>
      <div className="images mb-4">
        {secondImageUrl && (
          <img
            src={secondImageUrl}
            alt={`${user.display_name}`}
            className="w-32 h-32 rounded-full shadow-lg object-cover"
          />
        )}
      </div>
      {user.external_urls.spotify && (
        <p>
          <a
            href={user.external_urls.spotify}
            target='_blank'
            rel="noopener noreferrer"
            className="text-2xl font-bold text-white mb-4"
          > 
            {user.display_name}
          </a>
        </p>
      )}
    </div>

  );
};

export default SpotifyProfile;
