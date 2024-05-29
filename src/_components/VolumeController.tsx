'use client';

import React, { useEffect } from 'react';
import { useVolume } from '../context/VolumeContext';

const VolumeController: React.FC = () => {
  const { volume, setVolume } = useVolume();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  useEffect(() => {
    const audioElements : NodeListOf<HTMLAudioElement> = document.querySelectorAll('audio.playing');
    audioElements.forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);

  return (
      <div className='flex flex-row w-full px-12 '>
        <label className='w-fit' htmlFor="volume"> {Math.round(volume * 100)}% </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full mt-2 mx-4"
        />
    </div>
  );
};

export default VolumeController;
