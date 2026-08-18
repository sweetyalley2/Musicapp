import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';
import { fallbackSongs } from '../data/fallbackSongs';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(fallbackSongs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.75);
  const [playlist, setPlaylist] = useState(fallbackSongs || []);
  const [error, setError] = useState(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('all'); // 'off', 'all', 'one'
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const pendingPlayRef = useRef(null);
  const isSeekingRef = useRef(false);

  const getPlayer = () => {
    return playerInstanceRef.current || playerRef.current?.internalPlayer || null;
  };

  // Sync volume with YouTube internal player
  const applyVolume = useCallback(async (vol, muted) => {
    const player = getPlayer();
    if (!player) return;
    try {
      if (muted || vol === 0) {
        if (typeof player.mute === 'function') await player.mute();
      } else {
        if (typeof player.unMute === 'function') await player.unMute();
        if (typeof player.setVolume === 'function') await player.setVolume(Math.round(vol * 100));
      }
    } catch (e) {
      // Ignore API errors before full initialization
    }
  }, []);

  // Update progress every 350ms when playing
  useEffect(() => {
    let progressInterval;
    if (isPlaying && !isSeekingRef.current) {
      progressInterval = setInterval(async () => {
        const player = getPlayer();
        if (!player) return;
        try {
          if (typeof player.getCurrentTime === 'function' && typeof player.getDuration === 'function') {
            const cur = await player.getCurrentTime();
            const dur = await player.getDuration();
            if (dur && dur > 0) {
              setCurrentTime(cur);
              setDuration(dur);
              setProgress((cur / dur) * 100);
            }
          }
        } catch (e) {
          // Ignore
        }
      }, 350);
    }
    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  // Main playSong method
  const playSong = async (song, newPlaylist = null) => {
    if (!song) return;
    if (newPlaylist && Array.isArray(newPlaylist) && newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
    }

    const player = getPlayer();

    // Toggle same song (Play/Pause resume at exact position)
    if (currentSong && currentSong.id === song.id && player) {
      try {
        if (isPlaying) {
          if (typeof player.pauseVideo === 'function') await player.pauseVideo();
          setIsPlaying(false);
        } else {
          if (!song.youtubeId) {
            setError("Audio unavailable for this track");
            setIsPlaying(false);
            return;
          }
          if (typeof player.playVideo === 'function') await player.playVideo();
          setIsPlaying(true);
        }
      } catch (e) {
        setIsPlaying(false);
      }
      return;
    }

    // Switch to new song
    setCurrentSong(song);
    setProgress(0);
    setCurrentTime(0);
    setError(null);

    if (!song.youtubeId) {
      setError("Audio source unavailable");
      setIsPlaying(false);
      return;
    }

    if (player) {
      try {
        if (typeof player.loadVideoById === 'function') {
          await player.loadVideoById({
            videoId: song.youtubeId,
            startSeconds: 0
          });
        }
        await applyVolume(volume, isMuted);
        if (typeof player.playVideo === 'function') {
          await player.playVideo();
        }
        setIsPlaying(true);
      } catch (e) {
        // Fallback simple load
        try {
          if (typeof player.loadVideoById === 'function') {
            player.loadVideoById(song.youtubeId);
            player.playVideo();
            setIsPlaying(true);
          }
        } catch (err2) {
          setError("Failed to load audio");
          setIsPlaying(false);
        }
      }
    } else {
      // Player not ready yet; queue for when ready
      pendingPlayRef.current = { song, playlist: newPlaylist };
    }
  };

  const togglePlay = async () => {
    if (!currentSong) {
      if (playlist.length > 0) {
        playSong(playlist[0]);
      }
      return;
    }

    const player = getPlayer();
    if (!player) {
      pendingPlayRef.current = { song: currentSong };
      return;
    }

    try {
      if (isPlaying) {
        if (typeof player.pauseVideo === 'function') await player.pauseVideo();
        setIsPlaying(false);
      } else {
        if (typeof player.playVideo === 'function') await player.playVideo();
        setIsPlaying(true);
      }
    } catch (e) {
      setIsPlaying(false);
    }
  };

  const playNext = useCallback(() => {
    if (playlist.length === 0 || !currentSong) return;

    if (repeatMode === 'one') {
      const player = getPlayer();
      if (player && typeof player.seekTo === 'function') {
        player.seekTo(0, true);
        if (typeof player.playVideo === 'function') player.playVideo();
        setIsPlaying(true);
      }
      return;
    }

    if (isShuffle) {
      const remaining = playlist.filter(s => s.id !== currentSong.id);
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        playSong(remaining[randomIndex]);
        return;
      }
    }

    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    if (currentIndex === -1) {
      playSong(playlist[0]);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < playlist.length) {
      playSong(playlist[nextIndex]);
    } else if (repeatMode === 'all') {
      playSong(playlist[0]);
    } else {
      setIsPlaying(false);
    }
  }, [playlist, currentSong, repeatMode, isShuffle]);

  const playPrevious = () => {
    if (playlist.length === 0 || !currentSong) return;

    // If current song is > 3 seconds in, jump to start
    const player = getPlayer();
    if (currentTime > 3 && player && typeof player.seekTo === 'function') {
      seekTo(0);
      return;
    }

    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex]);
  };

  const seekTo = (seconds) => {
    const player = getPlayer();
    if (player && typeof player.seekTo === 'function') {
      try {
        const safeSeconds = Math.max(0, Math.min(seconds, duration || seconds));
        player.seekTo(safeSeconds, true);
        setCurrentTime(safeSeconds);
        if (duration > 0) {
          setProgress((safeSeconds / duration) * 100);
        }
      } catch (e) {
        // Ignore seek error
      }
    }
  };

  const changeVolume = (newVolume) => {
    const safeVol = Math.max(0, Math.min(1, newVolume));
    setVolume(safeVol);
    if (safeVol > 0 && isMuted) {
      setIsMuted(false);
    }
    applyVolume(safeVol, false);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const restoreVol = prevVolume > 0 ? prevVolume : 0.75;
      setVolume(restoreVol);
      applyVolume(restoreVol, false);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
      applyVolume(0, true);
    }
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const closePlayer = () => {
    const player = getPlayer();
    if (player && typeof player.stopVideo === 'function') {
      try {
        player.stopVideo();
      } catch (e) {}
    }
    setIsPlaying(false);
  };

  const onPlayerReady = (event) => {
    playerInstanceRef.current = event.target;
    setIsPlayerReady(true);
    applyVolume(volume, isMuted);

    // If there was a pending song to play, execute now
    if (pendingPlayRef.current) {
      const { song, playlist: newPlaylist } = pendingPlayRef.current;
      pendingPlayRef.current = null;
      playSong(song, newPlaylist);
    }
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    // YT.PlayerState.BUFFERING = 3
    if (event.data === 1) {
      setIsPlaying(true);
      setError(null);
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      playNext();
    }
  };

  const onPlayerError = (event) => {
    // 2: invalid parameter, 5: html5 error, 100: not found, 101/150: restricted embed
    if (event.data === 101 || event.data === 150) {
      // restricted embed, auto advance
      playNext();
    } else {
      setError("Audio stream connecting...");
    }
  };

  const contextValue = {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    playlist,
    error,
    isShuffle,
    repeatMode,
    isPlayerReady,
    playSong,
    playNext,
    playPrevious,
    changeVolume,
    toggleMute,
    togglePlay,
    toggleShuffle,
    toggleRepeat,
    closePlayer,
    seekTo
  };

  const opts = {
    height: '160',
    width: '160',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
      modestbranding: 1,
      rel: 0
    },
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
      {/* Hidden YouTube iframe for pure audio streaming, sized to prevent browser suspension */}
      <div 
        aria-hidden="true" 
        style={{ 
          position: 'fixed', 
          bottom: 0, 
          right: 0, 
          width: '160px', 
          height: '160px', 
          opacity: 0.001, 
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden'
        }}
      >
        <YouTube
          videoId={currentSong?.youtubeId || "kAU8_00hAhs"}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onError={onPlayerError}
          ref={playerRef}
        />
      </div>
    </MusicContext.Provider>
  );
};

