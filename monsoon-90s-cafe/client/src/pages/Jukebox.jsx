import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { Search, Play, Pause, Disc, Filter, X, Music } from 'lucide-react';
import InteractiveRainGlass from '../components/InteractiveRainGlass';
import { fallbackSongs } from '../data/fallbackSongs';

const Jukebox = () => {
  const [songs, setSongs] = useState(fallbackSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMood, setSelectedMood] = useState('all');
  const { playSong, currentSong, isPlaying, togglePlay } = useMusicPlayer();

  useEffect(() => {
    fetch('http://localhost:5000/api/songs')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setSongs(data);
        }
      })
      .catch(() => {
        // Use default fallback songs
      });
  }, []);

  const moods = useMemo(() => [
    { id: 'all', label: 'All Catalog' },
    { id: 'nostalgia', label: 'Monsoon Nostalgia' },
    { id: 'rain', label: 'Rain Melodies' },
    { id: 'romantic', label: '90s Romance' },
    { id: 'party', label: 'Retro Upbeat' }
  ], []);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (song.year && song.year.toString().includes(searchTerm.toLowerCase()));
      
      const matchesMood = selectedMood === 'all' || 
        (song.mood && song.mood.toLowerCase() === selectedMood.toLowerCase()) ||
        (selectedMood === 'romantic' && (song.mood === 'nostalgia' || song.mood === 'romantic'));

      return matchesSearch && matchesMood;
    });
  }, [songs, searchTerm, selectedMood]);

  const handleCardClick = (song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      playSong(song, filteredSongs);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20 pb-36 px-4 sm:px-6 md:px-12 relative bg-[#060911]"
    >
      <InteractiveRainGlass intensity="light" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-6 md:mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#141c2e] text-[#e2a450] px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 shadow-sm">
            <Music size={13} />
            <span>Master Audio Archive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-vintage font-bold text-[#f4eee2] mb-1.5 tracking-tight">
            The Retro Jukebox
          </h1>
          <p className="text-xs sm:text-base text-[#8492a6] font-ui max-w-xl mx-auto font-normal">
            Complete catalogue of {songs.length} timeless melodies from the golden era of Bollywood and Bengali music.
          </p>
        </header>

        {/* Controls Bar: Search & Mood Filters */}
        <div className="craft-panel p-4 md:p-5 rounded-2xl mb-6 space-y-3 border border-white/10 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#8492a6]" size={15} />
              <input 
                type="text" 
                placeholder="Search song title, artist, or year..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#060911] border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-[#f4eee2] placeholder-[#505c6e] focus:outline-none focus:border-[#e2a450]/60 transition-colors font-mono"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8492a6] hover:text-[#f4eee2]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Song Count Badge */}
            <div className="text-[11px] font-mono text-[#8492a6] bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 self-end md:self-auto">
              <Filter size={12} className="text-[#e2a450]" />
              <span>{filteredSongs.length} Tracks</span>
            </div>
          </div>

          {/* Mood Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide whitespace-nowrap transition-all border ${
                  selectedMood === mood.id
                    ? 'bg-[#e2a450] text-[#060911] font-bold border-[#e2a450] shadow-sm'
                    : 'bg-[#090d16] text-[#8492a6] hover:text-[#f4eee2] border-white/10 hover:border-white/20'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          <AnimatePresence>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song, index) => {
                const isSelected = currentSong?.id === song.id;
                const isThisPlaying = isSelected && isPlaying;

                return (
                  <motion.div
                    key={song.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.25) }}
                    onClick={() => handleCardClick(song)}
                    className={`group cursor-pointer rounded-xl p-3 flex items-center gap-3 transition-all relative overflow-hidden border ${
                      isSelected
                        ? 'bg-[#182030] border-[#e2a450] shadow-md'
                        : 'bg-[#0e1422]/80 hover:bg-[#141c2e] border-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    {/* Cover Thumbnail */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#060911] border border-white/10 flex-shrink-0 shadow-sm">
                      {song.cover ? (
                        <img 
                          src={song.cover} 
                          alt={song.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#090d16] text-[#e2a450]">
                          <Disc size={22} />
                        </div>
                      )}

                      {/* Play / Pause overlay */}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="w-6 h-6 rounded-full bg-[#e2a450] text-[#060911] flex items-center justify-center">
                          {isThisPlaying ? (
                            <Pause size={12} fill="currentColor" />
                          ) : (
                            <Play size={12} fill="currentColor" className="ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Track Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white/5 text-[#8492a6] border border-white/10">
                          {song.year || '90s'}
                        </span>
                        {song.mood && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#e2a450]/10 text-[#e2a450] border border-[#e2a450]/20 uppercase">
                            {song.mood}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-xs sm:text-sm font-semibold truncate ${
                        isSelected ? 'text-[#e2a450]' : 'text-[#f4eee2] group-hover:text-[#e2a450] transition-colors'
                      }`}>
                        {song.title}
                      </h3>

                      <p className="text-[11px] text-[#8492a6] truncate mt-0.5">
                        {song.artist || 'Classic Melody'}
                      </p>
                    </div>

                    {/* Right Playing Indicator */}
                    <div className="flex-shrink-0">
                      {isThisPlaying ? (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#e2a450]/20 text-[#e2a450] text-[10px] font-mono font-bold">
                          <span>Playing</span>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-white/5 text-[#8492a6] group-hover:text-[#f4eee2] flex items-center justify-center transition-colors">
                          <Play size={10} fill="currentColor" className="ml-0.5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center craft-panel rounded-2xl">
                <Disc size={40} className="mx-auto text-[#8492a6]/40 mb-2" />
                <h3 className="text-lg font-vintage font-bold text-[#f4eee2]">No matching tracks found</h3>
                <p className="text-xs text-[#8492a6] mt-1">Try a different title or artist query.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedMood('all'); }}
                  className="mt-3 px-4 py-1.5 bg-[#e2a450] text-[#060911] rounded-lg text-xs font-mono font-bold uppercase tracking-wider"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Jukebox;

