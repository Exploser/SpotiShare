// src/_components/connectBtn.tsx
import React from 'react';

const ConnectBtn: React.FC = () => {
  const handleConnectClick = () => {
    window.location.href = '/api/connectSpotify';
  };

  return (
    <button className="bg-lime-600 hover:bg-lime-500 text-white font-bold py-2 px-4 border border-lime-700 rounded mt-4 h-fit" onClick={handleConnectClick}>
      Connect with Spotify
    </button>
  );
};

export default ConnectBtn;
