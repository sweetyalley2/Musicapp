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
  Disc 
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
      {/* DESKTOP & TABLET STICKY PLAYER DECK                          */}
      {/* ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-2 md:px-6 md:py-3 bg-[#060911]/95 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-10px_35px_rgba(0,0,0,0.85)] transition-all">
        
        {/* Subtle Top Glowing Progress Indicator */}
        <div 
          className="absolute top-0 left-0 h-[2px] bg-[#e2a450] shadow-[0_0_8px_#e2a450] transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-6">
          
          {/* LEFT: Current Track Details & Spinning Disc */}
          <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1 md:flex-initial md:w-72 lg:w-80">
            {/* Spinning Grooved Disc / Album Art */}
            <div 
              onClick={() => setIsExpandedMobile(!isExpandedMobile)}
              className="relative w-11 h-11 md:w-13 md:h-13 rounded-xl overflow-hidden bg-[#090d16] border border-white/10 shadow-md flex-shrink-0 cursor-pointer group"
            >
              {currentSong.cover ? (
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'grayscale-[30%]'}`} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#141c2e] text-[#e2a450]">
                  <Disc size={22} className={isPlaying ? 'animate-spin-slow' : ''} />
                </div>
              )}

              {/* Dynamic Equalizer Bar Overlay */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center gap-[2px]">
                  <span className="w-[2px] bg-[#e2a450] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3"></span>
                  <span className="w-[2px] bg-[#e2a450] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s] h-5"></span>
                  <span className="w-[2px] bg-[#e2a450] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.4s] h-3.5"></span>
                </div>
              )}
            </div>

            {/* Title & Artist */}
            <div className="flex flex-col min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#f4eee2] truncate tracking-tight">
                  {currentSong.title}
                </h4>
              </div>
              <p className="text-[11px] text-[#8492a6] font-normal truncate mt-0.5">
                {currentSong.artist || 'Classic Melodies'}
              </p>
            </div>
          </div>

          {/* CENTER: Transport Controls & Seek Timeline */}
          <div className="hidden md:flex flex-col items-center flex-1 max-w-xl px-4">
            
            {/* Buttons Row */}
            <div className="flex items-center gap-4 mb-1">
              {/* Shuffle */}
              <button 
                onClick={toggleShuffle} 
                title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                className={`p-1.5 rounded-full transition-colors ${isShuffle ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6] hover:text-[#f4eee2]'}`}
              >
                <Shuffle size={14} />
              </button>

              {/* Previous */}
              <button 
                onClick={playPrevious} 
                title="Previous Song"
                className="text-[#8492a6] hover:text-[#e2a450] hover:scale-105 active:scale-95 transition-all p-1"
              >
                <SkipBack size={18} fill="currentColor" />
              </button>

              {/* Play / Pause Toggle Button */}
              <button 
                onClick={togglePlay} 
                title={isPlaying ? "Pause" : "Play"}
                className="w-10 h-10 rounded-full bg-[#e2a450] hover:bg-[#f5c26b] text-[#060911] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all font-bold"
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button 
                onClick={playNext} 
                title="Next Song"
                className="text-[#8492a6] hover:text-[#e2a450] hover:scale-105 active:scale-95 transition-all p-1"
              >
                <SkipForward size={18} fill="currentColor" />
              </button>

              {/* Repeat */}
              <button 
                onClick={toggleRepeat} 
                title={`Repeat: ${repeatMode}`}
                className={`p-1.5 rounded-full transition-colors ${repeatMode !== 'off' ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6] hover:text-[#f4eee2]'}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={14} /> : <Repeat size={14} />}
              </button>
            </div>

            {/* Seek Bar & Timers */}
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono text-[#8492a6] w-9 text-right select-none">
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
                    className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 bg-[#141c2e] text-[#f4eee2] border border-white/10 rounded text-[10px] font-mono shadow-md pointer-events-none z-30"
                    style={{ left: `${hoverSeekPos}%` }}
                  >
                    {formatTime(hoverSeekTime)}
                  </div>
                )}

                {/* Track Bar Background */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
                  {/* Filled Progress */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-[#e2a450] rounded-full transition-all duration-150"
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

              <span className="text-[10px] font-mono text-[#8492a6] w-9 text-left select-none">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Volume Deck */}
          <div className="hidden lg:flex items-center justify-end gap-3 w-72">
            <div className="flex items-center gap-2 bg-[#0e1422] px-3 py-1 rounded-full border border-white/[0.08]">
              <button 
                onClick={toggleMute} 
                title={isMuted ? "Unmute" : "Mute"}
                className="text-[#8492a6] hover:text-[#e2a450] transition-colors p-0.5"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={15} className="text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 size={15} />
                ) : (
                  <Volume2 size={15} />
                )}
              </button>

              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="w-18 player-range accent-[#e2a450]"
                aria-label="Volume slider"
              />
            </div>
          </div>

          {/* MOBILE RIGHT CONTROLS */}
          <div className="flex md:hidden items-center gap-1 flex-shrink-0">
            <button 
              onClick={playPrevious}
              className="p-1.5 text-[#8492a6] hover:text-[#f4eee2] transition-colors"
              title="Previous"
            >
              <SkipBack size={16} fill="currentColor" />
            </button>

            <button 
              onClick={togglePlay} 
              className="w-9 h-9 rounded-full bg-[#e2a450] text-[#060911] flex items-center justify-center shadow-md active:scale-95 transition-transform"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>

            <button 
              onClick={playNext} 
              className="p-1.5 text-[#8492a6] hover:text-[#f4eee2] transition-colors"
              title="Next"
            >
              <SkipForward size={16} fill="currentColor" />
            </button>

            <button 
              onClick={() => setIsExpandedMobile(!isExpandedMobile)}
              className="p-1.5 text-[#8492a6] hover:text-[#f4eee2] transition-colors"
              title="Expand player"
            >
              {isExpandedMobile ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>
          </div>
        </div>
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
            className="fixed inset-0 z-50 md:hidden bg-[#060911]/98 backdrop-blur-3xl p-6 flex flex-col justify-between overflow-y-auto"
          >
            {/* Header / Close button */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-[#e2a450]">
                <Radio size={16} />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">Now Playing</span>
              </div>
              <button 
                onClick={() => setIsExpandedMobile(false)}
                className="p-2 rounded-full bg-white/10 text-[#f4eee2] hover:bg-white/20 transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Main Cover Art */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className={`relative w-60 h-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black ${isPlaying ? 'scale-100' : 'scale-95'} transition-transform duration-500`}>
                {currentSong.cover ? (
                  <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#141c2e] text-[#e2a450]">
                    <Disc size={70} />
                  </div>
                )}
              </div>

              {/* Title & Artist */}
              <div className="text-center mt-5 px-4">
                <h2 className="text-xl font-vintage font-bold text-[#f4eee2] tracking-tight line-clamp-2">
                  {currentSong.title}
                </h2>
                <p className="text-sm text-[#e2a450] font-medium mt-1">
                  {currentSong.artist || 'Classic Melodies'}
                </p>
                <span className="inline-block text-[10px] text-[#8492a6] font-mono mt-2 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {currentSong.year || '90s'} • {currentSong.mood || 'Monsoon Nostalgia'}
                </span>
              </div>
            </div>

            {/* Timeline & Controls */}
            <div className="w-full space-y-5">
              {/* Progress Slider */}
              <div className="w-full space-y-1.5">
                <div className="relative flex items-center">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    value={progress || 0} 
                    onChange={handleSeekChange}
                    className="w-full player-range accent-[#e2a450]"
                    aria-label="Seek track position"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-[#8492a6] px-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Transport Buttons */}
              <div className="flex items-center justify-center gap-5">
                <button 
                  onClick={toggleShuffle} 
                  className={`p-2.5 rounded-full ${isShuffle ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6]'}`}
                >
                  <Shuffle size={18} />
                </button>

                <button 
                  onClick={playPrevious} 
                  className="p-2.5 text-[#8492a6] active:scale-90 transition-transform"
                >
                  <SkipBack size={24} fill="currentColor" />
                </button>

                <button 
                  onClick={togglePlay} 
                  className="w-14 h-14 rounded-full bg-[#e2a450] text-[#060911] flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  {isPlaying ? (
                    <Pause size={24} fill="currentColor" />
                  ) : (
                    <Play size={24} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                <button 
                  onClick={playNext} 
                  className="p-2.5 text-[#8492a6] active:scale-90 transition-transform"
                >
                  <SkipForward size={24} fill="currentColor" />
                </button>

                <button 
                  onClick={toggleRepeat} 
                  className={`p-2.5 rounded-full ${repeatMode !== 'off' ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6]'}`}
                >
                  {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 bg-white/5 p-2.5 rounded-xl border border-white/10">
                <button onClick={toggleMute} className="text-[#8492a6]">
                  {isMuted || volume === 0 ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="w-full player-range accent-[#e2a450]"
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
