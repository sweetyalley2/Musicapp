import { useState } from 'react';
import { motion } from 'framer-motion';

const RadioDial = ({ onTune }) => {
  const [rotation, setRotation] = useState(0);

  const handleDrag = (event, info) => {
    // Simple rotation calculation based on drag x
    const newRot = rotation + info.delta.x;
    setRotation(newRot);
    
    // Call onTune occasionally when rotating
    if (Math.abs(newRot % 30) < 5 && onTune) {
      onTune();
    }
  };

  return (
    <div className="relative w-48 h-24 bg-cafe-900 rounded-t-full border-4 border-b-0 border-gold/40 flex items-end justify-center overflow-hidden shadow-2xl">
      {/* Dial markings */}
      <div className="absolute top-2 w-full flex justify-around px-4 opacity-50">
        {[...Array(9)].map((_, i) => (
          <div key={i} className={`w-0.5 h-${i % 2 === 0 ? '4' : '2'} bg-cream`}></div>
        ))}
      </div>
      
      {/* The Knob */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        onDrag={handleDrag}
        animate={{ rotate: rotation }}
        className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full mb-[-32px] border-4 border-gray-700 shadow-inner flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
      >
        <div className="w-2 h-8 bg-gray-800 rounded-full mb-4"></div>
      </motion.div>
      
      {/* Indicator line */}
      <div 
        className="absolute bottom-0 w-0.5 h-16 bg-neonred origin-bottom transition-transform duration-100 ease-out z-0"
        style={{ transform: `rotate(${rotation * 0.5}deg)` }}
      ></div>
    </div>
  );
};

export default RadioDial;
