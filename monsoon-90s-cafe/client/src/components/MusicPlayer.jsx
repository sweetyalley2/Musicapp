import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, AlertCircle } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    volume, 
    error,
    togglePlay, 
    playNext, 
    playPrevious, 
    changeVolume,
    closePlayer,
    seekTo,
    duration
  } = useMusicPlayer();

  const handleSeek = (e) => {
    const newProgress = parseFloat(e.target.value);
    if (duration) {
      const time = (newProgress / 100) * duration;
      seekTo(time);
    }
  };

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 bg-cafe-900/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border-t border-white/10"
      >
        {/* Cover Art & Info */}
        <div className="flex items-center gap-4 w-full md:w-1/3">
          <div className="w-12 h-12 rounded-lg bg-navy-800 flex items-center justify-center overflow-hidden border border-white/20">
            {currentSong.cover ? (
              <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-cafe-900 to-navy-900 flex items-center justify-center text-gold opacity-50">
                🎵
              </div>
            )}
          </div>
          <div className="flex-col flex-1 overflow-hidden">
            <h4 className="text-sm font-bold text-cream truncate">{currentSong.title}</h4>
            <p className="text-xs text-monsoon truncate">{currentSong.artist}</p>
          </div>
          <button onClick={closePlayer} className="md:hidden text-monsoon hover:text-gold">
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-full md:w-1/3 gap-2">
          <div className="flex items-center gap-6">
            <button onClick={playPrevious} className="text-monsoon hover:text-gold transition-colors">
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-10 h-10 rounded-full bg-gold/20 hover:bg-gold/40 border border-gold/50 flex items-center justify-center text-gold transition-all"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={playNext} className="text-monsoon hover:text-gold transition-colors">
              <SkipForward size={20} fill="currentColor" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full flex items-center gap-2 group relative">
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="0.1" 
              value={progress || 0} 
              onChange={handleSeek}
              className="w-full h-1.5 bg-navy-900/50 rounded-full appearance-none cursor-pointer outline-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-navy-900/50"
              style={{
                background: `linear-gradient(to right, #D4AF37 ${progress}%, rgba(13, 27, 42, 0.5) ${progress}%)`
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-[10px] text-neonred flex items-center gap-1">
              <AlertCircle size={10} />
              {error}
            </div>
          )}
        </div>

        {/* Volume & Close */}
        <div className="hidden md:flex items-center justify-end w-1/3 gap-4">
          <Volume2 size={16} className="text-monsoon" />
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => changeVolume(parseFloat(e.target.value))}
            className="w-20 accent-gold"
          />
          <button onClick={closePlayer} className="text-monsoon hover:text-gold ml-4">
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MusicPlayer;
