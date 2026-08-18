import React, { createContext, useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

export const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState(null);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);

  useEffect(() => {
    let progressInterval;
    if (isPlaying && playerRef.current) {
      progressInterval = setInterval(async () => {
        try {
          const currentTime = await playerRef.current.internalPlayer.getCurrentTime();
          const duration = await playerRef.current.internalPlayer.getDuration();
          if (duration) {
            setProgress((currentTime / duration) * 100);
            setCurrentTime(currentTime);
            setDuration(duration);
          }
        } catch (e) {
          // Ignore API errors when unmounted
        }
      }, 1000);
    }
    
    return () => clearInterval(progressInterval);
  }, [isPlaying]);

  const playSong = async (song, newPlaylist = null) => {
    if (newPlaylist) setPlaylist(newPlaylist);
    
    if (currentSong?.id === song.id && playerRef.current) {
      if (isPlaying) {
        playerRef.current.internalPlayer.pauseVideo();
        setIsPlaying(false);
      } else {
        if (!song.youtubeId) {
          setError("Audio unavailable");
          setIsPlaying(false);
          return;
        }
        playerRef.current.internalPlayer.playVideo();
        setIsPlaying(true);
      }
      return;
    }

    setCurrentSong(song);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    if (!song.youtubeId) {
      setError("Audio unavailable");
      setIsPlaying(false);
      return;
    }

    if (playerRef.current) {
      try {
        await playerRef.current.internalPlayer.loadVideoById(song.youtubeId);
        setIsPlaying(true);
      } catch (e) {
        setError("Failed to load audio");
        setIsPlaying(false);
      }
    }
  };

  const playNext = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playSong(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0 || !currentSong) return;
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(playlist[prevIndex]);
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.internalPlayer.setVolume(newVolume * 100);
    }
  };

  const togglePlay = () => {
    if (currentSong) {
      playSong(currentSong);
    }
  };

  const closePlayer = () => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.stopVideo();
    }
    setCurrentSong(null);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  };

  const onPlayerReady = (event) => {
    event.target.setVolume(volume * 100);
    // Don't auto-play on ready, we will handle it in playSong
  };

  const onPlayerStateChange = (event) => {
    // YT.PlayerState.PLAYING = 1
    // YT.PlayerState.PAUSED = 2
    // YT.PlayerState.ENDED = 0
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    } else if (event.data === 0) {
      setIsPlaying(false);
      playNext();
    }
  };

  const onPlayerError = (event) => {
    // Ignore error 150 (embed restricted) for dummy video
    if (event.data !== 150 && event.data !== 101) {
       setError("Failed to load audio");
       setIsPlaying(false);
    }
  };

  const seekTo = (seconds) => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.seekTo(seconds, true);
      setCurrentTime(seconds);
      if (duration) {
        setProgress((seconds / duration) * 100);
      }
    }
  };

  const contextValue = {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    error,
    playSong,
    playNext,
    playPrevious,
    changeVolume,
    togglePlay,
    closePlayer,
    seekTo
  };

  const opts = {
    height: '200',
    width: '200',
    playerVars: {
      autoplay: 0, // No autoplay on load to avoid blocking
      controls: 0,
      disablekb: 1,
      fs: 0,
      playsinline: 1
    },
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
      <div style={{ position: 'fixed', top: '-1000px', left: '-1000px', width: '200px', height: '200px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}>
        <YouTube
          videoId="M7lc1UVf-VE" // Dummy ID to initialize player
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
