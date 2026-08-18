import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Volume2, VolumeX, Zap, Sliders } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

class RainSynthesizer {
  constructor() {
    this.ctx = null;
    this.noiseNode = null;
    this.filterNode = null;
    this.gainNode = null;
    this.isPlaying = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  start(volume = 0.35, intensity = 'medium') {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.setVolume(volume);
      this.setIntensity(intensity);
      return;
    }

    // Generate Pink / Rain Noise Buffer (5 seconds looped)
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = buffer;
    this.noiseNode.loop = true;

    // Filter to shape rain tone
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = intensity === 'light' ? 900 : intensity === 'heavy' ? 2400 : 1500;
    this.filterNode.Q.value = 1.0;

    // Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume * 0.4, this.ctx.currentTime);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.noiseNode.start();
    this.isPlaying = true;
  }

  setVolume(vol) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(vol * 0.4, this.ctx.currentTime, 0.08);
    }
  }

  setIntensity(intensity) {
    if (this.filterNode && this.ctx) {
      const freq = intensity === 'light' ? 900 : intensity === 'heavy' ? 2400 : 1500;
      this.filterNode.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    try {
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      }
    } catch (e) {}
    this.isPlaying = false;
  }
}

const rainSynth = new RainSynthesizer();

const NaturalRainAmbience = () => {
  const [rainEnabled, setRainEnabled] = useState(false);
  const [rainVolume, setRainVolume] = useState(0.4);
  const [intensity, setIntensity] = useState('medium');
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPlaying } = useMusicPlayer();

  useEffect(() => {
    if (rainEnabled) {
      rainSynth.start(rainVolume, intensity);
    } else {
      rainSynth.stop();
    }
    return () => {
      // Cleanup
    };
  }, [rainEnabled, intensity]);

  useEffect(() => {
    if (rainEnabled) {
      rainSynth.setVolume(rainVolume);
    }
  }, [rainVolume]);

  const toggleRain = () => {
    setRainEnabled(!rainEnabled);
  };

  return (
    <div className="relative z-30">
      {/* Ambience Control Pill */}
      <div className="flex items-center gap-2 bg-[#0e1422]/90 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-xl shadow-lg">
        <button 
          onClick={toggleRain}
          className={`flex items-center gap-2 text-xs font-mono font-medium transition-all select-none px-2 py-1 rounded-full ${
            rainEnabled 
              ? 'bg-[#e2a450]/20 text-[#e2a450] border border-[#e2a450]/30 shadow-[0_0_12px_rgba(226,164,80,0.2)]' 
              : 'text-[#8492a6] hover:text-[#f4eee2] hover:bg-white/5'
          }`}
          title={rainEnabled ? "Turn off rain sound" : "Turn on natural rain sound"}
        >
          <CloudRain size={14} className={rainEnabled ? "animate-bounce" : ""} />
          <span>{rainEnabled ? "Rain Audio Active" : "Natural Rain FX"}</span>
        </button>

        {/* Live Spectrum Frequency Bars */}
        <div className="flex items-end gap-[2px] h-3 px-1.5">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className={`w-[2px] rounded-full transition-all duration-150 ${
                isPlaying
                  ? 'bg-[#e2a450]'
                  : rainEnabled
                  ? 'bg-blue-400/80'
                  : 'bg-white/20'
              }`}
              style={{
                height: isPlaying 
                  ? `${Math.max(3, (i % 3 === 0 ? 12 : i % 2 === 0 ? 9 : 6) * (isPlaying ? 1 : 0.4))}px` 
                  : rainEnabled 
                  ? `${Math.max(3, (i * 2) % 10 + 2)}px` 
                  : '3px'
              }}
            ></span>
          ))}
        </div>

        {/* Setting Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded-full transition-colors ${isExpanded ? 'text-[#e2a450]' : 'text-[#8492a6] hover:text-[#f4eee2]'}`}
          title="Adjust rain intensity"
        >
          <Sliders size={13} />
        </button>
      </div>

      {/* Expanded Ambience Controls Popup */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-64 craft-panel rounded-2xl p-4 shadow-2xl border border-white/10 space-y-3 z-50 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#e2a450] font-semibold">
              Rain Ambience Mix
            </span>
            <button onClick={() => setIsExpanded(false)} className="text-[#8492a6] hover:text-white">✕</button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[#8492a6] font-mono text-[10px]">
              <span>Intensity</span>
              <span className="text-[#f4eee2] uppercase font-bold">{intensity}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {['light', 'medium', 'heavy'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    setIntensity(lvl);
                    if (!rainEnabled) setRainEnabled(true);
                  }}
                  className={`py-1 px-2 rounded-lg text-[10px] font-mono uppercase font-semibold transition-all border ${
                    intensity === lvl
                      ? 'bg-[#e2a450] text-[#060911] border-[#e2a450]'
                      : 'bg-white/5 text-[#8492a6] hover:text-white border-white/5'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[#8492a6] font-mono text-[10px]">
              <span>Ambience Volume</span>
              <span>{Math.round(rainVolume * 100)}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVolume}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setRainVolume(v);
                if (v > 0 && !rainEnabled) setRainEnabled(true);
              }}
              className="w-full player-range accent-[#e2a450]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NaturalRainAmbience;
