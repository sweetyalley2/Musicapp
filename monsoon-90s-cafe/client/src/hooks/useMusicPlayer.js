import { useContext } from 'react';
import { MusicContext } from '../contexts/MusicContext';

export const useMusicPlayer = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicProvider');
  }
  return context;
};
