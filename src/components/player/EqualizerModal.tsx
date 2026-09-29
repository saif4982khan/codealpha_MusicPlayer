import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { EQPreset } from '../../types';
import { X, Sliders, RotateCcw } from 'lucide-react';

export const EqualizerModal: React.FC = () => {
  const {
    isEqualizerOpen,
    setEqualizerOpen,
    eqPreset,
    setEQPreset,
    eqBands,
    setEQBand
  } = usePlayerStore();

  if (!isEqualizerOpen) return null;

  const presets: { id: EQPreset; label: string }[] = [
    { id: 'flat', label: 'Flat' },
    { id: 'bass', label: 'Bass Boost' },
    { id: 'treble', label: 'Treble Boost' },
    { id: 'vocal', label: 'Vocal' },
    { id: 'rock', label: 'Rock' },
    { id: 'pop', label: 'Pop' },
    { id: 'classical', label: 'Classical' },
    { id: 'electronic', label: 'Electronic' },
  ];

  const frequencies = ['60 Hz', '230 Hz', '910 Hz', '3.6 kHz', '14 kHz'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF8A1F]/20 text-[#FF8A1F]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">5-Band Equalizer</h3>
              <p className="text-xs text-[#A9ADB7]">Fine-tune your audio frequencies</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEQPreset('flat')}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all text-xs flex items-center gap-1.5"
              title="Reset to Flat"
              aria-label="Reset equalizer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={() => setEqualizerOpen(false)}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
              aria-label="Close equalizer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets Row */}
        <div className="py-4">
          <span className="text-[11px] font-bold text-[#6F7480] uppercase tracking-wider block mb-2.5">
            Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const isActive = eqPreset === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setEQPreset(p.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
                      : 'bg-[#242731] text-[#A9ADB7] hover:bg-[#292D36] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Band Vertical Sliders */}
        <div className="py-6 px-2 bg-[#242731]/60 rounded-2xl border border-white/[0.05] my-2">
          <div className="flex justify-between items-end h-52 px-4 sm:px-6">
            {frequencies.map((freq, idx) => {
              const gain = eqBands[idx] || 0;
              return (
                <div key={freq} className="flex flex-col items-center h-full justify-between w-12">
                  <span className="text-[11px] font-bold text-[#FF8A1F]">
                    {gain > 0 ? `+${gain}` : gain} dB
                  </span>

                  <div className="relative h-36 flex items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={gain}
                      onChange={(e) => setEQBand(idx, parseFloat(e.target.value))}
                      className="w-32 -rotate-90 origin-center cursor-pointer appearance-none bg-white/[0.1] rounded-full"
                      aria-label={`${freq} equalizer band`}
                    />
                  </div>

                  <span className="text-xs font-semibold text-[#A9ADB7] tracking-tight">
                    {freq}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-[#6F7480]">
          Adjust sliders to custom shape sound frequencies
        </div>
      </div>
    </div>
  );
};
