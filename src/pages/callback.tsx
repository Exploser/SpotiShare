"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface TokenResponse {
  access_token: string;
  error?: string;
}

const Callback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const { code, state, error } = router.query;
      console.log('Callback parameters:', { code, state, error });

      if (Array.isArray(error) || Array.isArray(code)) {
        console.error('Invalid parameter format');
        return;
      }

      if (error) {
        console.error('Error during authentication:', error);
        return;
      }

      if (code) {
        try {
          const response = await fetch('/api/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
          });

          const data = await response.json() as TokenResponse;
          console.log('Access token response:', data);

          if (data.access_token) {
            sessionStorage.setItem('spotify_access_token', data.access_token);
          }
          return data; // return the data to the next then
        } catch (err) {
          console.error('Error fetching access token:', err);
          throw err; // rethrow to catch in catch block
        }
      } else {
        throw new Error("No code provided");
      }
    };

    fetchToken()
      .then((data) => {
        // Assuming you want to redirect after successful token handling
        if (data && data.access_token) {
          router.push('/');
        }
      })
      .catch((error) => {
        console.error('Unhandled error in fetchToken:', error);
      });
  }, [router.isReady, router.query]);

  return <div>Loading...</div>;
};

export default Callback;
