import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { Search, Play } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';
import { fallbackSongs } from '../data/fallbackSongs';

const Jukebox = () => {
  const [songs, setSongs] = useState(fallbackSongs);
  const [searchTerm, setSearchTerm] = useState('');
  const { playSong, currentSong, isPlaying } = useMusicPlayer();

  useEffect(() => {
    fetch('http://localhost:5000/api/songs')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) setSongs(data);
      })
      .catch(err => console.log('Using fallback songs for jukebox'));
  }, []);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-32 px-4 md:px-12 relative"
    >
      <RainCanvas preset="light" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-vintage text-gold mb-4 text-glow">The Jukebox</h1>
          <p className="text-monsoon">Insert imaginary coin to play.</p>
        </header>

        <div className="glass-panel p-6 md:p-8 rounded-2xl mb-8">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-monsoon" size={20} />
            <input 
              type="text" 
              placeholder="Search by song or artist..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-navy-900/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-cream focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredSongs.length > 0 ? (
              filteredSongs.map((song, index) => (
                <motion.div 
                  key={song.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => playSong(song, filteredSongs)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
                    currentSong?.id === song.id 
                      ? 'bg-gold/10 border border-gold/30' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentSong?.id === song.id && isPlaying ? 'bg-gold text-navy-900' : 'bg-navy-800 text-monsoon'
                    }`}>
                      <Play size={16} fill="currentColor" />
                    </div>
                    <div>
                      <h4 className={`font-bold ${currentSong?.id === song.id ? 'text-gold' : 'text-cream'}`}>
                        {song.title}
                      </h4>
                      <p className="text-xs text-monsoon">{song.artist}</p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-monsoon hidden md:block uppercase tracking-widest">
                    {song.year} • {song.mood}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-monsoon">
                No songs found. Try a different search.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Jukebox;
