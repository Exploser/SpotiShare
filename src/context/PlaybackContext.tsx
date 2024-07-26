'use client';
import React, { createContext, useContext, useState } from 'react';

interface PlaybackContextProps {
  currentTrackId: string | null;
  setCurrentTrackId: (id: string | null) => void;
  volume: number;
  setVolume: (volume: number) => void;
  handlePlayPause: (trackId: string) => void;
}

const PlaybackContext = createContext<PlaybackContextProps | undefined>(undefined);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  const handlePlayPause = (trackId: string) => {
    const audioElement = document.getElementById(`audio-${trackId}`) as HTMLAudioElement | null;
    if (!audioElement) return;

    if (currentTrackId === trackId) {
      audioElement.pause();
      setCurrentTrackId(null);
    } else {
      if (currentTrackId) {
        const currentAudio = document.getElementById(`audio-${currentTrackId}`) as HTMLAudioElement | null;
        if (currentAudio) {
          currentAudio.pause();
        }
      }
      audioElement.volume = volume;
      audioElement.play().catch((err) => console.error(err));
      setCurrentTrackId(trackId);
    }
  };

  return (
    <PlaybackContext.Provider value={{ currentTrackId, setCurrentTrackId, volume, setVolume, handlePlayPause }}>
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = (): PlaybackContextProps => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
