import { Link, useLocation } from 'react-router-dom';
import { Coffee, Music, CloudRain, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  const links = [
    { path: '/', icon: <CloudRain size={20} />, label: 'Home' },
    { path: '/kolkata', icon: <Coffee size={20} />, label: 'Kolkata' },
    { path: '/mumbai', icon: <Info size={20} />, label: 'Mumbai' }, // Using Info as placeholder, could use Building
    { path: '/jukebox', icon: <Music size={20} />, label: 'Jukebox' },
    { path: '/about', icon: <Info size={20} />, label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 px-4 py-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-navy-900/80 to-transparent backdrop-blur-[2px]">
      <Link to="/" className="text-xl md:text-2xl font-vintage font-bold tracking-widest text-cream hover:text-gold transition-colors text-glow">
        MONSOON 90s
      </Link>
      
      <div className="hidden md:flex space-x-8">
        {links.map((link) => (
          <Link 
            key={link.path} 
            to={link.path}
            className={`flex items-center space-x-2 text-sm uppercase tracking-wider font-ui transition-all ${
              location.pathname === link.path ? 'text-gold text-glow' : 'text-cream/70 hover:text-cream'
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
      
      {/* Mobile nav placeholder - in a real app, this would be a hamburger menu */}
      <div className="md:hidden flex space-x-4">
        <Link to="/kolkata"><Coffee size={24} className="text-cream" /></Link>
        <Link to="/jukebox"><Music size={24} className="text-cream" /></Link>
      </div>
    </nav>
  );
};

export default Navbar;
