import { useEffect, useState } from "react";

export default function connectBtn() {
const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/getSpotifyToken');
        const data = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          console.error('Error fetching token:', data.error);
        }
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    fetchToken();
  }, []);

    return (
        <div className="flex w-full items-center justify-between p-4 text-xl font-semibold">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Connect Spotify
            </button>    
        </div>

    );
}