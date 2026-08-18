import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  ChevronUp, 
  ChevronDown, 
  Radio, 
  Disc, 
  AlertCircle 
} from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

export const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const MusicPlayer = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    isShuffle,
    repeatMode,
    togglePlay,
    playNext,
    playPrevious,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    seekTo
  } = useMusicPlayer();

  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState(0);
  const [hoverSeekPos, setHoverSeekPos] = useState(0);
  const progressBarRef = useRef(null);

  if (!currentSong) return null;

  const handleSeekChange = (e) => {
    const val = parseFloat(e.target.value);
    if (duration > 0) {
      seekTo((val / 100) * duration);
    }
  };

  const handleProgressBarMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekPos(pos * 100);
    setHoverSeekTime(pos * duration);
  };

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP & TABLET STICKY PLAYER BAR                          */}
      {/* ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-2 md:px-6 md:py-3 bg-[#080d1a]/95 backdrop-blur-2xl border-t border-[#F3C969]/20 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all">
        
        {/* Subtle Top Glowing Progress Line */}
        <div 
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 via-[#F3C969] to-amber-300 shadow-[0_0_8px_#F3C969] transition-all duration-200"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
          
          {/* LEFT: Current Track Details & Cover */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial md:w-72 lg:w-80">
            {/* Spinning Vinyl / Album Art */}
            <div 
              onClick={() => setIsExpandedMobile(!isExpandedMobile)}
              className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-black/60 border border-[#F3C969]/30 shadow-lg flex-shrink-0 cursor-pointer group"
            >
              {currentSong.cover ? (
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'grayscale-[25%]'}`} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2d1c19] to-[#0b0f19] text-[#F3C969]">
                  <Disc size={24} className={isPlaying ? 'animate-spin-slow' : ''} />
                </div>
              )}

              {/* Animated Equalizer Overlay when playing */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
                  <span className="w-1 bg-[#F3C969] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
                  <span className="w-1 bg-[#F3C969] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-5"></span>
                  <span className="w-1 bg-[#F3C969] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-4"></span>
                </div>
              )}
            </div>

            {/* Title & Artist with High-Contrast Typography */}
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-[#F3C969] bg-[#F3C969]/10 px-1.5 py-0.5 rounded border border-[#F3C969]/20 hidden sm:inline-block">
                  90s
                </span>
                <h4 className="text-sm md:text-base font-bold text-[#FFF8EB] truncate tracking-tight text-backdrop">
                  {currentSong.title}
                </h4>
              </div>
              <p className="text-xs md:text-sm text-[#94A3B8] font-medium truncate mt-0.5">
                {currentSong.artist || 'Classic 90s Melodies'}
              </p>
            </div>
          </div>

          {/* CENTER: Transport Controls & Seek Bar (Desktop/Tablet) */}
          <div className="hidden md:flex flex-col items-center flex-1 max-w-xl px-4">
            
            {/* Buttons Row */}
            <div className="flex items-center gap-5 mb-1.5">
              {/* Shuffle */}
              <button 
                onClick={toggleShuffle} 
                title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                className={`p-1.5 rounded-full transition-colors ${isShuffle ? 'text-[#F3C969] bg-[#F3C969]/15' : 'text-[#94A3B8] hover:text-[#FFF8EB]'}`}
              >
                <Shuffle size={16} />
              </button>

              {/* Previous */}
              <button 
                onClick={playPrevious} 
                title="Previous Song"
                className="text-[#CBD5E1] hover:text-[#F3C969] hover:scale-110 active:scale-95 transition-all p-1"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              {/* Play / Pause Toggle with Glowing Ring */}
              <button 
                onClick={togglePlay} 
                title={isPlaying ? "Pause" : "Play"}
                className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#F3C969] to-[#FDE68A] text-[#0b0f19] flex items-center justify-center shadow-[0_0_20px_rgba(243,201,105,0.4)] hover:shadow-[0_0_25px_rgba(243,201,105,0.7)] hover:scale-105 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button 
                onClick={playNext} 
                title="Next Song"
                className="text-[#CBD5E1] hover:text-[#F3C969] hover:scale-110 active:scale-95 transition-all p-1"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              {/* Repeat */}
              <button 
                onClick={toggleRepeat} 
                title={`Repeat: ${repeatMode}`}
                className={`p-1.5 rounded-full transition-colors ${repeatMode !== 'off' ? 'text-[#F3C969] bg-[#F3C969]/15' : 'text-[#94A3B8] hover:text-[#FFF8EB]'}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
              </button>
            </div>

            {/* Seek Bar & Timers */}
            <div className="w-full flex items-center gap-3">
              <span className="text-xs font-mono text-[#94A3B8] w-10 text-right select-none font-medium">
                {formatTime(currentTime)}
              </span>

              <div 
                ref={progressBarRef}
                onMouseEnter={() => setIsHoveringSeek(true)}
                onMouseLeave={() => setIsHoveringSeek(false)}
                onMouseMove={handleProgressBarMouseMove}
                className="relative flex-1 py-1 cursor-pointer group flex items-center"
              >
                {/* Hover Preview Tooltip */}
                {isHoveringSeek && duration > 0 && (
                  <div 
                    className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 bg-[#172036] text-[#FFF8EB] border border-[#F3C969]/30 rounded text-[11px] font-mono shadow-md pointer-events-none z-30"
                    style={{ left: `${hoverSeekPos}%` }}
                  >
                    {formatTime(hoverSeekTime)}
                  </div>
                )}

                {/* Background Track */}
                <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden relative">
                  {/* Filled Progress */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-[#F3C969] rounded-full transition-all duration-150"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>

                {/* Range Input on Top */}
                <input 
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progress || 0}
                  onChange={handleSeekChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="Seek timeline"
                />
              </div>

              <span className="text-xs font-mono text-[#94A3B8] w-10 text-left select-none font-medium">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Volume & Extras */}
          <div className="hidden lg:flex items-center justify-end gap-3 w-72">
            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-[#111728]/80 px-3 py-1.5 rounded-full border border-white/10">
              <button 
                onClick={toggleMute} 
                title={isMuted ? "Unmute" : "Mute"}
                className="text-[#CBD5E1] hover:text-[#F3C969] transition-colors p-1"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-[#F87171]" />
                ) : volume < 0.5 ? (
                  <Volume1 size={18} />
                ) : (
                  <Volume2 size={18} />
                )}
              </button>

              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-20 player-range accent-[#F3C969]"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* MOBILE RIGHT CONTROLS (Play/Pause + Expand) */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <button 
              onClick={playPrevious}
              className="p-2 text-[#CBD5E1] hover:text-[#F3C969] transition-colors"
              title="Previous"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay} 
              className="w-10 h-10 rounded-full bg-[#F3C969] text-[#0b0f19] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>

            <button 
              onClick={playNext}
              className="p-2 text-[#CBD5E1] hover:text-[#F3C969] transition-colors"
              title="Next"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button 
              onClick={() => setIsExpandedMobile(!isExpandedMobile)}
              className="p-2 text-[#94A3B8] hover:text-[#FFF8EB] transition-colors"
              title="Expand player"
            >
              {isExpandedMobile ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </button>
          </div>
        </div>

        {/* Error notification if audio fails */}
        {error && (
          <div className="max-w-md mx-auto mt-1 flex items-center justify-center gap-1.5 text-xs text-[#F87171] font-medium">
            <AlertCircle size={12} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* EXPANDED MOBILE PLAYER DRAWER                                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isExpandedMobile && (
          <motion.div 
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 md:hidden bg-[#0b0f19]/98 backdrop-blur-3xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            {/* Header / Close button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#F3C969]">
                <Radio size={18} />
                <span className="text-xs font-mono uppercase tracking-widest font-semibold">Now Playing</span>
              </div>
              <button 
                onClick={() => setIsExpandedMobile(false)}
                className="p-2 rounded-full bg-white/10 text-[#FFF8EB] hover:bg-white/20 transition-colors"
              >
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Main Cover Art */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className={`relative w-64 h-64 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-[#F3C969]/30 bg-black ${isPlaying ? 'scale-100' : 'scale-95'} transition-transform duration-500`}>
                {currentSong.cover ? (
                  <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2d1c19] to-[#0b0f19] text-[#F3C969]">
                    <Disc size={80} />
                  </div>
                )}
              </div>

              {/* Title & Artist */}
              <div className="text-center mt-6 px-4">
                <h2 className="text-2xl font-vintage font-bold text-[#FFF8EB] tracking-wide text-backdrop line-clamp-2">
                  {currentSong.title}
                </h2>
                <p className="text-base text-[#F3C969] font-medium mt-1">
                  {currentSong.artist || 'Classic 90s Melodies'}
                </p>
                <span className="inline-block text-xs text-[#94A3B8] font-mono mt-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {currentSong.year || '90s'} • {currentSong.mood || 'Nostalgia'}
                </span>
              </div>
            </div>

            {/* Timeline & Controls */}
            <div className="w-full space-y-6">
              {/* Progress Slider */}
              <div className="w-full space-y-2">
                <div className="relative flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    value={progress || 0} 
                    onChange={handleSeekChange}
                    className="w-full player-range accent-[#F3C969]"
                    aria-label="Seek track position"
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-[#94A3B8] font-medium px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Transport Buttons */}
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={toggleShuffle} 
                  className={`p-3 rounded-full ${isShuffle ? 'text-[#F3C969] bg-[#F3C969]/15' : 'text-[#94A3B8]'}`}
                >
                  <Shuffle size={20} />
                </button>

                <button 
                  onClick={playPrevious} 
                  className="p-3 text-[#CBD5E1] active:scale-90 transition-transform"
                >
                  <SkipBack size={28} fill="currentColor" />
                </button>

                <button 
                  onClick={togglePlay} 
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#F3C969] to-[#FDE68A] text-[#0b0f19] flex items-center justify-center shadow-[0_0_30px_rgba(243,201,105,0.6)] active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={28} fill="currentColor" />
                  ) : (
                    <Play size={28} fill="currentColor" className="ml-1" />
                  )}
                </button>

                <button 
                  onClick={playNext} 
                  className="p-3 text-[#CBD5E1] active:scale-90 transition-transform"
                >
                  <SkipForward size={28} fill="currentColor" />
                </button>

                <button 
                  onClick={toggleRepeat} 
                  className={`p-3 rounded-full ${repeatMode !== 'off' ? 'text-[#F3C969] bg-[#F3C969]/15' : 'text-[#94A3B8]'}`}
                >
                  {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
                </button>
              </div>

              {/* Volume Slider in mobile drawer */}
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <button onClick={toggleMute} className="text-[#CBD5E1]">
                  {isMuted || volume === 0 ? <VolumeX size={20} className="text-[#F87171]" /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-full player-range accent-[#F3C969]"
                  aria-label="Volume slider"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;
