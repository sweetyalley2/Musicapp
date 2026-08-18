import { motion } from 'framer-motion';

const CassetteCard = ({ playlist, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer group relative w-full aspect-[1.6/1] bg-gray-200 rounded-lg p-2 shadow-xl border-t-2 border-l-2 border-white/50 border-b-4 border-r-4 border-gray-400/50 flex flex-col"
    >
      <div className="flex-1 bg-white rounded flex items-center justify-center overflow-hidden border border-gray-300 relative">
        {/* Cassette Label Area */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-orange-50 border-8 border-white m-2 rounded flex flex-col items-center justify-center p-2">
          
          <h3 className="font-vintage text-cafe-900 font-bold text-center leading-tight">
            {playlist.title}
          </h3>
          
          <div className="mt-2 flex space-x-12 items-center">
            {/* Left Spool */}
            <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            {/* Right Spool */}
            <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-white flex items-center justify-center shadow-inner">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Tape window */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-10 border-2 border-gray-400 rounded bg-black/10 z-10 pointer-events-none flex items-center justify-center">
            <div className="w-16 h-1 bg-black/40"></div>
          </div>
        </div>
      </div>
      
      <div className="h-4 bg-gray-300 mt-2 rounded flex justify-between px-8">
         <div className="w-2 h-2 rounded-full bg-gray-400 mt-1"></div>
         <div className="w-2 h-2 rounded-full bg-gray-400 mt-1"></div>
      </div>
    </motion.div>
  );
};

export default CassetteCard;
