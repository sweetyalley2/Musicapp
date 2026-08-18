import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { Search, Play, Pause, Disc, Sparkles, Filter, X } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';
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
    { id: 'all', label: 'All Songs' },
    { id: 'nostalgia', label: '🌧️ Monsoon Nostalgia' },
    { id: 'rain', label: '💧 Rain Melodies' },
    { id: 'romantic', label: '🌹 90s Romance' },
    { id: 'party', label: '✨ Retro Party' }
  ], []);

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (song.year && song.year.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
      className="min-h-screen pt-24 pb-36 px-4 sm:px-6 md:px-12 relative"
    >
      <RainCanvas preset="light" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-[#F3C969]/10 text-[#F3C969] px-4 py-1.5 rounded-full border border-[#F3C969]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-4 shadow-md">
            <Sparkles size={14} />
            <span>Grand 90s Music Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-vintage font-bold text-[#FFF8EB] mb-3 text-glow">
            The Retro Jukebox
          </h1>
          <p className="text-sm md:text-base text-[#94A3B8] font-ui max-w-xl mx-auto font-medium">
            Over {songs.length} timeless melodies from the golden era. Click any cassette or track to play.
          </p>
        </header>

        {/* Controls Bar: Search & Mood Filters */}
        <div className="glass-panel p-4 md:p-6 rounded-3xl mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F3C969]" size={18} />
              <input 
                type="text" 
                placeholder="Search song title, artist, or movie..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0b0f19]/80 border border-white/15 rounded-2xl py-3 pl-11 pr-10 text-sm text-[#FFF8EB] placeholder-[#94A3B8] focus:outline-none focus:border-[#F3C969] focus:ring-1 focus:ring-[#F3C969] transition-all font-ui shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#94A3B8] hover:text-[#FFF8EB] p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Song Count Badge */}
            <div className="text-xs font-mono font-semibold text-[#CBD5E1] bg-white/5 px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 self-end md:self-auto">
              <Filter size={12} className="text-[#F3C969]" />
              <span>Showing {filteredSongs.length} tracks</span>
            </div>
          </div>

          {/* Mood Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all font-ui ${
                  selectedMood === mood.id
                    ? 'bg-[#F3C969] text-[#0b0f19] font-bold shadow-[0_0_15px_rgba(243,201,105,0.4)]'
                    : 'bg-[#172036]/70 text-[#CBD5E1] hover:text-[#FFF8EB] hover:bg-[#172036] border border-white/10'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song, index) => {
                const isSelected = currentSong?.id === song.id;
                const isThisPlaying = isSelected && isPlaying;

                return (
                  <motion.div
                    key={song.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.3) }}
                    onClick={() => handleCardClick(song)}
                    className={`group cursor-pointer rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 transition-all relative overflow-hidden border ${
                      isSelected
                        ? 'bg-[#2d1c19]/90 border-[#F3C969] shadow-[0_8px_30px_rgba(243,201,105,0.25)] ring-1 ring-[#F3C969]'
                        : 'bg-[#111728]/70 hover:bg-[#172036]/90 border-white/10 hover:border-[#F3C969]/40 shadow-lg hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {/* Cover Thumbnail with Play/Pause Overlay */}
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0 shadow-md">
                      {song.cover ? (
                        <img 
                          src={song.cover} 
                          alt={song.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2d1c19] to-[#0b0f19] text-[#F3C969]">
                          <Disc size={28} />
                        </div>
                      )}

                      {/* Play / Pause button overlay on hover/active */}
                      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                        isThisPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="w-8 h-8 rounded-full bg-[#F3C969] text-[#0b0f19] flex items-center justify-center shadow-lg">
                          {isThisPlaying ? (
                            <Pause size={16} fill="currentColor" />
                          ) : (
                            <Play size={16} fill="currentColor" className="ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Track Info (Title, Artist, Badges) */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/10 text-[#CBD5E1] border border-white/10 font-semibold">
                          {song.year || '90s'}
                        </span>
                        {song.mood && (
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F3C969]/10 text-[#F3C969] border border-[#F3C969]/20 font-semibold">
                            {song.mood}
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm sm:text-base font-bold truncate leading-snug tracking-tight ${
                        isSelected ? 'text-[#F3C969] text-glow' : 'text-[#FFF8EB] group-hover:text-[#F3C969] transition-colors'
                      }`}>
                        {song.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#94A3B8] font-medium truncate mt-0.5">
                        {song.artist || 'Classic Melody'}
                      </p>
                    </div>

                    {/* Right Playing Indicator or Arrow */}
                    <div className="flex-shrink-0">
                      {isThisPlaying ? (
                        <div className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-[#F3C969]/20 border border-[#F3C969]/30">
                          <span className="w-1 bg-[#F3C969] rounded-full h-3 animate-[pulse_0.6s_infinite]"></span>
                          <span className="w-1 bg-[#F3C969] rounded-full h-5 animate-[pulse_0.8s_infinite_0.2s]"></span>
                          <span className="w-1 bg-[#F3C969] rounded-full h-3.5 animate-[pulse_0.5s_infinite_0.4s]"></span>
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#F3C969]/20 text-[#94A3B8] group-hover:text-[#F3C969] flex items-center justify-center transition-colors">
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center glass-panel rounded-3xl">
                <Disc size={48} className="mx-auto text-[#F3C969]/40 mb-3" />
                <h3 className="text-xl font-vintage font-bold text-[#FFF8EB]">No tracks found</h3>
                <p className="text-sm text-[#94A3B8] mt-1">Try searching for a different song name or artist.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedMood('all'); }}
                  className="mt-4 px-5 py-2 bg-[#F3C969] text-[#0b0f19] rounded-xl text-xs font-bold font-ui uppercase tracking-wider"
                >
                  Clear Filters
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
