import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RainCanvas from '../components/RainCanvas';
import FloatingLights from '../components/FloatingLights';
import { Coffee, CloudRain, Disc, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#080d1a] px-4 py-20"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#111728] to-[#0b0f19] opacity-90"></div>
      
      {/* Ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F3C969]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <RainCanvas preset="light" />
      <FloatingLights count={18} />
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl w-full">
        
        <div className="inline-flex items-center gap-2 bg-[#F3C969]/10 text-[#F3C969] px-4 py-1.5 rounded-full border border-[#F3C969]/30 text-xs font-mono font-semibold uppercase tracking-widest mb-6 shadow-lg">
          <Sparkles size={14} />
          <span>Nostalgic 1990s Monsoon Experience</span>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-vintage font-bold text-[#FFF8EB] tracking-wider mb-2 text-glow">
            MONSOON
          </h1>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-vintage font-bold text-[#F3C969] mb-6 text-glow">
            90s CAFÉ
          </h2>
          
          <p className="text-[#CBD5E1] text-base sm:text-xl font-ui italic mb-12 max-w-xl mx-auto font-normal leading-relaxed">
            "Some songs don't get old.<br/>They just wait for the rain."
          </p>
        </motion.div>

        {/* Feature Navigation Cards */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl justify-center"
        >
          <Link to="/kolkata" className="group">
            <div className="glass-card glass-card-hover px-6 py-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-center border-t border-[#F3C969]/30 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#F3C969]/15 text-[#F3C969] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Coffee size={24} />
              </div>
              <h3 className="font-vintage font-bold text-lg text-[#FFF8EB] group-hover:text-[#F3C969] transition-colors">
                Kolkata Nights
              </h3>
              <p className="text-xs text-[#94A3B8] font-ui font-medium">
                Akashvani radio, yellow cabs & tea stalls
              </p>
            </div>
          </Link>

          <Link to="/mumbai" className="group">
            <div className="glass-card glass-card-hover px-6 py-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-center border-t border-[#F87171]/30 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#F87171]/15 text-[#F87171] flex items-center justify-center group-hover:scale-110 transition-transform">
                <CloudRain size={24} />
              </div>
              <h3 className="font-vintage font-bold text-lg text-[#FFF8EB] group-hover:text-[#F87171] transition-colors">
                Mumbai Monsoon
              </h3>
              <p className="text-xs text-[#94A3B8] font-ui font-medium">
                Heavy rain, Irani cafés & CRT TV hits
              </p>
            </div>
          </Link>

          <Link to="/jukebox" className="group">
            <div className="glass-card glass-card-hover px-6 py-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-center border-t border-[#F3C969]/30 shadow-xl h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#F3C969]/15 text-[#F3C969] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Disc size={24} />
              </div>
              <h3 className="font-vintage font-bold text-lg text-[#FFF8EB] group-hover:text-[#F3C969] transition-colors">
                Grand Jukebox
              </h3>
              <p className="text-xs text-[#94A3B8] font-ui font-medium">
                Search & play 90s cassettes instantly
              </p>
            </div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
