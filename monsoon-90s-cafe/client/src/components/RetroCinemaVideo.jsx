import { useState, useEffect, useRef } from 'react';
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
  Maximize2, 
  Minimize2, 
  X, 
  Tv, 
  CloudRain
} from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { formatTime } from './MusicPlayer';
import InteractiveRainGlass from './InteractiveRainGlass';

const RetroCinemaVideo = ({ children }) => {
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
    isVideoOpen,
    isFullscreen,
    togglePlay,
    playNext,
    playPrevious,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    seekTo,
    closeVideoMode,
    toggleFullscreen
  } = useMusicPlayer();

  const [showControls, setShowControls] = useState(true);
  const [crtEffect, setCrtEffect] = useState(true);
  const [rainOverlay, setRainOverlay] = useState(true);
  const [isHoveringSeek, setIsHoveringSeek] = useState(false);
  const [hoverSeekTime, setHoverSeekTime] = useState(0);
  const [hoverSeekPos, setHoverSeekPos] = useState(0);
  const hideTimeoutRef = useRef(null);
  const progressBarRef = useRef(null);

  // Auto-hide controls when idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3500);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

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

  if (!isVideoOpen || !currentSong) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-[9998] bg-[#030509]/95 backdrop-blur-2xl flex flex-col justify-between select-none overflow-hidden"
    >
      {/* Rain Droplets Overlay on Screen */}
      {rainOverlay && (
        <div className="absolute inset-0 pointer-events-none z-[10000] opacity-70">
          <InteractiveRainGlass intensity="light" />
        </div>
      )}

      {/* CRT Scanline & Phosphor Glow Layer */}
      {crtEffect && (
        <div className="absolute inset-0 pointer-events-none z-[10000] crt-scanlines opacity-35 mix-blend-overlay"></div>
      )}

      {/* Ambient Backlight Glow Matching Song Mood */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-30 blur-[140px]">
        <div className="w-[60vw] h-[60vh] bg-gradient-to-tr from-[#e2a450]/40 via-indigo-600/30 to-amber-500/20 rounded-full animate-pulse"></div>
      </div>

      {/* ============================================================ */}
      {/* TOP HEADER CONTROLS (Fades on Idle)                          */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showControls && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative z-[10001] w-full px-4 py-3 sm:px-8 sm:py-4 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent backdrop-blur-md"
          >
            {/* Left: TV Channel Badge & Song Info */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 bg-[#141c2e]/90 text-[#e2a450] px-3 py-1 rounded-full border border-white/15 text-[10px] sm:text-xs font-mono font-bold tracking-wider shadow-lg flex-shrink-0">
                <Tv size={14} className="animate-pulse text-[#e2a450]" />
                <span className="hidden sm:inline">CH 03 • MTV NOSTALGIA 90s</span>
                <span className="sm:hidden">90s TV</span>
              </div>

              <div className="min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-vintage font-bold text-[#f4eee2] truncate tracking-tight">
                  {currentSong.title}
                </h1>
                <p className="text-[10px] sm:text-xs text-[#8492a6] truncate">
                  {currentSong.artist || 'Classic Melodies'} {currentSong.year ? `• ${currentSong.year}` : ''}
                </p>
              </div>
            </div>

            {/* Right: Quick Overlay Toggles & Close */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Toggle CRT Filter */}
              <button
                onClick={() => setCrtEffect(!crtEffect)}
                title={crtEffect ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
                className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                  crtEffect
                    ? 'bg-[#e2a450]/20 text-[#e2a450] border-[#e2a450]/50 shadow-md'
                    : 'bg-white/5 text-[#8492a6] border-white/10 hover:text-[#f4eee2]'
                }`}
              >
                <Tv size={14} />
                <span className="hidden md:inline text-[11px]">CRT FX</span>
              </button>

              {/* Toggle Rain Overlay */}
              <button
                onClick={() => setRainOverlay(!rainOverlay)}
                title={rainOverlay ? "Disable Rain Glass Overlay" : "Enable Rain Glass Overlay"}
                className={`p-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
                  rainOverlay
                    ? 'bg-[#e2a450]/20 text-[#e2a450] border-[#e2a450]/50 shadow-md'
                    : 'bg-white/5 text-[#8492a6] border-white/10 hover:text-[#f4eee2]'
                }`}
              >
                <CloudRain size={14} />
                <span className="hidden md:inline text-[11px]">Rain Glass</span>
              </button>

              {/* Native Fullscreen API Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Browser Fullscreen (F)" : "Enter Browser Fullscreen (F)"}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-[#f4eee2] border border-white/10 transition-colors"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Close Cinema Video Button */}
              <button
                onClick={closeVideoMode}
                title="Switch back to Audio-Only Mode (Esc)"
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <X size={16} />
                <span className="hidden sm:inline text-xs font-mono font-semibold">Exit Video</span>
              </button>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Spacer for center video area */}
      <div className="flex-1 min-h-0 pointer-events-none"></div>

      {/* ============================================================ */}
      {/* BOTTOM FLOATING CINEMA CONTROLS BAR (Fades on Idle)          */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showControls && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-[10001] w-full px-4 py-3 sm:px-8 sm:py-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent backdrop-blur-md"
          >
            <div className="max-w-4xl mx-auto space-y-3">
              
              {/* Timeline Seek Bar */}
              <div className="w-full flex items-center gap-3">
                <span className="text-xs font-mono text-[#8492a6] w-10 text-right select-none font-medium">
                  {formatTime(currentTime)}
                </span>

                <div
                  ref={progressBarRef}
                  onMouseEnter={() => setIsHoveringSeek(true)}
                  onMouseLeave={() => setIsHoveringSeek(false)}
                  onMouseMove={handleProgressBarMouseMove}
                  className="relative flex-1 py-2 cursor-pointer group flex items-center"
                >
                  {/* Hover Seek Preview Tooltip */}
                  {isHoveringSeek && duration > 0 && (
                    <div
                      className="absolute -top-7 transform -translate-x-1/2 px-2 py-0.5 bg-[#141c2e] text-[#f4eee2] border border-white/15 rounded text-[11px] font-mono shadow-xl pointer-events-none z-30"
                      style={{ left: `${hoverSeekPos}%` }}
                    >
                      {formatTime(hoverSeekTime)}
                    </div>
                  )}

                  {/* Track Bar */}
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover:h-2 transition-all">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#e2a450] to-[#f5c26b] rounded-full transition-all duration-150 shadow-[0_0_10px_#e2a450]"
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress || 0}
                    onChange={handleSeekChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Seek video timeline"
                  />
                </div>

                <span className="text-xs font-mono text-[#8492a6] w-10 text-left select-none font-medium">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Transport Buttons & Volume Row */}
              <div className="flex items-center justify-between gap-4">
                
                {/* Left: Shuffle & Repeat */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleShuffle}
                    title={isShuffle ? "Shuffle On" : "Shuffle Off"}
                    className={`p-2 rounded-xl transition-colors ${
                      isShuffle ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6] hover:text-[#f4eee2] bg-white/5'
                    }`}
                  >
                    <Shuffle size={16} />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    title={`Repeat: ${repeatMode}`}
                    className={`p-2 rounded-xl transition-colors ${
                      repeatMode !== 'off' ? 'text-[#e2a450] bg-[#e2a450]/15' : 'text-[#8492a6] hover:text-[#f4eee2] bg-white/5'
                    }`}
                  >
                    {repeatMode === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
                  </button>
                </div>

                {/* Center: Main Playback Controls */}
                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={playPrevious}
                    title="Previous Song"
                    className="text-[#8492a6] hover:text-[#e2a450] hover:scale-110 active:scale-95 transition-all p-1"
                  >
                    <SkipBack size={22} fill="currentColor" />
                  </button>

                  <button
                    onClick={togglePlay}
                    title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e2a450] hover:bg-[#f5c26b] text-[#060911] flex items-center justify-center shadow-[0_0_25px_rgba(226,164,80,0.5)] hover:scale-105 active:scale-95 transition-all font-bold"
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-1" />
                    )}
                  </button>

                  <button
                    onClick={playNext}
                    title="Next Song"
                    className="text-[#8492a6] hover:text-[#e2a450] hover:scale-110 active:scale-95 transition-all p-1"
                  >
                    <SkipForward size={22} fill="currentColor" />
                  </button>
                </div>

                {/* Right: Volume & Fullscreen Trigger */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <button
                      onClick={toggleMute}
                      title={isMuted ? "Unmute" : "Mute (M)"}
                      className="text-[#8492a6] hover:text-[#e2a450] transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={16} className="text-red-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 size={16} />
                      ) : (
                        <Volume2 size={16} />
                      )}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => changeVolume(parseFloat(e.target.value))}
                      className="w-20 player-range accent-[#e2a450]"
                      aria-label="Volume slider"
                    />
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    title="Toggle Fullscreen (F)"
                    className="p-2 rounded-xl bg-[#141c2e] hover:bg-[#e2a450] text-[#e2a450] hover:text-[#060911] border border-white/10 transition-all shadow-md"
                  >
                    {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </motion.footer>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RetroCinemaVideo;
