import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import RainCanvas from '../components/RainCanvas';
import FloatingLights from '../components/FloatingLights';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-navy-900"
    >
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 opacity-80"></div>
      
      {/* Ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <RainCanvas preset="light" />
      <FloatingLights count={20} />
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl w-full">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-vintage text-cream tracking-wider mb-2 text-glow">
            MONSOON
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-vintage text-gold mb-8 text-glow">
            90s CAFÉ
          </h2>
          
          <p className="text-monsoon md:text-xl font-ui italic mb-16 max-w-xl mx-auto">
            "Some songs don't get old.<br/>They just wait for the rain."
          </p>
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col sm:flex-row gap-6 w-full justify-center"
        >
          <Link to="/kolkata" className="group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card px-8 py-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group-hover:bg-cafe-900/60 group-hover:border-gold/30"
            >
              <span className="text-4xl mb-2">☕</span>
              <h3 className="font-vintage text-xl text-cream group-hover:text-gold transition-colors">
                KOLKATA NIGHTS
              </h3>
              <p className="text-xs text-monsoon uppercase tracking-widest font-ui">
                Old radios & tea stalls
              </p>
            </motion.div>
          </Link>

          <Link to="/mumbai" className="group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-card px-8 py-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-colors group-hover:bg-navy-800/80 group-hover:border-gold/30"
            >
              <span className="text-4xl mb-2">🌧️</span>
              <h3 className="font-vintage text-xl text-cream group-hover:text-gold transition-colors">
                MUMBAI MONSOON
              </h3>
              <p className="text-xs text-monsoon uppercase tracking-widest font-ui">
                Heavy rain & neon signs
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
