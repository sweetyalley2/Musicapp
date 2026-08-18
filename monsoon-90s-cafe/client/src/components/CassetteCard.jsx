import { motion } from 'framer-motion';
import { Play, Pause, Disc } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { sfx } from '../utils/soundEffects';

const CassetteCard = ({ playlist, onClick, isActive = false }) => {
  const { isPlaying } = useMusicPlayer();
  const isTapeSpinning = isActive && isPlaying;

  const handleClick = (e) => {
    sfx.playCassetteInsert();
    if (onClick) onClick(e);
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={`cursor-pointer group relative w-full aspect-[1.7/1] rounded-xl p-2.5 transition-all select-none overflow-hidden ${
        isActive 
          ? 'bg-[#182030] border-2 border-[#e2a450] shadow-[0_12px_28px_rgba(0,0,0,0.8),0_0_20px_rgba(226,164,80,0.2)]' 
          : 'bg-[#0f1523] border border-white/10 hover:border-white/20 shadow-lg hover:shadow-2xl'
      }`}
    >
      {/* Mechanical Cassette Body Shell */}
      <div className="relative h-full w-full rounded-lg bg-[#080d18] border border-white/[0.06] p-2 flex flex-col justify-between overflow-hidden shadow-inner">
        
        {/* Top Screws & Header */}
        <div className="flex justify-between items-center px-1">
          <div className="w-2 h-2 rounded-full bg-[#334155] border border-[#64748b] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-black"></div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-[#060911] px-2 py-0.5 rounded border border-white/10">
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#e2a450]' : 'bg-[#64748b]'}`}></span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#d1c7b7] uppercase">
              {isActive ? 'INSERTED TAPE' : 'SIDE A'}
            </span>
          </div>

          <div className="w-2 h-2 rounded-full bg-[#334155] border border-[#64748b] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-black"></div>
          </div>
        </div>

        {/* Vintage Paper Inlay Label */}
        <div className="relative my-1 bg-[#f4eee2] text-[#0f172a] rounded-md px-3 py-2 border border-[#d1c7b7] shadow-sm flex flex-col justify-between overflow-hidden">
          {/* Subtle Vintage Accent Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9e753b] via-[#e2a450] to-[#1e293b]"></div>

          <div className="pt-0.5 text-center">
            <h3 className="font-vintage text-[#0f172a] font-bold text-sm truncate tracking-tight">
              {playlist.name || playlist.title}
            </h3>
            <p className="text-[9px] font-mono text-[#64748b] uppercase tracking-wider truncate mt-0.5">
              {playlist.theme || playlist.description || 'Monsoon Collection'}
            </p>
          </div>

          {/* Spool Viewing Window */}
          <div className="mt-1.5 bg-[#0b0f19] rounded p-1 border border-black/30 flex items-center justify-around relative overflow-hidden shadow-inner">
            
            {/* Left Spool */}
            <div className={`w-7 h-7 rounded-full bg-[#1e293b] border border-white/40 flex items-center justify-center relative ${isTapeSpinning ? 'animate-spin-slow' : ''}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="absolute w-full h-[1px] bg-white/30"></div>
              <div className="absolute h-full w-[1px] bg-white/30"></div>
            </div>

            {/* Magnetic Tape Ribbon Window */}
            <div className="w-16 h-4 bg-black/80 rounded border border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="w-12 h-1 bg-[#854d0e] rounded-full opacity-80"></div>
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[#e2a450]">
                  {isTapeSpinning ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
                </div>
              )}
            </div>

            {/* Right Spool */}
            <div className={`w-7 h-7 rounded-full bg-[#1e293b] border border-white/40 flex items-center justify-center relative ${isTapeSpinning ? 'animate-spin-slow' : ''}`}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#cbd5e1] flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="absolute w-full h-[1px] bg-white/30"></div>
              <div className="absolute h-full w-[1px] bg-white/30"></div>
            </div>
          </div>
        </div>

        {/* Bottom Screws & Track Count */}
        <div className="flex justify-between items-center px-1">
          <div className="w-2 h-2 rounded-full bg-[#334155] border border-[#64748b] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-black"></div>
          </div>
          
          <span className="text-[9px] font-mono text-[#8492a6] font-medium">
            {playlist.songs?.length || 10} Tracks • Type I (Normal)
          </span>

          <div className="w-2 h-2 rounded-full bg-[#334155] border border-[#64748b] flex items-center justify-center">
            <div className="w-1 h-0.5 bg-black"></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default CassetteCard;

