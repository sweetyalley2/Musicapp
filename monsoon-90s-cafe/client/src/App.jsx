import LoadingScreen from './components/LoadingScreen';
import ImmersiveRadio from './components/ImmersiveRadio';
import { useState, useEffect } from 'react';

import { MusicProvider } from './contexts/MusicContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading sequence
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MusicProvider>
      <div className="film-grain pointer-events-none z-[9999] opacity-50 mix-blend-overlay"></div>
      {loading ? <LoadingScreen /> : <ImmersiveRadio />}
    </MusicProvider>
  );
}

export default App;
