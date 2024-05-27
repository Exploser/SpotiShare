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
    <div className="flex justify-center align-middle" id='volume-controller'>
      <div className='w-fit bg-gradient-to-bl from-green-700 via-gray-900 to-green-900 p-4 rounded-2xl shadow-xl transition-transform transform text-center'>
        <label className='m-2' htmlFor="volume">Volume: {Math.round(volume * 100)}%</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full mt-2"
        />
      </div>
    </div>
  );
};

export default VolumeController;
