import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Radio as RadioIcon, Sparkles, Play, Music } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';
import RadioDial from '../components/RadioDial';
import CassetteCard from '../components/CassetteCard';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists, fallbackSongs } from '../data/fallbackSongs';

const Kolkata = () => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const [playlists, setPlaylists] = useState(fallbackPlaylists);
  const [activePlaylistId, setActivePlaylistId] = useState(fallbackPlaylists[0]?.id || null);
  const [activeSongs, setActiveSongs] = useState([]);
  
  const quotes = [
    "Some things never change, like the rhythm of rain on Howrah Bridge and steaming roadside tea.",
    "A yellow taxi splashes by College Street, carrying stories of a hundred monsoons.",
    "In the warm static of a vintage radio, old love letters find their lost melody.",
    "The tram bell rings through the foggy drizzle, a familiar heartbeat of the City of Joy.",
    "Paper boats floating down North Kolkata lanes, accompanied by Hemant Kumar on cassette."
  ];
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/playlists')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setPlaylists(data);
        }
      })
      .catch(() => {});
  }, []);

  // Update active songs when active playlist changes
  useEffect(() => {
    const pl = playlists.find(p => p.id === activePlaylistId) || playlists[0];
    if (pl && pl.songs) {
      const filtered = fallbackSongs.filter(s => pl.songs.includes(s.id));
      setActiveSongs(filtered.length > 0 ? filtered : fallbackSongs.slice(0, 10));
    } else {
      setActiveSongs(fallbackSongs.slice(0, 10));
    }
  }, [activePlaylistId, playlists]);

  const handleChaiClick = () => {
    setCurrentQuote((prev) => (prev + 1) % quotes.length);
  };

  const handlePlaylistClick = (playlist) => {
    setActivePlaylistId(playlist.id);
    const playlistTracks = fallbackSongs.filter(s => playlist.songs.includes(s.id));
    if (playlistTracks.length > 0) {
      playSong(playlistTracks[0], playlistTracks);
    }
  };

  const handleTune = () => {
    // Tune radio effect: switch to a random track from active playlist
    if (activeSongs.length > 0) {
      const rand = activeSongs[Math.floor(Math.random() * activeSongs.length)];
      playSong(rand, activeSongs);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen pt-24 pb-36 px-4 sm:px-6 md:px-12 bg-[#080d1a]"
    >
      {/* Background Image with High-Contrast Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/bg-kolkata-howrah.jpg" 
          alt="Kolkata Rainy Streets" 
          className="w-full h-full object-cover opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#080d1a]/85 to-[#0b0f19]"></div>
      </div>

      <RainCanvas preset="kolkata" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* Page Header */}
        <header className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F3C969]/10 text-[#F3C969] px-3.5 py-1.5 rounded-full border border-[#F3C969]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-3 shadow-md">
            <Sparkles size={13} />
            <span>Kolkata 90s Monsoon Edition</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-vintage font-bold text-[#FFF8EB] mb-2 text-glow">
            Kolkata Nights
          </h1>
          <p className="text-sm md:text-lg text-[#94A3B8] font-ui max-w-2xl font-medium">
            Old radios, yellow cabs, roadside chai stalls, and immortal Bengali & Hindi 90s melodies.
          </p>
        </header>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Radio Dial & Chai Nostalgia Box */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Vintage Radio Tuner Box */}
            <div className="glass-panel p-6 rounded-3xl border-t border-[#F3C969]/30 flex flex-col items-center text-center shadow-2xl">
              <div className="flex items-center gap-2 text-[#F3C969] mb-4">
                <RadioIcon size={20} />
                <h3 className="font-vintage font-bold text-xl text-[#FFF8EB]">
                  Tune The Radio
                </h3>
              </div>
              <p className="text-xs text-[#94A3B8] mb-6 max-w-xs font-ui">
                Rotate the knob to tune into nostalgic frequencies across Akashvani Kolkata.
              </p>
              
              <RadioDial onTune={handleTune} />
              
              <span className="mt-5 text-[11px] font-mono text-[#F3C969] bg-[#F3C969]/10 px-3 py-1 rounded-full border border-[#F3C969]/20 font-bold uppercase tracking-wider">
                98.3 FM • Nostalgia Wave
              </span>
            </div>

            {/* Chai & Kolkata Quote Box */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={handleChaiClick}
              className="glass-card glass-card-hover p-6 rounded-3xl cursor-pointer select-none group border-t border-[#F3C969]/30 shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-[#F3C969]">
                  <Coffee size={22} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Tap for another quote</span>
                </div>
                <span className="text-xl">☕</span>
              </div>
              
              <p className="font-vintage text-[#FFF8EB] text-base md:text-lg italic leading-relaxed text-backdrop">
                "{quotes[currentQuote]}"
              </p>
            </motion.div>
          </div>

          {/* Right Column: Cassette Shelf & Active Playlist Tracks */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Cassette Shelf */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-2xl border-t border-white/15">
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                <div>
                  <h2 className="font-vintage font-bold text-2xl md:text-3xl text-[#FFF8EB] text-glow">
                    Cassette Shelf
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Select a vintage tape to load the playlist</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#F3C969] bg-[#F3C969]/10 px-3 py-1 rounded-full border border-[#F3C969]/20">
                  {playlists.length} Tapes
                </span>
              </div>

              {/* Responsive Cassette Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {playlists.map((playlist) => (
                  <CassetteCard
                    key={playlist.id}
                    playlist={playlist}
                    isActive={activePlaylistId === playlist.id}
                    onClick={() => handlePlaylistClick(playlist)}
                  />
                ))}
              </div>
            </div>

            {/* Current Cassette Track List */}
            <div className="glass-panel p-6 rounded-3xl shadow-2xl border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[#F3C969]">
                  <Music size={18} />
                  <h3 className="font-vintage font-bold text-lg text-[#FFF8EB]">
                    Tracks on this Tape
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">
                  {activeSongs.length} Songs Loaded
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {activeSongs.map((song, index) => {
                  const isSelected = currentSong?.id === song.id;
                  const isThisPlaying = isSelected && isPlaying;

                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song, activeSongs)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#2d1c19]/90 border-[#F3C969] shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="text-xs font-mono text-[#94A3B8] w-5 text-center flex-shrink-0 font-bold">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-[#F3C969]' : 'text-[#FFF8EB]'}`}>
                            {song.title}
                          </h4>
                          <p className="text-xs text-[#94A3B8] font-medium truncate">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isThisPlaying ? (
                          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#F3C969]/20 text-[#F3C969] text-xs font-mono">
                            Playing
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#F3C969] text-[#CBD5E1] hover:text-[#0b0f19] flex items-center justify-center transition-colors">
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Kolkata;
