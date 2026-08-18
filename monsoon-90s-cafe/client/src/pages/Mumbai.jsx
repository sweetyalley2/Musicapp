import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Tv, Flame, Sparkles, Play, Disc } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackSongs } from '../data/fallbackSongs';

const Mumbai = () => {
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/songs')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          const filtered = data.filter(s => s.mood === 'party' || s.city === 'mumbai' || s.mood === 'rain');
          setSongs(filtered.length > 0 ? filtered : data);
        } else {
          setSongs(fallbackSongs);
        }
      })
      .catch(() => {
        setSongs(fallbackSongs);
      });
  }, []);

  const cafeMenuItems = [
    { title: "Midnight Cutting Chai", desc: "Kadak, spicy, brewed for midnight monsoons", songIndex: 0 },
    { title: "Bun Maska & Irani Chai", desc: "Warm crusty pav with dollops of butter", songIndex: 1 },
    { title: "Marine Drive Rain Melody", desc: "Windshield wipers beating in 4/4 rhythm", songIndex: 2 },
    { title: "Retro Bandra Cassette", desc: "Late night drive through glowing neon signboards", songIndex: 3 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen pt-24 pb-36 px-4 sm:px-6 md:px-12 bg-[#0a0714]"
    >
      {/* Background with warm neon accents */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0f19] via-[#1a0f1d] to-[#24101a] opacity-95"></div>
      
      {/* Ambient Neon Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#F87171]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#F3C969]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <RainCanvas preset="mumbai" />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F87171]/10 text-[#F87171] px-3.5 py-1.5 rounded-full border border-[#F87171]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-3 shadow-md">
            <Sparkles size={13} />
            <span>Mumbai Monsoon Neon Nights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-vintage font-bold text-[#FFF8EB] mb-2 text-glow-red">
            Mumbai Monsoon
          </h1>
          <p className="text-sm md:text-lg text-[#94A3B8] font-ui max-w-2xl font-medium">
            Heavy torrential rains, Irani cafés, neon reflections on Marine Drive, and upbeat Bollywood rhythms.
          </p>
        </header>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Vintage CRT TV Player Box */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative bg-[#18181b] rounded-3xl p-3 sm:p-5 border-4 sm:border-8 border-[#27272a] shadow-2xl overflow-hidden">
              
              {/* CRT TV Screen */}
              <div className="bg-[#09090b] rounded-2xl overflow-hidden relative border-2 border-[#3f3f46] p-4 sm:p-6 flex flex-col shadow-inner">
                
                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 crt-scanlines opacity-40 pointer-events-none z-10"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.9)] z-20 pointer-events-none"></div>

                {/* Channel Header */}
                <div className="flex items-center justify-between z-30 mb-4 pb-2 border-b border-[#3f3f46]">
                  <div className="flex items-center gap-2 text-[#F87171]">
                    <Tv size={18} />
                    <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-glow-red">
                      CH 03 • BOLLYWOOD HITS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-green-400 bg-green-950/60 px-2 py-0.5 rounded border border-green-700/50 uppercase font-bold animate-pulse">
                    ● ON AIR
                  </span>
                </div>

                {/* TV Screen Song Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 z-30 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                  {songs.slice(0, 10).map((song) => {
                    const isSelected = currentSong?.id === song.id;
                    const isThisPlaying = isSelected && isPlaying;

                    return (
                      <motion.div
                        key={song.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => playSong(song, songs)}
                        className={`cursor-pointer rounded-xl p-3 flex items-center gap-3 transition-all border ${
                          isSelected
                            ? 'bg-[#3b151e]/90 border-[#F87171] shadow-lg ring-1 ring-[#F87171]'
                            : 'bg-black/60 hover:bg-[#27272a]/80 border-white/10'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                          {song.cover ? (
                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#F87171]">
                              <Disc size={20} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-[#F87171]' : 'text-[#FFF8EB]'}`}>
                            {song.title}
                          </h4>
                          <p className="text-[11px] text-[#94A3B8] font-medium truncate mt-0.5">
                            {song.artist || 'Classic Melody'}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          {isThisPlaying ? (
                            <div className="w-6 h-6 rounded-full bg-[#F87171] text-[#0b0f19] flex items-center justify-center">
                              <span className="text-[10px] font-bold">▶</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-white/5 text-[#94A3B8] flex items-center justify-center hover:bg-[#F87171] hover:text-[#0b0f19] transition-colors">
                              <Play size={10} fill="currentColor" className="ml-0.5" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Irani Café Specials & Mood Board */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-2xl flex-grow flex flex-col border-t border-[#F87171]/20">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h2 className="font-vintage font-bold text-2xl md:text-3xl text-[#FFF8EB] text-glow">
                    Irani Café Specials
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Click any menu item to play its signature soundtrack</p>
                </div>
                <Flame size={24} className="text-[#F87171]" />
              </div>

              {/* Menu List */}
              <div className="space-y-4 flex-grow">
                {cafeMenuItems.map((item, idx) => {
                  const targetSong = songs[item.songIndex] || songs[0];
                  const isSelected = currentSong?.id === targetSong?.id;

                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 4 }}
                      onClick={() => targetSong && playSong(targetSong, songs)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#3b151e]/80 border-[#F87171] shadow-md'
                          : 'bg-white/5 hover:bg-white/10 border-white/5'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <h4 className={`text-base font-bold transition-colors ${isSelected ? 'text-[#F87171]' : 'text-[#FFF8EB]'}`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#94A3B8] mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-[#F3C969]/10 border border-[#F3C969]/30 text-[#F3C969] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer Stamp */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#94A3B8] uppercase font-bold">
                <span>ESTD. 1994</span>
                <span className="text-[#F3C969]">Open In Rain 24/7</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Mumbai;
