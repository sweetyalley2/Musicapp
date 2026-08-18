import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Kolkata from './pages/Kolkata';
import Mumbai from './pages/Mumbai';
import Jukebox from './pages/Jukebox';
import About from './pages/About';
import ImmersiveRadio from './components/ImmersiveRadio';
import { MusicProvider } from './contexts/MusicContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Smooth initial experience
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MusicProvider>
      <BrowserRouter>
        <div className="relative min-h-screen bg-[#0b0f19] text-[#FFF8EB] flex flex-col font-ui selection:bg-[#F3C969] selection:text-[#0b0f19]">
          {/* Subtle Film Grain Noise */}
          <div className="film-grain"></div>

          {/* Persistent Top Navigation */}
          <Navbar />

          {/* Dynamic Page Views */}
          <main className="flex-grow pb-24 md:pb-28">
            <Routes>
              <Route path="/" element={<Kolkata />} />
              <Route path="/kolkata" element={<Kolkata />} />
              <Route path="/mumbai" element={<Mumbai />} />
              <Route path="/jukebox" element={<Jukebox />} />
              <Route path="/radio" element={<ImmersiveRadio />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Universal Sticky Bottom Music Player */}
          <MusicPlayer />
        </div>
      </BrowserRouter>
    </MusicProvider>
  );
}

export default App;
