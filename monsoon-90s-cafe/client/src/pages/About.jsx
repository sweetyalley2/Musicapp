import { motion } from 'framer-motion';
import { Coffee, Music, Heart } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-32 px-4 md:px-12 relative flex items-center justify-center"
    >
      <RainCanvas preset="light" />
      
      <div className="max-w-3xl mx-auto relative z-10 glass-card p-8 md:p-12 rounded-3xl border-t border-gold/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-vintage text-gold mb-4 text-glow">About the Café</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto"></div>
        </div>

        <div className="space-y-6 text-cream/90 font-ui leading-relaxed">
          <p>
            Monsoon 90s Café is a conceptual nostalgic music experience designed to transport you back to the rainy evenings of 1990s India.
          </p>
          
          <p>
            Whether you're listening to the radio in an old Kolkata tea stall or watching rain hit the window of a Mumbai apartment, this space is built to celebrate the golden era of Bollywood melodies and the universal feeling of monsoon nostalgia.
          </p>

          <div className="bg-navy-900/50 p-6 rounded-xl border border-white/5 my-8">
            <h3 className="font-vintage text-gold text-xl mb-4 flex items-center gap-2">
              <Music size={20} /> How to Add Audio
            </h3>
            <p className="text-sm text-monsoon mb-4">
              To keep this project compliant with copyright laws, the current tracks contain metadata only. If you wish to host and add your own legally licensed audio files:
            </p>
            <ol className="list-decimal pl-5 text-sm space-y-2 text-monsoon">
              <li>Place your audio files (e.g., MP3) in the <code>client/public/audio/</code> directory (create it if needed) or host them externally.</li>
              <li>Open <code>server/data/songs.json</code></li>
              <li>Update the <code>audioUrl</code> field for each song (e.g., <code>"audioUrl": "/audio/song.mp3"</code> or an external URL).</li>
            </ol>
          </div>

          <div className="flex justify-center items-center gap-2 pt-8 text-monsoon border-t border-white/10">
            <span>Built with</span>
            <Heart size={16} className="text-neonred" />
            <span>and a lot of Chai</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
