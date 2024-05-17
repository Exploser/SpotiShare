// src/_components/connectBtn.tsx
import React from 'react';

const ConnectBtn: React.FC = () => {
  const handleConnectClick = () => {
    window.location.href = '/api/connectSpotify';
  };

  return (
    <button className="btn" onClick={handleConnectClick}>
      Connect with Spotify
    </button>
  );
};

export default ConnectBtn;
