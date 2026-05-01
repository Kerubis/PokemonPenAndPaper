import React, { createContext, useContext, useState } from 'react';
import type { MusicLink } from '@/features/encounters/types/Encounter';

interface MusicContextValue {
  currentLink: MusicLink | null;
  setCurrentLink: (link: MusicLink | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const MusicContext = createContext<MusicContextValue>({
  currentLink: null,
  setCurrentLink: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLink, setCurrentLink] = useState<MusicLink | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MusicContext.Provider value={{ currentLink, setCurrentLink, isPlaying, setIsPlaying }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => useContext(MusicContext);
