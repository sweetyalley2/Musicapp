import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-navy-900 flex flex-col items-center justify-center">
      <div className="film-grain"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="text-center relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-vintage text-cream tracking-widest mb-4 text-glow">
          MONSOON
        </h1>
        <h2 className="text-2xl md:text-4xl font-vintage text-gold mb-12 text-glow">
          90s CAFÉ
        </h2>
        
        <div className="flex justify-center items-center gap-4">
          <motion.div 
            animate={{ height: ["10px", "40px", "10px"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 bg-cream/50 rounded-full"
          />
          <motion.div 
            animate={{ height: ["10px", "50px", "10px"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="w-2 bg-gold/70 rounded-full"
          />
          <motion.div 
            animate={{ height: ["10px", "30px", "10px"] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="w-2 bg-cream/50 rounded-full"
          />
        </div>
        
        <p className="mt-8 font-ui text-sm text-monsoon uppercase tracking-widest">
          Tuning the radio...
        </p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
