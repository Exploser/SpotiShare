import React from 'react';

interface ApiResponse {
  message?: string;
}

const LogCookieButton: React.FC = () => {
  const handleLogCookie = async () => {
    try {
      const response = await fetch('/api/logCookie', {
        method: 'GET',
      });

      // Explicitly typing the JSON response
      const data = await response.json() as ApiResponse;
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
