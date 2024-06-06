// Code: src/app/discover/page.tsx

'use client';

import { useEffect, useRef, useState } from "react";
import SavedController from "~/_components/SavedController";
import VolumeController from "~/_components/VolumeController";
import { useVolume } from "~/context/VolumeContext";

interface Image {
  url: string;
  height: number;
  width: number;
}

interface ExternalUrls {
  spotify: string;
}

interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
  followers?: {
    href: string;
    total: number;
  };
  genres?: string[];
  images?: Image[];
  popularity?: number;
}

interface Album {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: string;
  uri: string;
  artists: Artist[];
}

interface ExternalIds {
  isrc: string;
  ean: string;
  upc: string;
}

interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url?: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface TracksResponse {
  tracks: Track[];
}

export default function Discover() {
  const { volume, setVolume } = useVolume();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [seed_tracks, setSeedTracks] = useState('');
  const [seed_artists, setSeedArtists] = useState('');
  const [seed_genres, setSeedGenres] = useState('');
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [sampleColors, setSampleColors] = useState<Record<string, string>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  useEffect(() => {
    const audioElements: NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio.playing');
    audioElements.forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);


  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const seedtracks = urlParams.get('seed_tracks');
      const seedartists = urlParams.get('seed_artists');
      const seedgenres = urlParams.get('seed_genres');

      if (seedtracks) {
        const selectedIds = seedtracks.split(',');
        const seedTracks = selectedIds.slice(0, 5).join(',');
        setSeedTracks(seedTracks);
      }
      if (seedartists) {
        const selectedIds = seedartists.split(',');
        const seedArtists = selectedIds.slice(0, 5).join(',');
        setSeedArtists(seedArtists);
      }
      if (seedgenres) {
        const selectedIds = seedgenres.split(',');
        const seedGenres = selectedIds.slice(0, 5).join(',');
        setSeedGenres(seedGenres);
      }
    }
  }, [isMounted]);

  useEffect(() => {
    if (seed_tracks || seed_artists) {
      fetchRecommendations(seed_tracks, seed_artists, seed_genres).catch((err) =>
        console.error(err)
      );
    }
  }, [seed_tracks, seed_artists, seed_genres]);

  const buildSpotifyAPIUrl = (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
    const baseUrl = '/api/spotifyAPICalls/getRecommendations';
    const params = new URLSearchParams();

    if (seed_tracks) {
      params.append('seed_tracks', seed_tracks);
    }

    if (seed_artists) {
      params.append('seed_artists', seed_artists);
    }

    if (seed_genres) {
      params.append('seed_genres', seed_genres);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const fetchRecommendations = async (seed_tracks?: string, seed_artists?: string, seed_genres?: string) => {
    try {
      const url = buildSpotifyAPIUrl(seed_tracks, seed_artists, seed_genres);
      console.log(url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }
      const data: TracksResponse = await response.json() as TracksResponse;
      setTracks(data.tracks);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };
  const handlePlay = (trackId: string) => {
    const audioElement = document.getElementById(`audio-${trackId}`) as HTMLAudioElement | null;
    if (!audioElement) return;

    if (currentTrackId === trackId) {
      // Pause the current track
      audioElement.pause();
      setCurrentTrackId(null);
    } else {
      // Pause any currently playing track
      const currentAudio = document.querySelector('audio.playing')! as HTMLAudioElement | null;
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.classList.remove('playing');
      }

      // Play the new track
      audioElement.volume = volume;
      audioElement.play().catch((err) => console.error(err));
      audioElement.classList.add('playing');
      setCurrentTrackId(trackId);
    }
  };

  const getColorFromImage = (imageUrl: string, trackId: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.crossOrigin = "Anonymous"; // This is important to avoid CORS issues
    image.src = imageUrl;

    image.onload = () => {
      context.drawImage(image, 0, 0, 1, 1);
      const pixelData = context.getImageData(0, 0, 1, 1);
      if (!pixelData) return;
      const pixel = pixelData.data;
      const color = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}`;
      setSampleColors(prevColors => ({ ...prevColors, [trackId]: color }));
    };
  };

  useEffect(() => {
    tracks.forEach(track => {
      if (track.album.images.length > 0 && track.album.images[0]) {
        getColorFromImage(track.album.images[0].url, track.id);
      }
    });
  }, [tracks]);

  const removeTextInParentheses = (str: string) => {
    const splitStr = str.split('(');
    if (splitStr.length > 0) {
      return splitStr[0]?.trim();
    }
    return str;
  };

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <section>
      <h1 className={`"font-sans text-4xl md:text-5xl lg:text-6xl text-white text-center leading-tight tracking-tight font-bold my-4 mx-auto max-w-2xl"`} id="top-track-heading">
        Discover New Music !
      </h1>

      <canvas ref={canvasRef} width="1" height="1" style={{ display: 'none' }}></canvas>

      <div className={`${imageLoaded ? "w-full flex flex-col justify-center items-center mt-12" : "hidden"}`}>
        <div className="max-w-screen-lg h-full w-fit text-white">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full">
            {tracks.map((track) => (
              <li
                key={track.id}
                className={`relative rounded-lg shadow-md p-2 flex flex-col items-center ${imageLoaded ? 'animate__animated animate__fadeInUp' : 'hidden'}`}
                style={{ backgroundColor: sampleColors[track.id] }}>

                <div className="relative w-full" id="spotify-tracks-rest">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    onLoad={() => {
                      setTimeout(() => setImageLoaded(true), 1000); // Delay the animation start
                    }}
                    className="w-full object-contain shadow-xl rounded-md mb-2"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity flex flex-col items-center justify-center p-4 w-full" id="spotify-tracks-rest-details">
                    <p className="text-sm text-gray-300 text-center mb-2">Album: {track.album.name}</p>
                    <p className="text-sm text-gray-300 text-center mb-2">Track: {track.track_number} of {track.album.total_tracks}</p>
                    <p className="text-sm text-gray-300 text-center mb-2">By: {track.artists.map(artist => artist.name).join(', ')}</p>
                    <div className="flex flex-col justify-evenly items-center w-full">
                      {track.preview_url && (
                        <div>
                          <button className="play-button bg-blue-500 text-white px-4 py-2 rounded-md mb-2" onClick={() => handlePlay(track.id)}>
                            {currentTrackId === track.id ? 'Pause' : 'Play'}
                          </button>
                          <audio id={`audio-${track.id}`} src={track.preview_url} className="hidden"></audio>
                        </div>
                      )}
                      <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        <p>Listen on Spotify</p>
                      </a>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-center spotify-track-title">{removeTextInParentheses(track.name)}</p>
              </li>

            ))}
          </ul>
        </div>
        <div id="controller">
          <div className="flex flex-col items-center justify-center mb-4">
            <SavedController
              seedtracks={seed_tracks}
              setSeedTracks={setSeedTracks}
              seedartists={seed_artists}
              setSeedArtists={setSeedArtists}
              seedgenres={seed_genres}
              setSeedGenres={setSeedGenres}
              handleRefetch={() => fetchRecommendations(seed_artists,seed_genres,seed_tracks)}
            />
          </div>
        </div>
      </div>

      <div className={`${imageLoaded ? "hidden" : "flex justify-center items-center text-white h-screen"}`}>
        {/* <p className="text-3xl">Loading...  &nbsp;</p>  */}
        <svg width="126" height="126" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <style>
            {`.spinner_GmWz{ 
                            fill: white;
                            animation: spinner_Ctle 0.8s linear infinite; 
                            animation-delay: -0.8s; }

                            .spinner_NuDr { animation-delay: -0.65s; }
                            .spinner_OlQ0 { animation-delay: -0.5s; }
                            @keyframes spinner_Ctle { 93.75%, 100% { opacity: 0.2; } }`}
          </style>
          <rect className="spinner_GmWz" x="1" y="4" width="6" height="14" />
          <rect className="spinner_GmWz spinner_NuDr" x="9" y="4" width="6" height="14" />
          <rect className="spinner_GmWz spinner_OlQ0" x="17" y="4" width="6" height="14" />
        </svg>
      </div>
      <VolumeController />
    </section>
  );
}
