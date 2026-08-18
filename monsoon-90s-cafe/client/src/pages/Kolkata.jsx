import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import RainCanvas from '../components/RainCanvas';
import RadioDial from '../components/RadioDial';
import CassetteCard from '../components/CassetteCard';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists } from '../data/fallbackSongs';

const Kolkata = () => {
  const { playSong } = useMusicPlayer();
  const [playlists, setPlaylists] = useState(fallbackPlaylists);
  const [quotes] = useState([
    "Some things never change, like the taste of rain and roadside tea.",
    "A yellow taxi passes by, carrying stories of a hundred monsoons.",
    "In the silence of the radio, old love letters are rewritten.",
    "The tram rings its bell, a familiar heartbeat in the rainy city."
  ]);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    // Fetch real playlists from API if available
    fetch('http://localhost:5000/api/playlists')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setPlaylists(data);
      })
      .catch(err => console.log('Using fallback playlists'));
  }, []);

  const handleTune = () => {
    // Tuning sound or subtle effect could go here
  };

  const handleChaiClick = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePlaylistClick = async (playlist) => {
    try {
      // Try to get songs for this playlist
      const response = await fetch('http://localhost:5000/api/songs');
      const allSongs = await response.json();
      const playlistSongs = allSongs.filter(s => playlist.songs.includes(s.id));
      
      if (playlistSongs.length > 0) {
        playSong(playlistSongs[0], playlistSongs);
      }
    } catch (error) {
      console.log('Error fetching songs for playlist', error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen pt-24 pb-32 px-4 md:px-12 bg-navy-900"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558296726-6460b5e91eb7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity grayscale"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent"></div>
      
      <RainCanvas preset="kolkata" />
      
      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-between">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-vintage text-gold text-glow mb-2">Kolkata Nights</h1>
          <p className="text-monsoon font-ui tracking-wide">Old radios, yellow taxis, and warm chai.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 flex-grow">
          {/* Left Column: Radio & Chai */}
          <div className="md:col-span-4 flex flex-col gap-8 justify-end">
            
            <div className="glass-panel p-6 rounded-2xl border-t border-gold/20 flex flex-col items-center">
              <h3 className="font-vintage text-gold mb-6 text-xl">Tune the Radio</h3>
              <RadioDial onTune={handleTune} />
              <p className="mt-4 text-xs text-monsoon uppercase tracking-widest text-center">
                90s Love Letters
              </p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleChaiClick}
              className="glass-panel p-6 rounded-2xl cursor-pointer group"
            >
              <div className="text-3xl mb-4 opacity-80 group-hover:opacity-100 transition-opacity">☕</div>
              <p className="font-vintage text-cream text-lg italic transition-all duration-500">
                "{quotes[currentQuote]}"
              </p>
            </motion.div>
          </div>

          {/* Right Column: Cassettes */}
          <div className="md:col-span-8 glass-panel p-6 md:p-10 rounded-2xl">
            <h3 className="font-vintage text-2xl text-cream mb-8 border-b border-white/10 pb-4 flex justify-between items-end">
              <span>Cassette Shelf</span>
              <span className="text-sm font-ui text-monsoon">Select to play</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist, index) => (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CassetteCard 
                    playlist={playlist} 
                    onClick={() => handlePlaylistClick(playlist)} 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Kolkata;
