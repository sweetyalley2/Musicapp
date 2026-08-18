import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radio as RadioIcon, Volume2 } from 'lucide-react';

// Soft realistic vintage radio static crackle synthesizer using Web Audio API
const playRadioStatic = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const bufferSize = ctx.sampleRate * 0.12;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1100;
    filter.Q.value = 1.4;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.11);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(ctx.currentTime + 0.12);
  } catch (e) {}
};

const RadioDial = ({ onTune, currentFrequency = "98.3 FM", isPlaying = false }) => {
  const [rotation, setRotation] = useState(0);
  const [vuLevel, setVuLevel] = useState(15);
  const lastTuneTime = useRef(0);

  // Animate natural VU meter needle when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setVuLevel(40 + Math.floor(Math.random() * 45));
      }, 120);
    } else {
      setVuLevel(10);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const triggerTune = (newAngle) => {
    const now = Date.now();
    if (now - lastTuneTime.current > 280) {
      lastTuneTime.current = now;
      playRadioStatic();
      if (onTune) onTune();
    }
  };

  const handleDrag = (event, info) => {
    const newRot = Math.max(-75, Math.min(75, rotation + info.delta.x * 0.75));
    setRotation(newRot);
    triggerTune(newRot);
  };

  const handleDialClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const targetAngle = Math.max(-65, Math.min(65, (clickX / (rect.width / 2)) * 60));
    setRotation(targetAngle);
    playRadioStatic();
    if (onTune) onTune();
  };

  const needleAngle = rotation * 0.7;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-sm">
      {/* Analog Receiver Cabinet */}
      <div className="w-full bg-[#101622] rounded-2xl border border-white/10 shadow-2xl p-3.5 space-y-3">
        
        {/* Top Header Bar: Receiver Brand & VU Meter */}
        <div className="flex items-center justify-between px-1 pb-1 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <RadioIcon size={14} className="text-[#e2a450]" />
            <span className="font-mono text-[10px] tracking-widest text-[#8492a6] uppercase font-bold">
              Akashvani • Model 1994
            </span>
          </div>

          {/* Analog VU Meter */}
          <div className="flex items-center gap-2 bg-[#060911] px-2.5 py-1 rounded-md border border-white/10">
            <span className="text-[9px] font-mono text-[#8492a6]">VU</span>
            <div className="relative w-12 h-3 bg-black/60 rounded overflow-hidden flex items-end">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-100 rounded-sm opacity-90"
                style={{ width: `${vuLevel}%` }}
              ></div>
            </div>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 shadow-[0_0_6px_#ef4444] animate-pulse' : 'bg-gray-700'}`}></span>
          </div>
        </div>

        {/* Backlit Tuner Glass Window */}
        <div 
          onClick={handleDialClick}
          className="relative w-full h-28 bg-[#070a12] rounded-xl border border-[#e2a450]/30 p-2.5 flex flex-col justify-between overflow-hidden cursor-pointer shadow-inner group"
        >
          {/* Subtle Warm Tungsten Glow */}
          <div className={`absolute inset-0 bg-gradient-to-b from-[#e2a450]/15 via-[#e2a450]/5 to-transparent transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}></div>

          {/* Scale Legend */}
          <div className="relative z-10 flex justify-between items-center text-[9px] font-mono text-[#8492a6] px-1">
            <span>FM (MHz)</span>
            <span className="text-[#e2a450] font-bold tracking-wider">{currentFrequency}</span>
            <span>AM (x10 kHz)</span>
          </div>

          {/* Frequency Ruler */}
          <div className="relative z-10 w-full">
            <div className="flex justify-between items-center px-1 text-[10px] font-mono font-semibold text-[#f4eee2]/80">
              <span>88</span>
              <span>92</span>
              <span className="text-[#e2a450] font-bold">98.3</span>
              <span>102</span>
              <span>108</span>
            </div>
            
            {/* Tick Marks */}
            <div className="flex justify-between items-end h-4 pt-1">
              {[...Array(25)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-[1px] ${i % 6 === 0 ? 'h-3.5 bg-[#e2a450]' : i % 2 === 0 ? 'h-2 bg-[#8492a6]/60' : 'h-1.5 bg-white/20'}`}
                ></div>
              ))}
            </div>
          </div>

          {/* Red Tuning Indicator Needle */}
          <div 
            className="absolute bottom-0 w-[2px] h-24 bg-red-500 origin-bottom transition-transform duration-150 ease-out z-20 shadow-[0_0_6px_#ef4444]"
            style={{ transform: `translateX(-50%) rotate(${needleAngle}deg)`, left: '50%' }}
          >
            <div className="w-2 h-2 rounded-full bg-amber-300 -ml-[3px] shadow-[0_0_6px_#f59e0b]"></div>
          </div>

          {/* Bottom Tuner Info */}
          <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-[#8492a6] px-1">
            <span>KOLKATA BROADCAST</span>
            <span className="uppercase text-[#e2a450]/90">Stereo High-Fidelity</span>
          </div>
        </div>

        {/* Lower Control Deck: Knobs & Preset Buttons */}
        <div className="flex items-center justify-between pt-1">
          {/* Quick Frequency Step Buttons */}
          <div className="flex flex-col gap-1.5">
            <button 
              type="button"
              onClick={() => {
                setRotation((prev) => (prev <= -35 ? 45 : prev - 25));
                playRadioStatic();
                if (onTune) onTune();
              }}
              className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#090d16] hover:bg-[#e2a450] text-[#e2a450] hover:text-[#060911] rounded-lg border border-white/10 active:scale-95 transition-all shadow-sm"
            >
              ◀ Seek Left
            </button>
            <button 
              type="button"
              onClick={() => {
                setRotation((prev) => (prev >= 35 ? -45 : prev + 25));
                playRadioStatic();
                if (onTune) onTune();
              }}
              className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#090d16] hover:bg-[#e2a450] text-[#e2a450] hover:text-[#060911] rounded-lg border border-white/10 active:scale-95 transition-all shadow-sm"
            >
              Seek Right ▶
            </button>
          </div>

          {/* Analog Rotary Tuning Knob */}
          <div className="flex flex-col items-center">
            <motion.div 
              drag="x"
              dragConstraints={{ left: -50, right: 50 }}
              onDrag={handleDrag}
              onClick={() => {
                setRotation((prev) => (prev + 30 > 60 ? -50 : prev + 30));
                playRadioStatic();
                if (onTune) onTune();
              }}
              animate={{ rotate: rotation }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-b from-[#242e42] to-[#0d121c] border-2 border-white/20 shadow-[0_6px_16px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
              title="Drag or click to tune station"
            >
              {/* Dial Notch */}
              <div className="w-1 h-10 bg-[#e2a450] rounded-full shadow-[0_0_4px_#e2a450]"></div>
              <div className="absolute top-1.5 w-1.5 h-1.5 bg-white rounded-full"></div>
            </motion.div>
            <span className="text-[9px] font-mono text-[#8492a6] uppercase tracking-wider mt-1">
              Tune Knob
            </span>
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-end gap-1">
            <div className={`px-2.5 py-1 rounded-md border text-[9px] font-mono font-bold tracking-wider ${
              isPlaying 
                ? 'bg-red-950/80 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' 
                : 'bg-black/40 border-white/10 text-gray-500'
            }`}>
              {isPlaying ? '● ON AIR' : '○ STANDBY'}
            </div>
            <span className="text-[9px] font-mono text-[#8492a6]">FM STEREO</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RadioDial;


