import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Tv, Coffee, Sparkles, Play, Disc, Music, Flame, Maximize2 } from 'lucide-react';
import InteractiveRainGlass from '../components/InteractiveRainGlass';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { fallbackSongs } from '../data/fallbackSongs';

const Mumbai = () => {
  const { playSong, currentSong, isPlaying, openVideoMode } = useMusicPlayer();
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
    { title: "Midnight Cutting Chai", desc: "Brewed kadak with lemongrass & fresh ginger for downpours", songIndex: 0 },
    { title: "Bun Maska & Irani Chai", desc: "Warm crusty pav with dollops of salted butter", songIndex: 1 },
    { title: "Marine Drive Rain Melody", desc: "Wipers beating in sync with immortal 90s cassette tracks", songIndex: 2 },
    { title: "Bandra Night Drive", desc: "Gleaming wet asphalt under warm amber street lamps", songIndex: 3 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen pt-20 pb-36 px-4 sm:px-6 md:px-12 bg-[#060911]"
    >
      {/* Background with Ambient Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1422] via-[#090d16] to-[#060911] pointer-events-none"></div>

      <InteractiveRainGlass intensity="heavy" />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-between">
        
        {/* Editorial Header */}
        <header className="mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#141c2e] text-[#e2a450] px-3 py-1 rounded-full border border-white/10 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            <span>Mumbai Monsoon Archive • Marine Drive</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-vintage font-bold text-[#f4eee2] mb-1.5 tracking-tight">
            Mumbai Monsoon
          </h1>
          <p className="text-xs sm:text-base text-[#8492a6] font-ui max-w-2xl font-normal">
            Torrential coastal rainstorms, heritage Irani cafés, wet asphalt reflections, and high-energy 90s Bollywood tracks.
          </p>
        </header>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Left: Vintage Trinitron Monitor */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="craft-panel rounded-2xl p-4 sm:p-5 border border-white/10 shadow-2xl overflow-hidden">
              
              {/* Cathode Ray Monitor Frame */}
              <div className="bg-[#04060a] rounded-xl overflow-hidden relative border border-white/10 p-4 sm:p-5 flex flex-col shadow-inner">
                
                {/* Subtle Scanlines */}
                <div className="absolute inset-0 crt-scanlines opacity-25 pointer-events-none z-10"></div>

                {/* Broadcast Channel Header */}
                <div className="flex items-center justify-between z-30 mb-3 pb-2 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2 text-[#e2a450]">
                    <Tv size={16} />
                    <span className="font-mono text-xs font-bold tracking-wider uppercase text-[#f4eee2]">
                      CH 03 • MUMBAI NOSTALGIA
                    </span>
                  </div>
                  <button
                    onClick={openVideoMode}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/80 px-2.5 py-1 rounded border border-emerald-700/50 uppercase font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                    title="Watch in Fullscreen Retro TV"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>WATCH FULLSCREEN TV</span>
                    <Maximize2 size={11} className="ml-0.5" />
                  </button>
                </div>

                {/* Track Directory inside CRT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 z-30 max-h-[380px] overflow-y-auto pr-1">
                  {songs.slice(0, 10).map((song) => {
                    const isSelected = currentSong?.id === song.id;
                    const isThisPlaying = isSelected && isPlaying;

                    return (
                      <div
                        key={song.id}
                        onClick={() => playSong(song, songs)}
                        className={`cursor-pointer rounded-xl p-2.5 flex items-center gap-2.5 transition-all border ${
                          isSelected
                            ? 'bg-[#182030] border-[#e2a450] shadow-md'
                            : 'bg-white/[0.02] hover:bg-white/[0.06] border-transparent'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#090d16] flex-shrink-0 border border-white/10">
                          {song.cover ? (
                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#e2a450]">
                              <Disc size={18} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-semibold truncate ${isSelected ? 'text-[#e2a450]' : 'text-[#f4eee2]'}`}>
                            {song.title}
                          </h4>
                          <p className="text-[10px] text-[#8492a6] truncate mt-0.5">
                            {song.artist || 'Classic Melody'}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          {isThisPlaying ? (
                            <div className="w-5 h-5 rounded bg-[#e2a450] text-[#060911] flex items-center justify-center font-mono text-[9px] font-bold">
                              ▶
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded bg-white/5 text-[#8492a6] flex items-center justify-center hover:bg-[#e2a450] hover:text-[#060911] transition-colors">
                              <Play size={9} fill="currentColor" className="ml-0.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Heritage Irani Café Soundtracks */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="craft-panel p-5 md:p-6 rounded-2xl shadow-2xl flex-grow flex flex-col border border-white/10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div>
                  <h2 className="font-vintage font-bold text-xl md:text-2xl text-[#f4eee2]">
                    Irani Café Soundtracks
                  </h2>
                  <p className="text-xs text-[#8492a6] mt-0.5">Click any menu mood to cue the track</p>
                </div>
                <Flame size={20} className="text-[#e2a450]" />
              </div>

              {/* Menu List */}
              <div className="space-y-3 flex-grow">
                {cafeMenuItems.map((item, idx) => {
                  const targetSong = songs[item.songIndex] || songs[0];
                  const isSelected = currentSong?.id === targetSong?.id;

                  return (
                    <div
                      key={idx}
                      onClick={() => targetSong && playSong(targetSong, songs)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#182030] border-[#e2a450] shadow-md'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.04]'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <h4 className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#e2a450]' : 'text-[#f4eee2]'}`}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[#8492a6] mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-[#141c2e] border border-white/10 text-[#e2a450] flex items-center justify-center flex-shrink-0 shadow-sm hover:border-[#e2a450] transition-colors">
                        <Play size={12} fill="currentColor" className="ml-0.5" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Badge */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-[#8492a6] uppercase font-semibold">
                <span>ESTD. 1994 • IRANI CAFÉ ARCHIVE</span>
                <span className="text-[#e2a450]">Open All Monsoons</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Mumbai;

