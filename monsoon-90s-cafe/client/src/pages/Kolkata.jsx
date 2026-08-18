import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Radio as RadioIcon, Music, Play, Pause, Search, Sparkles, Disc } from 'lucide-react';
import InteractiveRainGlass from '../components/InteractiveRainGlass';
import RadioDial from '../components/RadioDial';
import CassetteCard from '../components/CassetteCard';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists, fallbackSongs } from '../data/fallbackSongs';
import { sfx } from '../utils/soundEffects';

const Kolkata = () => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const [playlists, setPlaylists] = useState(fallbackPlaylists);
  const [activePlaylistId, setActivePlaylistId] = useState(fallbackPlaylists[0]?.id || null);
  const [activeSongs, setActiveSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  
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
      setActiveSongs(filtered.length > 0 ? filtered : fallbackSongs.slice(0, 12));
    } else {
      setActiveSongs(fallbackSongs.slice(0, 12));
    }
  }, [activePlaylistId, playlists]);

  const RADIO_STATIONS = [
    { freq: '98.3 FM', title: 'Akashvani Kolkata' },
    { freq: '102.6 FM', title: 'Vividh Bharati' },
    { freq: '91.9 FM', title: 'Kolkata Gold' },
    { freq: '107.0 FM', title: 'AIR Bangla' },
  ];
  const [stationIndex, setStationIndex] = useState(0);

  const handleChaiClick = () => {
    sfx.playMechanicalClick();
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
    sfx.playMechanicalClick();
    setStationIndex((prev) => (prev + 1) % RADIO_STATIONS.length);
    const pool = activeSongs.length > 0 ? activeSongs : fallbackSongs;
    const remaining = pool.filter(s => s.id !== currentSong?.id);
    const selected = remaining.length > 0 ? remaining[Math.floor(Math.random() * remaining.length)] : pool[0];
    if (selected) {
      playSong(selected, pool);
    }
  };

  const displayedSongs = activeSongs.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 pb-36 px-4 sm:px-6 md:px-12 bg-[#060911]"
    >
      {/* Background Image with Cinematic Matte Finish */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/bg-kolkata-rain.jpg" 
          alt="Kolkata Monsoon Rain" 
          className="w-full h-full object-cover opacity-45 filter brightness-[0.68] contrast-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060911]/85 via-[#060911]/60 to-[#060911]/95"></div>
      </div>

      <InteractiveRainGlass intensity="medium" />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* Editorial Page Header */}
        <header className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#141c2e]/90 text-[#e2a450] px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2a450]"></span>
            <span>Kolkata Rainy Day Archive • 1990s</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-vintage font-bold text-[#f4eee2] mb-1.5 tracking-tight">
            Kolkata Nights
          </h1>
          <p className="text-xs sm:text-base text-[#8492a6] font-ui max-w-2xl font-normal">
            Vintage transistor radios, yellow Ambassador cabs, roadside chai stalls, and immortal monsoon melodies.
          </p>
        </header>

        {/* Main 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left Column: Handcrafted Analog Radio & Nostalgia Memory */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Analog Radio Receiver Card */}
            <div className="craft-panel p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-white/[0.07]">
                <div className="flex items-center gap-2 text-[#e2a450]">
                  <RadioIcon size={16} />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#f4eee2]">
                    Analog Receiver
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8492a6]">FM / MW</span>
              </div>
              
              <RadioDial 
                onTune={handleTune} 
                currentFrequency={RADIO_STATIONS[stationIndex].freq}
                isPlaying={isPlaying}
              />
              
              <div className="mt-3 w-full flex items-center justify-between bg-[#060911] p-2.5 rounded-xl border border-white/[0.08]">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-mono text-[#e2a450] font-semibold block">
                    {RADIO_STATIONS[stationIndex].freq} • {RADIO_STATIONS[stationIndex].title}
                  </span>
                  {isPlaying && currentSong ? (
                    <p className="text-xs text-[#f4eee2] font-vintage truncate mt-0.5">
                      ♪ {currentSong.title}
                    </p>
                  ) : (
                    <span className="text-[10px] text-[#8492a6] font-mono">Tuner Ready</span>
                  )}
                </div>
                <button 
                  onClick={handleTune}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#141c2e] hover:bg-[#e2a450] text-[#e2a450] hover:text-[#060911] rounded-lg border border-white/10 transition-colors flex-shrink-0"
                >
                  Tune
                </button>
              </div>
            </div>

            {/* Nostalgia Quote Card */}
            <motion.div 
              whileHover={{ y: -2 }}
              onClick={handleChaiClick}
              className="craft-card p-5 rounded-2xl cursor-pointer select-none group border border-white/10 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.06]">
                <div className="flex items-center gap-2 text-[#e2a450]">
                  <Coffee size={16} />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">Monsoon Memory</span>
                </div>
                <span className="text-[10px] font-mono text-[#8492a6] group-hover:text-[#e2a450] transition-colors">
                  Tap for next
                </span>
              </div>
              
              <p className="font-vintage text-[#f4eee2] text-sm sm:text-base italic leading-relaxed pt-1">
                "{quotes[currentQuote]}"
              </p>
            </motion.div>
          </div>

          {/* Right Column: Cassette Rack & Track Directory */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            
            {/* Cassette Deck Shelf */}
            <div className="craft-panel p-5 md:p-6 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div>
                  <h2 className="font-vintage font-bold text-xl md:text-2xl text-[#f4eee2]">
                    Cassette Shelf
                  </h2>
                  <p className="text-xs text-[#8492a6] mt-0.5">Select a tape to insert into the deck</p>
                </div>
                <span className="text-xs font-mono font-bold text-[#e2a450] bg-[#e2a450]/10 px-3 py-1 rounded-full border border-[#e2a450]/20">
                  {playlists.length} Tapes
                </span>
              </div>

              {/* Responsive 3-Column Cassette Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

            {/* Current Loaded Tape Track Directory */}
            <div className="craft-panel p-5 rounded-2xl shadow-2xl border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2 text-[#e2a450]">
                  <Music size={16} />
                  <h3 className="font-vintage font-bold text-base md:text-lg text-[#f4eee2]">
                    Tracks on Active Tape
                  </h3>
                  <span className="text-[10px] font-mono text-[#8492a6] bg-white/5 px-2 py-0.5 rounded">
                    {displayedSongs.length} Songs
                  </span>
                </div>

                {/* Track Search Filter */}
                <div className="relative w-full sm:w-56">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8492a6]" />
                  <input 
                    type="text"
                    placeholder="Search song or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#060911] border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-[#f4eee2] placeholder-[#505c6e] focus:outline-none focus:border-[#e2a450]/60 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Scrollable Tracklist */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {displayedSongs.map((song, index) => {
                  const isSelected = currentSong?.id === song.id;
                  const isThisPlaying = isSelected && isPlaying;

                  return (
                    <div
                      key={song.id}
                      onClick={() => playSong(song, activeSongs)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[#182030] border-[#e2a450] shadow-md'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span className="text-xs font-mono text-[#8492a6] w-5 text-center flex-shrink-0 font-medium">
                          {index + 1}
                        </span>
                        
                        <div className="min-w-0">
                          <h4 className={`text-xs sm:text-sm font-semibold truncate ${isSelected ? 'text-[#e2a450]' : 'text-[#f4eee2]'}`}>
                            {song.title}
                          </h4>
                          <p className="text-[11px] text-[#8492a6] truncate mt-0.5">
                            {song.artist}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isThisPlaying ? (
                          <div className="flex items-center gap-1 bg-[#e2a450]/20 text-[#e2a450] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                            <span className="w-1 h-3 bg-[#e2a450] animate-pulse"></span>
                            <span>Playing</span>
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-lg bg-white/5 hover:bg-[#e2a450] text-[#8492a6] hover:text-[#060911] flex items-center justify-center transition-colors">
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

