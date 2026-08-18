import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Soft realistic vintage radio static crackle synthesizer using Web Audio API
const playRadioStatic = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const bufferSize = ctx.sampleRate * 0.15; // 150ms static burst
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.18; // soft white noise
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass filter for authentic AM/FM transistor radio warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.2;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();
    whiteNoise.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // AudioContext blocked or unsupported, silently ignore
  }
};

const STATIONS = [
  { freq: '91.9 FM', name: 'Kolkata Gold' },
  { freq: '98.3 FM', name: 'Akashvani Bangla' },
  { freq: '102.6 FM', name: 'Vividh Bharati' },
  { freq: '107.0 FM', name: 'Monsoon Classics' },
];

const RadioDial = ({ onTune, currentFrequency = "98.3 FM", isPlaying = false }) => {
  const [rotation, setRotation] = useState(0);
  const lastTuneTime = useRef(0);

  const triggerTune = (newAngle) => {
    const now = Date.now();
    if (now - lastTuneTime.current > 300) {
      lastTuneTime.current = now;
      playRadioStatic();
      if (onTune) onTune();
    }
  };

  const handleDrag = (event, info) => {
    const newRot = Math.max(-80, Math.min(80, rotation + info.delta.x * 0.8));
    setRotation(newRot);
    triggerTune(newRot);
  };

  const handleDialClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left - rect.width / 2;
    const targetAngle = Math.max(-70, Math.min(70, (clickX / (rect.width / 2)) * 60));
    setRotation(targetAngle);
    playRadioStatic();
    if (onTune) onTune();
  };

  const needleAngle = rotation * 0.75;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xs">
      {/* Vintage Radio Display Glass */}
      <div 
        onClick={handleDialClick}
        className="relative w-64 h-32 bg-gradient-to-b from-[#1c130d] via-[#120d09] to-[#0a0705] rounded-t-3xl border-4 border-b-0 border-[#F3C969]/50 flex flex-col items-center justify-between p-3 overflow-hidden shadow-[inset_0_4px_20px_rgba(0,0,0,0.9)] cursor-pointer group"
      >
        {/* Warm Backlight Glow when Playing */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#F3C969]/15 via-[#F3C969]/5 to-transparent pointer-events-none transition-opacity duration-700 ${isPlaying ? 'opacity-100' : 'opacity-40'}`}></div>

        {/* Vintage Frequency Ruler */}
        <div className="relative z-10 w-full flex justify-between items-center px-2 pt-1">
          <span className="text-[10px] font-mono text-[#F3C969]/80 font-bold tracking-wider">88</span>
          <span className="text-[10px] font-mono text-[#F3C969]/80 font-bold tracking-wider">92</span>
          <span className="text-[11px] font-mono text-[#F3C969] font-bold tracking-wider underline">98</span>
          <span className="text-[10px] font-mono text-[#F3C969]/80 font-bold tracking-wider">102</span>
          <span className="text-[10px] font-mono text-[#F3C969]/80 font-bold tracking-wider">108</span>
        </div>

        {/* Dial Ticks */}
        <div className="relative z-10 w-full flex justify-between items-end px-3 h-5 border-b border-[#F3C969]/30 pb-1">
          {[...Array(17)].map((_, i) => (
            <div 
              key={i} 
              className={`w-0.5 ${i % 4 === 0 ? 'h-3 bg-[#F3C969]' : 'h-1.5 bg-[#F3C969]/40'} rounded-full`}
            ></div>
          ))}
        </div>

        {/* Radio Tuning Red Needle */}
        <div 
          className="absolute bottom-0 w-1 h-28 bg-gradient-to-t from-red-600 to-amber-400 origin-bottom transition-transform duration-150 ease-out z-20 shadow-[0_0_8px_#ef4444]"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <div className="w-2.5 h-2.5 bg-amber-300 rounded-full -ml-[3px] shadow-[0_0_10px_#f59e0b]"></div>
        </div>

        {/* Vintage Tuning Status Banner */}
        <div className="relative z-10 w-full flex items-center justify-between px-2 pb-1 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse' : 'bg-gray-600'}`}></span>
            <span className="text-[#F3C969] font-bold">AKASHVANI</span>
          </div>
          <span className="text-amber-200/90 font-bold tracking-wider">MW / FM 90s</span>
        </div>
      </div>

      {/* Radio Base & Tuning Knob */}
      <div className="relative w-72 bg-[#2d1c19] border-4 border-t-2 border-[#422923] rounded-b-2xl p-3 flex items-center justify-between shadow-2xl">
        {/* Preset Quick Buttons */}
        <div className="flex flex-col gap-1.5">
          <button 
            type="button"
            onClick={() => {
              setRotation((prev) => (prev <= -40 ? 50 : prev - 30));
              playRadioStatic();
              if (onTune) onTune();
            }}
            className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1a110f] hover:bg-[#F3C969] text-[#F3C969] hover:text-[#0b0f19] rounded-lg border border-[#F3C969]/30 active:scale-95 transition-all shadow-md"
          >
            ◀ Tune Prev
          </button>
          <button 
            type="button"
            onClick={() => {
              setRotation((prev) => (prev >= 40 ? -50 : prev + 30));
              playRadioStatic();
              if (onTune) onTune();
            }}
            className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[#1a110f] hover:bg-[#F3C969] text-[#F3C969] hover:text-[#0b0f19] rounded-lg border border-[#F3C969]/30 active:scale-95 transition-all shadow-md"
          >
            Tune Next ▶
          </button>
        </div>

        {/* The Vintage Knob */}
        <div className="flex flex-col items-center">
          <motion.div 
            drag="x"
            dragConstraints={{ left: -60, right: 60 }}
            onDrag={handleDrag}
            onClick={() => {
              setRotation((prev) => (prev + 35 > 70 ? -60 : prev + 35));
              playRadioStatic();
              if (onTune) onTune();
            }}
            animate={{ rotate: rotation }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-gradient-to-br from-amber-800 via-amber-950 to-stone-900 rounded-full border-4 border-[#F3C969]/60 shadow-[0_4px_15px_rgba(0,0,0,0.8)] flex items-center justify-center cursor-grab active:cursor-grabbing relative"
            title="Drag or click to tune station"
          >
            {/* Knob Grip Ribs */}
            <div className="w-1.5 h-10 bg-[#F3C969] rounded-full shadow-[0_0_6px_#F3C969]"></div>
            <div className="absolute top-1 w-2 h-2 bg-white rounded-full opacity-80"></div>
          </motion.div>
          <span className="text-[9px] font-mono text-[#94A3B8] uppercase tracking-widest mt-1">Rotate Knob</span>
        </div>

        {/* ON AIR Indicator Badge */}
        <div className="flex flex-col items-end gap-1">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded border ${isPlaying ? 'bg-red-950/80 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-black/40 border-gray-700 text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-gray-600'}`}></span>
            <span className="text-[9px] font-mono font-bold tracking-wider">ON AIR</span>
          </div>
          <span className="text-[10px] font-mono text-[#F3C969] font-semibold">{currentFrequency}</span>
        </div>
      </div>
    </div>
  );
};

export default RadioDial;

