import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Music, CloudRain, Info, Radio, Menu, X, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();

  const links = [
    { path: '/', icon: <Coffee size={18} />, label: 'Kolkata' },
    { path: '/mumbai', icon: <CloudRain size={18} />, label: 'Mumbai' },
    { path: '/jukebox', icon: <Music size={18} />, label: 'Jukebox' },
    { path: '/radio', icon: <Radio size={18} />, label: 'Radio Mode' },
    { path: '/about', icon: <Info size={18} />, label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/kolkata')) return true;
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 md:px-8 md:py-4 bg-[#080d1a]/85 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F3C969] to-[#FDE68A] text-[#0b0f19] flex items-center justify-center shadow-[0_0_15px_rgba(243,201,105,0.4)] group-hover:scale-105 transition-transform">
              <Disc size={20} className={isPlaying ? "animate-spin-slow" : ""} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-vintage font-bold tracking-wider text-[#FFF8EB] group-hover:text-[#F3C969] transition-colors leading-tight">
                MONSOON 90s
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#94A3B8] font-semibold">
                Café Nostalgia
              </span>
            </div>
          </Link>

          {/* Center / Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#111728]/80 p-1.5 rounded-full border border-white/10 shadow-inner">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider font-ui transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#F3C969] to-[#FDE68A] text-[#0b0f19] font-bold shadow-[0_0_15px_rgba(243,201,105,0.3)]'
                      : 'text-[#CBD5E1] hover:text-[#FFF8EB] hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Live Mini Badge & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            {currentSong && (
              <div 
                onClick={togglePlay}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#172036] border border-[#F3C969]/30 text-xs text-[#FFF8EB] cursor-pointer hover:border-[#F3C969] transition-colors shadow-md"
                title="Toggle playback"
              >
                <div className="flex items-center gap-0.5">
                  <span className={`w-1 bg-[#F3C969] rounded-full h-3 ${isPlaying ? 'animate-[pulse_0.6s_infinite]' : 'h-1.5'}`}></span>
                  <span className={`w-1 bg-[#F3C969] rounded-full h-4 ${isPlaying ? 'animate-[pulse_0.8s_infinite_0.2s]' : 'h-1.5'}`}></span>
                  <span className={`w-1 bg-[#F3C969] rounded-full h-2.5 ${isPlaying ? 'animate-[pulse_0.5s_infinite_0.4s]' : 'h-1.5'}`}></span>
                </div>
                <span className="font-medium truncate max-w-[130px]">{currentSong.title}</span>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 text-[#FFF8EB] hover:bg-white/20 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[61px] left-0 right-0 z-40 md:hidden bg-[#0b0f19]/95 backdrop-blur-2xl border-b border-white/15 p-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {links.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                      active
                        ? 'bg-[#F3C969] text-[#0b0f19] font-bold shadow-md'
                        : 'text-[#CBD5E1] hover:text-[#FFF8EB] hover:bg-white/5'
                    }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
