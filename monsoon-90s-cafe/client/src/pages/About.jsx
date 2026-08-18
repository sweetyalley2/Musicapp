import { motion } from 'framer-motion';
import { Coffee, Music, Heart, Sparkles, CloudRain, Disc } from 'lucide-react';
import RainCanvas from '../components/RainCanvas';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 pb-36 px-4 sm:px-6 md:px-12 relative flex items-center justify-center"
    >
      <RainCanvas preset="light" />
      
      <div className="max-w-4xl mx-auto relative z-10 glass-panel p-6 sm:p-10 md:p-14 rounded-3xl border-t border-[#F3C969]/30 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F3C969]/10 text-[#F3C969] px-3.5 py-1.5 rounded-full border border-[#F3C969]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-3 shadow-md">
            <Sparkles size={13} />
            <span>Story & Memories</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-vintage font-bold text-[#FFF8EB] mb-3 text-glow">
            About Monsoon 90s Café
          </h1>
          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#F3C969] to-transparent mx-auto"></div>
        </div>

        {/* Story Paragraphs */}
        <div className="space-y-6 text-[#FFF8EB] font-ui text-base sm:text-lg leading-relaxed font-normal">
          <p className="text-backdrop">
            <strong className="text-[#F3C969] font-bold">Monsoon 90s Café</strong> is an immersive musical time capsule crafted to transport you back to the golden rainy evenings of 1990s India.
          </p>
          
          <p className="text-[#CBD5E1]">
            Whether you are sheltering from the thunderstorm in an old Kolkata tea stall listening to Akashvani radio, or watching the rain splash over streetlamps on Mumbai's Marine Drive, this application celebrates the immortal melodies, cassettes, and monsoon memories that defined a generation.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-[#111728]/80 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-lg">
              <Coffee size={24} className="text-[#F3C969] mb-2" />
              <h3 className="font-vintage font-bold text-[#FFF8EB] text-base">Kolkata Nostalgia</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Yellow cabs, Howrah rain, & warm cutting chai.</p>
            </div>

            <div className="bg-[#111728]/80 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-lg">
              <CloudRain size={24} className="text-[#F87171] mb-2" />
              <h3 className="font-vintage font-bold text-[#FFF8EB] text-base">Mumbai Monsoons</h3>
              <p className="text-xs text-[#94A3B8] mt-1">CRT TV rhythms, Irani cafés, & neon streetlights.</p>
            </div>

            <div className="bg-[#111728]/80 p-4 rounded-2xl border border-white/10 flex flex-col items-center text-center shadow-lg">
              <Disc size={24} className="text-[#F3C969] mb-2" />
              <h3 className="font-vintage font-bold text-[#FFF8EB] text-base">Retro Jukebox</h3>
              <p className="text-xs text-[#94A3B8] mt-1">Full 90s archive with single-click instant play.</p>
            </div>
          </div>

          {/* Instructions Box */}
          <div className="bg-[#0b0f19]/90 p-6 rounded-2xl border border-[#F3C969]/20 my-6 shadow-inner">
            <h3 className="font-vintage text-[#F3C969] text-lg font-bold mb-2 flex items-center gap-2">
              <Music size={18} /> How to Add Your Own Audio
            </h3>
            <p className="text-xs sm:text-sm text-[#CBD5E1] mb-3">
              To add your own audio tracks or local MP3 files:
            </p>
            <ol className="list-decimal pl-5 text-xs sm:text-sm space-y-1.5 text-[#94A3B8] font-mono">
              <li>Place MP3 files in <code className="text-[#F3C969] bg-black/40 px-1 py-0.5 rounded">client/public/audio/</code></li>
              <li>Add song details in <code className="text-[#F3C969] bg-black/40 px-1 py-0.5 rounded">server/data/songs.json</code></li>
              <li>Set the YouTube ID or Audio URL in the song item</li>
            </ol>
          </div>

          {/* Footer Heart */}
          <div className="flex justify-center items-center gap-2 pt-6 text-sm font-mono text-[#94A3B8] border-t border-white/10 font-medium">
            <span>Built with nostalgia, rain sounds,</span>
            <Heart size={16} className="text-[#F87171] fill-[#F87171] inline" />
            <span>and endless cups of Chai.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
