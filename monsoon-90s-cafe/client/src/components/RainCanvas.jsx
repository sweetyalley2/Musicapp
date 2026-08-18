import { useEffect, useRef } from 'react';

const PRESETS = {
  kolkata: { count: 80, speed: 1.5, angle: 0.1, length: 15, color: 'rgba(165, 167, 176, 0.4)' },
  mumbai: { count: 150, speed: 3.5, angle: 0.3, length: 25, color: 'rgba(29, 39, 69, 0.6)' },
  storm: { count: 250, speed: 5, angle: 0.5, length: 30, color: 'rgba(255, 255, 255, 0.5)' },
  light: { count: 40, speed: 1, angle: 0.05, length: 10, color: 'rgba(245, 233, 208, 0.3)' }
};

const RainCanvas = ({ preset = 'mumbai' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let raindrops = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const settings = PRESETS[preset] || PRESETS.mumbai;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initRain();
    };

    const initRain = () => {
      raindrops = [];
      for (let i = 0; i < settings.count; i++) {
        raindrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          l: Math.random() * settings.length + 10,
          xs: Math.random() * 0.5 + settings.angle,
          ys: Math.random() * 1.5 + settings.speed
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = settings.color;
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i];
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.l * drop.xs, drop.y + drop.l * drop.ys);
        
        drop.x += drop.xs * 5;
        drop.y += drop.ys * 5;
        
        if (drop.x > width || drop.y > height) {
          drop.x = Math.random() * width;
          drop.y = -20;
        }
      }
      ctx.stroke();
      
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [preset]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-70 mix-blend-screen"
    />
  );
};

export default RainCanvas;
