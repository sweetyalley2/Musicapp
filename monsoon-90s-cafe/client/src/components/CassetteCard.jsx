import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

const CassetteCard = ({ playlist, onClick, isActive = false }) => {
  const { isPlaying } = useMusicPlayer();
  const isTapeSpinning = isActive && isPlaying;

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`cursor-pointer group relative w-full aspect-[1.65/1] rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all select-none overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-br from-[#422925] via-[#2d1c19] to-[#1f1412] border-2 border-[#F3C969] ring-2 ring-[#F3C969]/30 shadow-[0_15px_35px_rgba(243,201,105,0.3)]' 
          : 'bg-gradient-to-br from-[#1e293b] via-[#111728] to-[#0b0f19] border border-white/15 hover:border-[#F3C969]/50 shadow-xl'
      }`}
    >
      {/* Tape Body Texture */}
      <div className="relative h-full w-full rounded-xl bg-[#0f172a]/90 border border-white/10 p-2.5 flex flex-col justify-between overflow-hidden shadow-inner">
        
        {/* Top Notch & Screws */}
        <div className="flex justify-between items-center px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600 border border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-gray-900"></div>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#F3C969] uppercase bg-black/40 px-2 py-0.5 rounded border border-[#F3C969]/20">
            SIDE A • STEREO
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600 border border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-gray-900"></div>
          </div>
        </div>

        {/* Cassette Paper Label (Cream Vintage Paper with Bold High-Contrast Text) */}
        <div className="relative my-1.5 bg-[#FFF8EB] rounded-lg p-2.5 border-2 border-[#2d1c19] shadow-md flex flex-col justify-between overflow-hidden">
          
          {/* Decorative 90s vintage stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-indigo-600"></div>

          {/* Cassette Title */}
          <div className="pt-1 text-center">
            <h3 className="font-vintage text-[#2d1c19] font-bold text-sm sm:text-base leading-tight truncate tracking-tight">
              {playlist.title}
            </h3>
            <p className="text-[10px] font-ui font-semibold text-[#5c3933] uppercase tracking-wider mt-0.5">
              {playlist.subtitle || 'Monsoon 90s Collection'}
            </p>
          </div>

          {/* Tape Spool Window */}
          <div className="mt-2 bg-[#111728] rounded-md p-1.5 border border-gray-700 flex items-center justify-around relative overflow-hidden shadow-inner">
            
            {/* Left Spool */}
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center shadow-md relative ${isTapeSpinning ? 'animate-spin-slow' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="absolute w-full h-0.5 bg-white/40"></div>
              <div className="absolute h-full w-0.5 bg-white/40"></div>
            </div>

            {/* Center Clear Window with Tape Ribbon */}
            <div className="w-14 sm:w-20 h-5 bg-black/70 rounded border border-gray-600 flex items-center justify-center relative overflow-hidden">
              <div className="w-10 sm:w-14 h-1 bg-amber-700/80 rounded-full shadow-sm"></div>
              {/* Play / Active Icon in center window */}
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[#F3C969]">
                  {isTapeSpinning ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                </div>
              )}
            </div>

            {/* Right Spool */}
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center shadow-md relative ${isTapeSpinning ? 'animate-spin-slow' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-1 h-1 bg-black rounded-full"></div>
              </div>
              <div className="absolute w-full h-0.5 bg-white/40"></div>
              <div className="absolute h-full w-0.5 bg-white/40"></div>
            </div>
          </div>
        </div>

        {/* Bottom Screws & Tape Header */}
        <div className="flex justify-between items-center px-1">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600 border border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-gray-900"></div>
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase font-semibold">
            {playlist.songs?.length || 10} Tracks
          </span>
          <div className="w-2.5 h-2.5 rounded-full bg-gray-600 border border-gray-400 flex items-center justify-center">
            <div className="w-1.5 h-0.5 bg-gray-900"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CassetteCard;
