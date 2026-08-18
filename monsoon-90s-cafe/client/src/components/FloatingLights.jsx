import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FloatingLights = ({ count = 15 }) => {
  const [lights, setLights] = useState([]);

  useEffect(() => {
    const newLights = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setLights(newLights);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {lights.map(light => (
        <motion.div
          key={light.id}
          className="absolute rounded-full bg-gold/40 shadow-[0_0_15px_rgba(229,185,77,0.8)] blur-[1px]"
          style={{
            left: `${light.x}%`,
            top: `${light.y}%`,
            width: light.size,
            height: light.size,
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, Math.random() * 50 - 25, Math.random() * 50 - 25],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: light.duration,
            repeat: Infinity,
            delay: light.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default FloatingLights;
