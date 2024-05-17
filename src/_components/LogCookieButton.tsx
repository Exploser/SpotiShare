// src/components/LogCookieButton.tsx
import React from 'react';

const LogCookieButton: React.FC = () => {
  const handleLogCookie = async () => {
    try {
      const response = await fetch('/api/logCookie', {
        method: 'GET',
      });
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error logging cookie:', error);
    }
  };

  return (
    <button onClick={handleLogCookie} className="btn">
      Log Spotify Access Token
    </button>
  );
};

export default LogCookieButton;
