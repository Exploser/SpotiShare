import React from 'react';
import { useVolume } from '../context/VolumeContext';

const VolumeController: React.FC = () => {
  const { volume, setVolume } = useVolume();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return (
    <div className="volume-controller">
      <label htmlFor="volume">Volume: {Math.round(volume * 100)}%</label>
      <input
        id="volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeController;