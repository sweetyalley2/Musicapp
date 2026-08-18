import { motion } from 'framer-motion';
import { Sparkles, Disc } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#070a12] flex flex-col items-center justify-center text-[#FFF8EB] selection:bg-[#F3C969] selection:text-[#0b0f19]">
      <div className="film-grain"></div>
      
      {/* Background ambient radial light */}
      <div className="absolute w-96 h-96 bg-[#F3C969]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10 p-6 flex flex-col items-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F3C969] to-[#FDE68A] text-[#0b0f19] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(243,201,105,0.5)]">
          <Disc size={30} className="animate-spin-slow" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-vintage font-bold text-[#FFF8EB] tracking-widest mb-1 text-glow">
          MONSOON
        </h1>
        <h2 className="text-2xl sm:text-4xl font-vintage font-bold text-[#F3C969] mb-8 text-glow">
          90s CAFÉ
        </h2>
        
        {/* Animated Sound Equalizer Waves */}
        <div className="flex justify-center items-end gap-1.5 h-12 mb-6">
          <motion.div 
            animate={{ height: ["12px", "44px", "16px"] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 bg-[#F3C969] rounded-full shadow-[0_0_8px_#F3C969]"
          />
          <motion.div 
            animate={{ height: ["16px", "48px", "24px"] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
            className="w-1.5 bg-[#FFF8EB] rounded-full"
          />
          <motion.div 
            animate={{ height: ["24px", "52px", "12px"] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="w-1.5 bg-[#F3C969] rounded-full shadow-[0_0_8px_#F3C969]"
          />
          <motion.div 
            animate={{ height: ["14px", "38px", "20px"] }}
            transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-1.5 bg-[#FFF8EB] rounded-full"
          />
          <motion.div 
            animate={{ height: ["10px", "42px", "14px"] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-1.5 bg-[#F3C969] rounded-full shadow-[0_0_8px_#F3C969]"
          />
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
          <Sparkles size={12} className="text-[#F3C969]" />
          <span>Tuning the Akashvani radio...</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
