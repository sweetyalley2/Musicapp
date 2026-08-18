import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Disc } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const AestheticPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    togglePlay, 
    playNext, 
    playPrevious,
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
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="absolute bottom-10 left-10 md:left-20 flex flex-col md:flex-row items-center md:items-end gap-8 z-50 w-full max-w-lg pointer-events-auto"
    >
      {/* Spinning Disk Cover */}
      <div 
        className={`w-32 h-32 md:w-48 md:h-48 rounded-full border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center bg-black/50 backdrop-blur-sm ${isPlaying ? 'animate-spin-slow' : ''}`}
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
        {currentSong.cover ? (
          <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover rounded-full" />
        ) : (
          <Disc size={64} className="text-white/20" />
        )}
        {/* Inner Record Hole */}
        <div className="absolute w-8 h-8 md:w-12 md:h-12 bg-navy-900 rounded-full border border-white/10"></div>
      </div>

      {/* Track Details & Controls */}
      <div className="flex flex-col gap-4 w-full md:w-auto">
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold text-white drop-shadow-md truncate max-w-xs">{currentSong.title}</h2>
          <p className="text-sm md:text-md text-white/70 drop-shadow-sm">{currentSong.artist || 'Unknown Artist'}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full md:w-64 flex flex-col gap-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1" 
            value={progress || 0} 
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer outline-none overflow-hidden [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-runnable-track]:h-full [&::-webkit-slider-runnable-track]:bg-transparent backdrop-blur-md transition-all duration-300"
            style={{
              background: `linear-gradient(to right, #FFFFFF ${progress}%, rgba(255, 255, 255, 0.2) ${progress}%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center md:justify-start gap-6 mt-2">
          <button 
            onClick={playPrevious} 
            className="text-white/70 hover:text-white transition-colors focus:outline-none"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay} 
            className="text-white hover:scale-110 transition-transform focus:outline-none"
          >
            {isPlaying ? (
              <Pause size={36} fill="currentColor" />
            ) : (
              <Play size={36} fill="currentColor" className="ml-1" />
            )}
          </button>

          <button 
            onClick={playNext} 
            className="text-white/70 hover:text-white transition-colors focus:outline-none"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AestheticPlayer;
