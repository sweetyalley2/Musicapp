import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import RainCanvas from '../components/RainCanvas';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const Mumbai = () => {
  const { playSong } = useMusicPlayer();
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/songs')
      .then(res => res.json())
      .then(data => {
        // Filter some songs for Mumbai vibe
        if (data && data.length > 0) {
          setSongs(data.filter(s => s.city === 'mumbai' || s.mood === 'dance'));
        }
      })
      .catch(err => console.log('Error fetching songs for Mumbai'));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen pt-24 pb-32 px-4 md:px-12 bg-[#0a0f1c]"
    >
      {/* Background with warmer orange reflections */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1c] via-[#1a1525] to-[#2a1b18] opacity-90"></div>
      
      {/* Neon glow effects */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-neonred/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <RainCanvas preset="mumbai" />
      
      <div className="relative z-10 max-w-6xl mx-auto h-full">
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-vintage text-cream text-glow mb-2" style={{textShadow: '0 0 15px rgba(201, 92, 84, 0.6)'}}>
            Mumbai Monsoon
          </h1>
          <p className="text-monsoon font-ui tracking-wide">Heavy rain, neon signs, and endless nights.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CRT TV Area */}
          <div className="lg:col-span-7">
            <div className="relative bg-black rounded-3xl p-4 border-8 border-gray-800 shadow-2xl">
              {/* TV Screen */}
              <div className="bg-[#111] rounded-2xl overflow-hidden aspect-video relative border-2 border-gray-900 flex flex-col p-6">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjMiIGZpbGw9IiMzMzMiPjwvcmVjdD4KPC9zdmc+')] opacity-20 pointer-events-none z-10"></div>
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,1)] z-20 pointer-events-none"></div>
                
                <h3 className="font-vintage text-neonred text-xl mb-4 z-30 opacity-80" style={{textShadow: '0 0 5px red'}}>
                  CH 3 - BOLLYWOOD CLASSICS
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 z-30 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                  {songs.slice(0, 6).map((song, i) => (
                    <motion.div
                      key={song.id}
                      whileHover={{ scale: 1.05, zIndex: 10 }}
                      onClick={() => playSong(song, songs)}
                      className="cursor-pointer group relative aspect-[2/3] bg-gray-900 border border-gray-700 rounded flex flex-col overflow-hidden"
                    >
                      <div className="flex-grow bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-2 text-center group-hover:from-neonred/20 group-hover:to-purple-900/20 transition-colors">
                        <span className="font-vintage text-cream/80 text-sm drop-shadow-md">
                          {song.title}
                        </span>
                      </div>
                      <div className="h-8 bg-black/80 flex items-center justify-center border-t border-gray-700">
                        <span className="text-[10px] text-monsoon uppercase">Play</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* TV Controls */}
              <div className="absolute right-[-20px] top-1/4 w-8 h-32 bg-gray-700 rounded-r-lg border-y-4 border-r-4 border-gray-800 flex flex-col justify-around py-4 items-center">
                <div className="w-4 h-4 rounded-full bg-gray-900 shadow-inner"></div>
                <div className="w-4 h-4 rounded-full bg-gray-900 shadow-inner"></div>
              </div>
            </div>
          </div>

          {/* Right Menu */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-panel p-8 rounded-2xl flex-grow flex flex-col">
              <h3 className="font-vintage text-gold text-2xl mb-6 text-glow border-b border-white/10 pb-4">
                Café Menu
              </h3>
              
              <ul className="space-y-6 flex-grow font-ui">
                <li className="flex justify-between items-center group cursor-pointer" onClick={() => playSong(songs[0], songs)}>
                  <div>
                    <h4 className="text-cream group-hover:text-gold transition-colors">Midnight Chai</h4>
                    <p className="text-xs text-monsoon">Strong, sweet, keeps you awake</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <span className="text-xs">▶</span>
                  </div>
                </li>
                
                <li className="flex justify-between items-center group cursor-pointer" onClick={() => playSong(songs[1], songs)}>
                  <div>
                    <h4 className="text-cream group-hover:text-gold transition-colors">Bun Maska</h4>
                    <p className="text-xs text-monsoon">Perfect for the rain</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <span className="text-xs">▶</span>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between opacity-50">
                <span className="text-xs uppercase tracking-widest">Est. 1992</span>
                <span className="text-xs uppercase tracking-widest">Open 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Mumbai;
