import { useEffect, useRef } from 'react';

const RainCanvas = ({ intensity = 'medium' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let drops = [];
    let splashes = [];

    const dropCounts = {
      light: 65,
      medium: 130,
      heavy: 240
    };

    const count = dropCounts[intensity] || 130;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initDrops();
    };

    const initDrops = () => {
      drops = [];
      splashes = [];
      for (let i = 0; i < count; i++) {
        // Layer 0 = background mist, Layer 1 = mid rain, Layer 2 = foreground heavy drop
        const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.8 ? 1 : 2;
        drops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          layer,
          speed: layer === 0 ? 8 + Math.random() * 4 : layer === 1 ? 16 + Math.random() * 6 : 24 + Math.random() * 8,
          length: layer === 0 ? 10 + Math.random() * 6 : layer === 1 ? 22 + Math.random() * 10 : 36 + Math.random() * 16,
          opacity: layer === 0 ? 0.12 : layer === 1 ? 0.28 : 0.45,
          width: layer === 0 ? 0.75 : layer === 1 ? 1.2 : 1.8,
          wind: -1.2 + Math.random() * 0.4
        });
      }
    };

    const createSplash = (x, y) => {
      if (splashes.length > 40) return;
      splashes.push({
        x,
        y,
        radius: 1,
        maxRadius: 4 + Math.random() * 8,
        opacity: 0.35
      });
    };

    let windTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      windTime += 0.01;
      const currentWind = Math.sin(windTime) * 0.8 - 0.8;

      // Draw Drops
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(215, 230, 255, ${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';

        const tailX = d.x - currentWind * (d.length * 0.2);
        const tailY = d.y - d.length;

        ctx.moveTo(d.x, d.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        d.y += d.speed;
        d.x += currentWind * (d.speed * 0.18);

        // Ground splash trigger
        if (d.y > height - 10) {
          if (d.layer >= 1 && Math.random() < 0.25) {
            createSplash(d.x, height - 6);
          }
          d.y = -20 - Math.random() * 30;
          d.x = Math.random() * (width + 200) - 100;
        }
      }

      // Draw Splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 2, s.radius * 0.7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(215, 230, 255, ${s.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        s.radius += 0.4;
        s.opacity -= 0.025;

        if (s.opacity <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-75"
    />
  );
};

export default RainCanvas;

