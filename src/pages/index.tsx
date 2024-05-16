import React from 'react';

const HomePage: React.FC = () => {
  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        Connect Spotify
      </button>
    </div>
  );
};

export default HomePage;
