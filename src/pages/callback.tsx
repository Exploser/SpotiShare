// src/pages/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Callback: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const { code, state, error } = router.query;
      console.log('Callback parameters:', { code, state, error });

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
          const data = await response.json();
          console.log('Access token response:', data);

          // Store the token in session storage
          if (data.access_token) {
            sessionStorage.setItem('spotify_access_token', data.access_token);
          }

          // Redirect to home page or another page
          router.push('/');
        } catch (err) {
          console.error('Error fetching access token:', err);
        }
      }
    };

    if (router.isReady && router.query.code) {
      fetchToken().catch((error) => {
        console.error('Error in fetchToken:', error);
      });
    }
  }, [router.isReady, router.query]);

  return <div>Loading...</div>;
};

export default Callback;
