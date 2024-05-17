import React from 'react';

interface ApiResponse {
  message?: string;
}

const LogCookieButton: React.FC = () => {
  const handleLogCookie = async () => {
    try {
      const response = await fetch('/api/getSpotifyInfo', {
        method: 'GET',
      });

      const data = await response.json() as ApiResponse;
      console.log(data.message);
    } catch (error) {
      console.error('Error logging cookie:', error);
    }
  };

    return (
    <button onClick={handleLogCookie} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 border border-red-700 rounded my-4 h-fit">
      Log Token
    </button>
  );
};

export default LogCookieButton;
