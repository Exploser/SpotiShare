// components/SpotifyProfile.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SpotifyUser } from '~/lib/spotify';
import { fetchSpotifyUserData } from '~/pages/api/getSpotifyInfo';


const SpotifyProfile: React.FC = () => {
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookies = document.cookie;
        const match = cookies.match(/spotify_access_token=([^;]+)/);
        if (!match) throw new Error('Spotify access token not found');

        const accessToken = match[1];
        if (!accessToken) throw new Error('Spotify access token not found');

        const userData = await fetchSpotifyUserData(accessToken);
        setUser(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available.</div>;
  const secondImageUrl = user.images[1]?.url;

  return (
    <div className='h-fit'>
      <h1>Spotify Profile</h1>
      <div className="images">
      {secondImageUrl && (
        <img src={secondImageUrl} alt={`${user.display_name} second image`} />
      )}
      </div>
      {user.external_urls.spotify && <p>Spotify Profile: <a href={user.external_urls.spotify} target='_blank'>{user.display_name}</a></p>}
      {user.id && <p>ID: {user.id}</p>}
      
    </div>
  );
};

export default SpotifyProfile;
