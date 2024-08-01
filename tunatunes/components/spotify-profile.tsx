// src/components/SpotifyProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SpotifyUser } from '@/types/type';
import Link from 'next/link';

const SpotifyProfile: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/spotify/getProfile');
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
      </div>
    </div>
  );

  if (!user) return <div>No user data available.</div>;
  const secondImageUrl = user.images?.[1]?.url;

  return (
    <div className="flex flex-col items-center p-6 rounded-lg shadow-xl transition-transform transform hover:scale-105 w-fit">
      <Link href={user.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        <div className="mb-4">
          {secondImageUrl && (
            <img
              src={secondImageUrl}
              alt={`${user.display_name}`}
              className="w-32 h-32 rounded-xl shadow-lg object-cover"
            />
          )}
        </div>
        <p>
          <a
            href={user.external_urls.spotify}
            target='_blank'
            rel="noopener noreferrer"
            className="text-2xl font-bold text-slate-700 mb-4"
          >
            {user.display_name}
          </a>
        </p>
      </Link>
    </div>
  );
};

export default SpotifyProfile;
