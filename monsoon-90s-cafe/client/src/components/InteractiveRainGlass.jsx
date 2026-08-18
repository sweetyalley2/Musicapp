import { useEffect, useRef } from 'react';

const InteractiveRainGlass = ({ intensity = 'medium' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    let rainLines = [];
    let windowDroplets = [];
    let interactiveSplashes = [];

    const dropCounts = {
      light: { lines: 50, windowDrops: 25 },
      medium: { lines: 110, windowDrops: 45 },
      heavy: { lines: 200, windowDrops: 80 }
    };

    const count = dropCounts[intensity] || dropCounts.medium;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      rainLines = [];
      windowDroplets = [];
      interactiveSplashes = [];

      // Falling raindrops (3D multi-plane depth)
      for (let i = 0; i < count.lines; i++) {
        const layer = Math.random() < 0.35 ? 0 : Math.random() < 0.75 ? 1 : 2;
        rainLines.push({
          x: Math.random() * width,
          y: Math.random() * height,
          layer,
          speed: layer === 0 ? 10 + Math.random() * 4 : layer === 1 ? 18 + Math.random() * 6 : 28 + Math.random() * 10,
          length: layer === 0 ? 12 + Math.random() * 6 : layer === 1 ? 24 + Math.random() * 10 : 42 + Math.random() * 18,
          opacity: layer === 0 ? 0.12 : layer === 1 ? 0.26 : 0.42,
          width: layer === 0 ? 0.8 : layer === 1 ? 1.2 : 1.8
        });
      }

      // Condensation water droplets on glass pane sliding down
      for (let i = 0; i < count.windowDrops; i++) {
        windowDroplets.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1.5 + Math.random() * 2.5,
          speed: 0.2 + Math.random() * 0.8,
          opacity: 0.25 + Math.random() * 0.3,
          trail: []
        });
      }
    };

    const addSplash = (x, y, isClick = false) => {
      if (interactiveSplashes.length > 50) return;
      interactiveSplashes.push({
        x,
        y,
        radius: 2,
        maxRadius: isClick ? 24 + Math.random() * 16 : 8 + Math.random() * 10,
        opacity: isClick ? 0.6 : 0.35,
        growth: isClick ? 1.2 : 0.6
      });
    };

    const handlePointerMove = (e) => {
      if (Math.random() < 0.3) {
        addSplash(e.clientX, e.clientY, false);
      }
    };

    const handlePointerDown = (e) => {
      addSplash(e.clientX, e.clientY, true);
    };

    let windTime = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      windTime += 0.008;
      const windOffset = Math.sin(windTime) * 0.6 - 0.5;

      // 1. Draw Falling Rain Drops
      for (let i = 0; i < rainLines.length; i++) {
        const d = rainLines[i];
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(215, 232, 255, ${d.opacity})`;
        ctx.lineWidth = d.width;
        ctx.lineCap = 'round';

        const tailX = d.x - windOffset * (d.length * 0.25);
        const tailY = d.y - d.length;

        ctx.moveTo(d.x, d.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        d.y += d.speed;
        d.x += windOffset * (d.speed * 0.16);

        if (d.y > height - 10) {
          if (d.layer >= 1 && Math.random() < 0.2) {
            addSplash(d.x, height - 6, false);
          }
          d.y = -30;
          d.x = Math.random() * (width + 200) - 100;
        }
      }

      // 2. Draw Window Glass Condensation Droplets sliding slowly
      for (let i = 0; i < windowDroplets.length; i++) {
        const w = windowDroplets[i];

        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 235, 255, ${w.opacity})`;
        ctx.fill();

        // Subtle specular highlight on droplet
        ctx.beginPath();
        ctx.arc(w.x - w.radius * 0.3, w.y - w.radius * 0.3, w.radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        w.y += w.speed;
        if (w.y > height + 10) {
          w.y = -10;
          w.x = Math.random() * width;
        }
      }

      // 3. Draw Interactive Cursor Splashes & Impact Rings
      for (let i = interactiveSplashes.length - 1; i >= 0; i--) {
        const s = interactiveSplashes[i];

        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.8, s.radius * 0.8, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(226, 164, 80, ${s.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        s.radius += s.growth;
        s.opacity -= 0.02;

        if (s.opacity <= 0 || s.radius >= s.maxRadius) {
          interactiveSplashes.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-10 opacity-80"
    />
  );
};

export default InteractiveRainGlass;
