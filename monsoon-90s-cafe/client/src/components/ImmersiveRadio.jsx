import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Flame, SkipForward, SkipBack, Play, Pause, Disc, ListMusic } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackPlaylists, fallbackSongs } from '../data/fallbackSongs';

const ImmersiveRadio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isOnline, setIsOnline] = useState(0);
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
    playSong
  } = useMusicPlayer();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60) || 0;
    const s = Math.floor(secs % 60) || 0;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setClockTime(`${hours}:${minutes} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsOnline(Math.floor(Math.random() * 50) + 10);
    // Start playing the aesthetic radio playlist automatically
    const playlist = fallbackPlaylists[0];
    const songs = fallbackSongs.filter(s => playlist.songs.includes(s.id));
    if (songs.length > 0 && !currentSong) {
      playSong(songs[0], songs);
    }
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-ui h-screen w-screen overflow-hidden text-cream relative">
      {/* Background Layers */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/bg-kolkata-howrah.jpg" 
          alt="Kolkata Howrah Bridge Rainy Days"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Top Left Clock */}
      <div className="absolute top-6 left-6 md:left-10 z-50">
        <span className="text-white/80 font-mono text-lg md:text-xl font-medium tracking-wider drop-shadow-md">{clockTime}</span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 md:right-10 z-50 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-black/30 p-2 px-3 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/50 transition-colors shadow-lg">
          <button onClick={() => setIsMuted(!isMuted)} className="hover:opacity-100 focus:outline-none transition-all text-white/80 hover:text-white">
            {isMuted || volume == 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-20 md:w-28 h-1.5 bg-white/20 rounded-full appearance-none outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full shadow-inner"
          />
        </div>
        
        <button onClick={() => setShowPlaylist(!showPlaylist)} className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all text-white/70 hover:text-white shadow-lg">
          <ListMusic size={18} />
        </button>

        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 hover:bg-black/60 transition-all group relative shadow-lg">
          <span className="absolute flex h-2.5 w-2.5 top-0 right-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          </span>
          <Flame size={18} className="text-white/70 group-hover:text-white" />
        </button>
      </div>

      {/* Center Top Title */}
      <div className="absolute top-[12%] flex flex-col items-center z-10 w-full px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="bg-white/10 px-5 py-2 rounded-full text-xs md:text-sm mb-8 border border-white/20 backdrop-blur-md flex items-center gap-2 text-white/90 shadow-lg"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
          {isOnline} people online
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-6xl md:text-8xl font-vintage text-white tracking-widest text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          KOLKATA
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-white/60 tracking-[0.3em] uppercase text-xs md:text-sm mt-4 font-bold"
        >
          Rainy Days
        </motion.p>
      </div>

      {/* Playlist Panel */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div 
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            className="absolute top-24 right-6 md:right-10 w-80 md:w-[26rem] bottom-32 md:bottom-44 z-40 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-white font-bold text-xl drop-shadow-md">Up Next</h3>
              <span className="text-white/50 text-xs font-semibold uppercase tracking-wider">{fallbackSongs.length} Songs</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {fallbackSongs.map((song, idx) => (
                <div 
                  key={song.id} 
                  onClick={() => playSong(song, fallbackSongs)}
                  className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all ${currentSong?.id === song.id ? 'bg-white/20 border border-white/10 shadow-lg' : 'hover:bg-white/10 border border-transparent'}`}
                >
                  <div className="text-white/30 text-xs font-mono w-4 text-center">{idx + 1}</div>
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/50 shrink-0 border border-white/10 shadow-inner">
                     {song.cover ? <img src={song.cover} className="w-full h-full object-cover" /> : <Disc />}
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className={`text-sm md:text-base font-semibold truncate ${currentSong?.id === song.id ? 'text-white' : 'text-white/80'}`}>{song.title}</span>
                    <span className="text-xs md:text-sm text-white/50 truncate mt-0.5">{song.artist}</span>
                  </div>
                  {currentSong?.id === song.id && isPlaying && (
                    <div className="ml-auto w-5 h-5 flex items-end justify-between gap-[2px]">
                      <motion.div animate={{ height: ["30%", "100%", "40%"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[3px] bg-white rounded-t-sm h-full"></motion.div>
                      <motion.div animate={{ height: ["60%", "30%", "100%"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-[3px] bg-white rounded-t-sm h-full"></motion.div>
                      <motion.div animate={{ height: ["100%", "60%", "30%"] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-[3px] bg-white rounded-t-sm h-full"></motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Player */}
      {currentSong && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 flex items-center bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-3 md:p-4 pr-8 md:pr-12 shadow-2xl"
        >
          {/* Circular Cover */}
          <div 
            className={`w-20 h-20 md:w-32 md:h-32 rounded-full border border-white/20 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-center bg-black shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          >
            {currentSong.cover ? (
              <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover rounded-full" />
            ) : (
              <Disc size={48} className="text-white/20" />
            )}
            {/* Inner Record Hole */}
            <div className="absolute w-5 h-5 md:w-8 md:h-8 bg-black rounded-full border border-white/10 shadow-inner"></div>
          </div>

          {/* Track Details & Progress */}
          <div className="flex flex-col flex-1 ml-5 md:ml-8 mr-6 md:mr-10 overflow-hidden">
            <h2 className="text-xl md:text-3xl font-bold text-white truncate drop-shadow-md">{currentSong.title}</h2>
            <p className="text-sm md:text-lg text-white/60 truncate mt-1">{currentSong.artist || 'Unknown Artist'}</p>
            
            {/* Progress Row */}
            <div className="flex items-center gap-4 mt-3 w-full">
              <span className="text-xs md:text-sm text-white/40 font-mono shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <div className="flex-1 h-1.5 md:h-2 bg-white/20 rounded-full overflow-hidden relative cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 ease-linear shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-5 md:gap-8 shrink-0">
             <button 
                onClick={playPrevious} 
                className="text-white/60 hover:text-white transition-colors focus:outline-none"
              >
                <SkipBack size={24} className="md:w-8 md:h-8" fill="currentColor" />
              </button>
              
              <button 
                onClick={togglePlay} 
                className="text-black bg-white hover:scale-105 transition-transform focus:outline-none w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? (
                  <Pause size={28} className="md:w-10 md:h-10" fill="currentColor" />
                ) : (
                  <Play size={28} className="md:w-10 md:h-10 ml-1 md:ml-2" fill="currentColor" />
                )}
              </button>

              <button 
                onClick={playNext} 
                className="text-white/60 hover:text-white transition-colors focus:outline-none"
              >
                <SkipForward size={24} className="md:w-8 md:h-8" fill="currentColor" />
              </button>
          </div>
        </motion.div>
      )}
      
      {/* Bottom Right Attribution */}
      <div className="absolute bottom-6 right-8 z-50 hidden md:block">
        <a href="#" className="text-xs text-white/40 hover:text-white transition-colors font-medium tracking-wide">
          created by Monsoon 90s Cafe
        </a>
      </div>
    </div>
  );
};

export default ImmersiveRadio;
