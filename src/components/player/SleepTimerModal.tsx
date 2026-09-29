import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, Moon, Clock, Check } from 'lucide-react';

export const SleepTimerModal: React.FC = () => {
  const {
    isSleepTimerOpen,
    setSleepTimerOpen,
    sleepTimerMinutes,
    sleepTimerRemainingSec,
    setSleepTimer
  } = usePlayerStore();

  if (!isSleepTimerOpen) return null;

  const options = [
    { label: '5 minutes', minutes: 5 },
    { label: '10 minutes', minutes: 10 },
    { label: '15 minutes', minutes: 15 },
    { label: '30 minutes', minutes: 30 },
    { label: '45 minutes', minutes: 45 },
    { label: '60 minutes', minutes: 60 },
  ];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF8A1F]/20 text-[#FF8A1F]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sleep Timer</h3>
              <p className="text-xs text-[#A9ADB7]">Pause playback automatically</p>
            </div>
          </div>

          <button
            onClick={() => setSleepTimerOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close sleep timer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active timer banner if running */}
        {sleepTimerRemainingSec && (
          <div className="my-4 p-3.5 rounded-2xl bg-[#FF8A1F]/15 border border-[#FF8A1F]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#FF8A1F] animate-pulse" />
              <span className="text-xs font-semibold text-white">Time Remaining</span>
            </div>
            <span className="text-sm font-bold text-[#FF8A1F]">
              {formatRemaining(sleepTimerRemainingSec)}
            </span>
          </div>
        )}

        {/* Options List */}
        <div className="py-2 space-y-1.5">
          {options.map((opt) => {
            const isSelected = sleepTimerMinutes === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => setSleepTimer(opt.minutes)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#292D36] text-[#FF8A1F] border border-[#FF8A1F]/30'
                    : 'text-[#A9ADB7] hover:bg-[#242731] hover:text-white'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#FF8A1F]" />}
              </button>
            );
          })}

          {/* Turn Off button */}
          {sleepTimerMinutes !== null && (
            <button
              onClick={() => setSleepTimer(null)}
              className="w-full mt-2 py-3 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
            >
              Turn Off Timer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
