import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, SkipForward, SkipBack, Play, Pause, Disc, ListMusic, Sparkles } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists, fallbackSongs } from '../data/fallbackSongs';
import { formatTime } from './MusicPlayer';

const ImmersiveRadio = () => {
  const [isOnline, setIsOnline] = useState(42);
  const [clockTime, setClockTime] = useState("");
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay, 
    playNext, 
    playPrevious,
    playSong,
    changeVolume,
    toggleMute,
    seekTo
  } = useMusicPlayer();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setClockTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsOnline(Math.floor(Math.random() * 40) + 25);
    if (!currentSong) {
      const playlist = fallbackPlaylists[0];
      const songs = fallbackSongs.filter(s => playlist.songs.includes(s.id));
      if (songs.length > 0) {
        playSong(songs[0], songs);
      }
    }
  }, []);

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (duration > 0) {
      seekTo((val / 100) * duration);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center overflow-hidden text-[#FFF8EB] pt-20 pb-36 px-4">
      
      {/* High Quality Kolkata Rainy Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="/bg-kolkata-rain.jpg" 
          alt="Kolkata Monsoon with Rain"
          className="w-full h-full object-cover filter brightness-[0.55] contrast-115 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/80 via-[#0b0f19]/40 to-[#0b0f19]/95 backdrop-blur-[1px]"></div>
      </div>

      {/* Top Floating Badges (Clock & Live Listeners) */}
      <div className="relative z-20 w-full max-w-5xl flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/15 shadow-xl">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80] animate-pulse"></div>
          <span className="text-xs font-mono font-bold text-[#FFF8EB] tracking-wide">
            {isOnline} listening together
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono font-bold text-[#F3C969] bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-[#F3C969]/30 shadow-xl">
            {clockTime}
          </span>
          
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)} 
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-xl border transition-all shadow-xl ${
              showPlaylist ? 'bg-[#F3C969] text-[#0b0f19] border-[#F3C969]' : 'bg-black/60 text-[#CBD5E1] hover:text-[#FFF8EB] border-white/15'
            }`}
          >
            <ListMusic size={16} />
            <span className="hidden sm:inline">Queue</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Vintage Kolkata Radio Player */}
      <div className="relative z-20 w-full max-w-3xl flex flex-col items-center text-center my-auto py-4">
        
        <div className="inline-flex items-center gap-2 bg-[#F3C969]/15 text-[#F3C969] px-4 py-1.5 rounded-full border border-[#F3C969]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
          <Sparkles size={14} />
          <span>Akashvani Kolkata 90s Live</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-vintage font-bold text-[#FFF8EB] tracking-wider mb-2 text-glow">
          Rainy Radio
        </h1>
        <p className="text-sm sm:text-base text-[#CBD5E1] font-ui font-medium max-w-md mb-8">
          Sit back with warm chai and listen to the uninterrupted rain broadcast.
        </p>

        {/* Large Spinning Vinyl Art with Glowing Aura */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F3C969]/30 to-amber-500/20 blur-2xl transform scale-110"></div>
          
          <div 
            className={`relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-[#F3C969]/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center bg-black ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            {currentSong?.cover ? (
              <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover rounded-full" />
            ) : (
              <Disc size={80} className="text-[#F3C969]" />
            )}
            
            {/* Center Spindle Hole */}
            <div className="absolute w-10 h-10 sm:w-14 sm:h-14 bg-[#0b0f19] rounded-full border-2 border-[#F3C969] shadow-inner flex items-center justify-center">
              <div className="w-3 h-3 bg-[#F3C969] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Current Track Info Panel */}
        <div className="w-full max-w-lg glass-panel p-5 sm:p-6 rounded-3xl border-t border-[#F3C969]/30 shadow-2xl space-y-4 backdrop-blur-xl">
          <div>
            <h2 className="text-xl sm:text-2xl font-vintage font-bold text-[#FFF8EB] truncate text-backdrop">
              {currentSong?.title || 'Monsoon Melodies'}
            </h2>
            <p className="text-sm sm:text-base text-[#F3C969] font-medium truncate mt-1">
              {currentSong?.artist || 'Classic 90s Artist'}
            </p>
          </div>

          {/* Interactive Seek Bar */}
          <div className="space-y-1.5">
            <input 
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full player-range accent-[#F3C969]"
              aria-label="Seek track"
            />
            <div className="flex justify-between text-xs font-mono text-[#94A3B8] font-semibold px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <button 
              onClick={playPrevious}
              className="p-2 text-[#CBD5E1] hover:text-[#F3C969] hover:scale-110 active:scale-95 transition-all"
              title="Previous Track"
            >
              <SkipBack size={26} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#F3C969] to-[#FDE68A] text-[#0b0f19] flex items-center justify-center shadow-[0_0_25px_rgba(243,201,105,0.5)] hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>

            <button 
              onClick={playNext}
              className="p-2 text-[#CBD5E1] hover:text-[#F3C969] hover:scale-110 active:scale-95 transition-all"
              title="Next Track"
            >
              <SkipForward size={26} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in Queue Playlist Panel */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 w-80 sm:w-96 bottom-28 z-40 bg-[#080d1a]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10 px-2">
              <h3 className="text-lg font-vintage font-bold text-[#FFF8EB]">Radio Queue</h3>
              <span className="text-xs font-mono font-bold text-[#F3C969]">{fallbackSongs.length} Tracks</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {fallbackSongs.map((song, idx) => {
                const isSelected = currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => playSong(song, fallbackSongs)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#2d1c19] border-[#F3C969] shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-transparent'
                    }`}
                  >
                    <span className="text-xs font-mono text-[#94A3B8] w-4 text-center font-bold">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-black/60 flex-shrink-0 border border-white/10">
                      {song.cover ? <img src={song.cover} alt={song.title} className="w-full h-full object-cover" /> : <Disc size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-[#F3C969]' : 'text-[#FFF8EB]'}`}>
                        {song.title}
                      </h4>
                      <p className="text-[11px] text-[#94A3B8] truncate">{song.artist}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImmersiveRadio;
