import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Music, CloudRain, Info, Radio, Menu, X, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import NaturalRainAmbience from './NaturalRainAmbience';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();

  const links = [
    { path: '/', icon: <Coffee size={15} />, label: 'Kolkata' },
    { path: '/mumbai', icon: <CloudRain size={15} />, label: 'Mumbai' },
    { path: '/jukebox', icon: <Music size={15} />, label: 'Jukebox' },
    { path: '/radio', icon: <Radio size={15} />, label: 'Radio' },
    { path: '/about', icon: <Info size={15} />, label: 'About' },
  ];

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/kolkata')) return true;
    return location.pathname === path;
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-40 px-4 py-3 md:px-8 md:py-3.5 bg-[#060911]/90 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#141c2e] border border-white/10 text-[#e2a450] flex items-center justify-center group-hover:border-[#e2a450]/40 transition-colors shadow-md">
              <Disc size={18} className={isPlaying ? "animate-spin-slow text-[#e2a450]" : "text-[#8492a6]"} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base md:text-lg font-vintage font-bold tracking-tight text-[#f4eee2] group-hover:text-[#e2a450] transition-colors">
                  Monsoon 90s
                </span>
                <span className="text-[9px] font-mono uppercase bg-white/5 text-[#8492a6] px-1.5 py-0.5 rounded border border-white/10">v2.4</span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#8492a6] font-medium">
                Nostalgia Audio Archive
              </span>
            </div>
          </Link>

          {/* Center / Desktop Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#0e1422] p-1 rounded-full border border-white/[0.08] shadow-inner">
            {links.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                    active
                      ? 'bg-[#e2a450] text-[#060911] font-bold shadow-md'
                      : 'text-[#8492a6] hover:text-[#f4eee2] hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Live Mini Badge & Ambience Control */}
          <div className="flex items-center gap-3">
            <NaturalRainAmbience />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 text-[#f4eee2] hover:bg-white/10 transition-colors focus:outline-none border border-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
