import React, { createContext, useContext, useState } from 'react';
import type { MusicLink } from '@/features/encounters/types/Encounter';

interface MusicContextValue {
  currentLink: MusicLink | null;
  setCurrentLink: (link: MusicLink | null) => void;
}

const MusicContext = createContext<MusicContextValue>({
  currentLink: null,
  setCurrentLink: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLink, setCurrentLink] = useState<MusicLink | null>(null);

  return (
    <MusicContext.Provider value={{ currentLink, setCurrentLink }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => useContext(MusicContext);
