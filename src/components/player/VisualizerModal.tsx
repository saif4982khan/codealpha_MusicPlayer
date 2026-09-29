import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { audioEngine } from '../../services/audioEngine';
import { VisualizerMode } from '../../types';
import { X, BarChart2, Activity, Disc, EyeOff } from 'lucide-react';

export const VisualizerModal: React.FC = () => {
  const {
    isVisualizerOpen,
    setVisualizerOpen,
    visualizerMode,
    setVisualizerMode,
    currentSong,
    isPlaying
  } = usePlayerStore();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisualizerOpen || !canvasRef.current || visualizerMode === 'off') {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Buffer arrays
    const freqData = new Uint8Array(128);
    const timeData = new Uint8Array(128);

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);

      // Handle high DPI
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Get real audio data or simulate gentle rhythm if paused
      if (isPlaying) {
        audioEngine.getFrequencyData(freqData);
        audioEngine.getTimeDomainData(timeData);
      } else {
        for (let i = 0; i < freqData.length; i++) {
          freqData[i] = Math.max(0, Math.sin(Date.now() / 300 + i * 0.2) * 20);
          timeData[i] = 128 + Math.sin(Date.now() / 400 + i * 0.1) * 15;
        }
      }

      if (visualizerMode === 'bars') {
        // Frequency Bars
        const barCount = 48;
        const barWidth = (width / barCount) - 4;
        for (let i = 0; i < barCount; i++) {
          const val = freqData[Math.floor((i / barCount) * (freqData.length / 2))];
          const barHeight = Math.max(4, (val / 255) * (height * 0.75));
          const x = i * (barWidth + 4) + 2;
          const y = height - barHeight;

          // Gradient
          const gradient = ctx.createLinearGradient(0, y, 0, height);
          gradient.addColorStop(0, '#FF9D3D');
          gradient.addColorStop(1, '#FF8A1F');

          ctx.fillStyle = gradient;
          ctx.shadowColor = 'rgba(255, 138, 31, 0.4)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();
        }
      } else if (visualizerMode === 'wave') {
        // Oscilloscope Waveform
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF8A1F';
        ctx.shadowColor = 'rgba(255, 138, 31, 0.8)';
        ctx.shadowBlur = 14;
        ctx.beginPath();

        const sliceWidth = width / timeData.length;
        let x = 0;

        for (let i = 0; i < timeData.length; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else if (visualizerMode === 'circle') {
        // Circular Spectrum
        const centerX = width / 2;
        const centerY = height / 2;
        const baseRadius = Math.min(centerX, centerY) * 0.45;
        const points = 64;

        ctx.beginPath();
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const dataIdx = Math.floor((i / points) * (freqData.length / 2));
          const val = freqData[dataIdx];
          const offset = (val / 255) * 45;
          const radius = baseRadius + offset;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FF8A1F';
        ctx.shadowColor = 'rgba(255, 138, 31, 0.9)';
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(centerX, centerY, baseRadius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 138, 31, 0.12)';
        ctx.fill();
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisualizerOpen, visualizerMode, isPlaying]);

  if (!isVisualizerOpen) return null;

  const modes: { id: VisualizerMode; label: string; icon: React.ElementType }[] = [
    { id: 'bars', label: 'Bars', icon: BarChart2 },
    { id: 'wave', label: 'Waveform', icon: Activity },
    { id: 'circle', label: 'Circular', icon: Disc },
    { id: 'off', label: 'Off', icon: EyeOff },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[70vh] bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#242731] border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-bold text-white">Audio Visualizer</span>
            {currentSong && (
              <span className="text-xs text-[#A9ADB7] font-medium hidden sm:inline">
                • {currentSong.title} — {currentSong.artist}
              </span>
            )}
          </div>

          <button
            onClick={() => setVisualizerOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-white/[0.1] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close visualizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="flex-1 relative flex items-center justify-center p-6 bg-gradient-to-b from-[#1D2028] to-[#16181F]">
          <canvas ref={canvasRef} className="w-full h-full block" />
        </div>

        {/* Mode Switcher Footer */}
        <div className="px-6 py-4 bg-[#242731] border-t border-white/[0.06] flex items-center justify-center gap-2 sm:gap-4">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = visualizerMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setVisualizerMode(m.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#FF8A1F] text-white shadow-lg shadow-[#FF8A1F]/30'
                    : 'bg-[#292D36] text-[#A9ADB7] hover:text-white hover:bg-[#30343E]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
