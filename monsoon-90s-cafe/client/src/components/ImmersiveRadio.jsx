import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkipForward, SkipBack, Play, Pause, Disc, ListMusic, Radio, Volume2 } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists, fallbackSongs } from '../data/fallbackSongs';
import { formatTime } from './MusicPlayer';
import RainCanvas from './RainCanvas';

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
    togglePlay, 
    playNext, 
    playPrevious, 
    playSong,
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
    setIsOnline(Math.floor(Math.random() * 25) + 38);
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
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center overflow-hidden text-[#f4eee2] pt-20 pb-36 px-4 bg-[#060911]">
      
      {/* Background Image with Cinematic Depth */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src="/bg-kolkata-rain.jpg" 
          alt="Rainy Day Ambience"
          className="w-full h-full object-cover opacity-35 filter brightness-[0.6] contrast-110 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060911]/90 via-[#060911]/70 to-[#060911]/95"></div>
      </div>

      <RainCanvas intensity="medium" />

      {/* Top Floating Status Indicators */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 bg-[#0e1422]/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399] animate-pulse"></div>
          <span className="text-[11px] font-mono text-[#8492a6] font-medium">
            <strong className="text-[#f4eee2]">{isOnline}</strong> listeners tuned in
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-mono text-[#e2a450] bg-[#0e1422]/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 shadow-lg font-bold">
            {clockTime}
          </span>
          
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider backdrop-blur-xl border transition-all shadow-lg ${
              showPlaylist ? 'bg-[#e2a450] text-[#060911] border-[#e2a450]' : 'bg-[#0e1422]/90 text-[#8492a6] hover:text-[#f4eee2] border-white/10'
            }`}
          >
            <ListMusic size={14} />
            <span>Queue</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Audio Listening Deck */}
      <div className="relative z-20 w-full max-w-2xl flex flex-col items-center text-center my-auto py-2">
        
        <div className="inline-flex items-center gap-2 bg-[#141c2e] text-[#e2a450] px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-semibold uppercase tracking-wider mb-3 shadow-sm">
          <Radio size={13} />
          <span>Akashvani Kolkata 98.3 FM Live</span>
        </div>

        {/* Realistic Vinyl Turntable Disc */}
        <div className="relative my-4 group">
          <div className="absolute inset-0 rounded-full bg-[#e2a450]/10 blur-2xl transform scale-110"></div>
          
          <div 
            className={`relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-[#1e293b] shadow-[0_16px_40px_rgba(0,0,0,0.9)] overflow-hidden flex items-center justify-center bg-[#0a0e17] ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            {/* Concentric Vinyl Grooves */}
            <div className="absolute inset-2 rounded-full border border-white/[0.04]"></div>
            <div className="absolute inset-6 rounded-full border border-white/[0.04]"></div>
            <div className="absolute inset-10 rounded-full border border-white/[0.04]"></div>
            
            {currentSong?.cover ? (
              <img src={currentSong.cover} alt={currentSong.title} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-full border-2 border-white/15" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#141c2e] border-2 border-white/15 flex items-center justify-center text-[#e2a450]">
                <Disc size={36} />
              </div>
            )}
            
            {/* Center Spindle Ring */}
            <div className="absolute w-6 h-6 bg-[#060911] rounded-full border-2 border-[#e2a450] shadow-inner flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#e2a450] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Current Track Console */}
        <div className="w-full max-w-md craft-panel p-5 rounded-2xl border border-white/10 shadow-2xl space-y-3 mt-2">
          <div>
            <h2 className="text-lg sm:text-xl font-vintage font-bold text-[#f4eee2] truncate tracking-tight">
              {currentSong?.title || 'Monsoon Melodies'}
            </h2>
            <p className="text-xs text-[#e2a450] font-medium truncate mt-0.5">
              {currentSong?.artist || 'Classic Melody'}
            </p>
          </div>

          {/* Seek Bar */}
          <div className="space-y-1">
            <input 
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress || 0}
              onChange={handleSeek}
              className="w-full player-range accent-[#e2a450]"
              aria-label="Seek track position"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#8492a6] px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center justify-center gap-5 pt-1">
            <button 
              onClick={playPrevious}
              className="p-1.5 text-[#8492a6] hover:text-[#e2a450] hover:scale-105 active:scale-95 transition-all"
              title="Previous Track"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#e2a450] text-[#060911] flex items-center justify-center shadow-lg hover:bg-[#f5c26b] hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
            </button>

            <button 
              onClick={playNext}
              className="p-1.5 text-[#8492a6] hover:text-[#e2a450] hover:scale-105 active:scale-95 transition-all"
              title="Next Track"
            >
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      {/* Queue Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="fixed top-20 right-4 sm:right-8 w-80 sm:w-88 bottom-28 z-40 craft-panel border border-white/10 rounded-2xl p-4 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.08] px-1">
              <h3 className="text-base font-vintage font-bold text-[#f4eee2]">Broadcast Queue</h3>
              <span className="text-[10px] font-mono text-[#e2a450]">{fallbackSongs.length} Tracks</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
              {fallbackSongs.map((song, idx) => {
                const isSelected = currentSong?.id === song.id;

                return (
                  <div
                    key={song.id}
                    onClick={() => playSong(song, fallbackSongs)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#182030] border-[#e2a450] shadow-sm'
                        : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-[#8492a6] w-4 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#060911] flex-shrink-0 border border-white/10">
                      {song.cover ? <img src={song.cover} alt={song.title} className="w-full h-full object-cover" /> : <Disc size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-[#e2a450]' : 'text-[#f4eee2]'}`}>
                        {song.title}
                      </h4>
                      <p className="text-[10px] text-[#8492a6] truncate">{song.artist}</p>
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
