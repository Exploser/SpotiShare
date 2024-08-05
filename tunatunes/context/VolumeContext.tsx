'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VolumeContextProps {
  volume: number;
  setVolume: (volume: number) => void;
}

const VolumeContext = createContext<VolumeContextProps | undefined>(undefined);

export const useVolume = (): VolumeContextProps => {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
};

export const VolumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [volume, setVolume] = useState<number>(1); // Default volume set to 1 (max)

  return (
    <VolumeContext.Provider value={{ volume, setVolume }}>
      {children}
    </VolumeContext.Provider>
  );
};
