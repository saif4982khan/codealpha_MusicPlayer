import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  ListMusic,
  Play,
  Pause,
  Trash2,
  Sliders,
  Radio,
  Moon,
  Clock,
  ChevronRight
} from 'lucide-react';

export const RightPanel: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    queue,
    playSong,
    removeFromQueue,
    setEqualizerOpen,
    setVisualizerOpen,
    setSleepTimerOpen,
    sleepTimerRemainingSec,
    openNowPlaying
  } = usePlayerStore();

  const nextSongs = queue.slice(0, 8);

  return (
    <aside className="hidden xl:flex flex-col w-80 h-screen bg-[#1D2028] border-l border-white/[0.07] px-5 py-6 select-none shrink-0 sticky top-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#FF8A1F]" />
          <h3 className="text-base font-bold text-white tracking-tight">Up Next</h3>
        </div>
        <span className="text-xs font-semibold text-[#6F7480]">
          {queue.length} tracks
        </span>
      </div>

      {/* Featured Current Playing Card */}
      {currentSong ? (
        <div
          onClick={openNowPlaying}
          className="p-4 rounded-3xl bg-gradient-to-b from-[#292D36] to-[#242731] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer transition-all duration-300 shadow-md group mb-6"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-3 bg-[#1D2028]">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : ''
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[10px] font-bold text-[#FF8A1F] uppercase tracking-wider">
                Now Playing
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-2">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                {currentSong.title}
              </h4>
              <p className="text-xs text-[#A9ADB7] truncate mt-0.5">{currentSong.artist}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-10 h-10 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white flex items-center justify-center shadow-md shadow-[#FF8A1F]/30 shrink-0"
              aria-label="Toggle playback"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#242731]/40 border border-white/[0.05] text-center text-xs text-[#6F7480] mb-6">
          No song currently playing. Choose a track to begin.
        </div>
      )}

      {/* Quick Audio Utilities Bar */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setEqualizerOpen(true)}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-[#FF8A1F] transition-all text-[11px] font-semibold gap-1"
          aria-label="Open Equalizer"
        >
          <Sliders className="w-4 h-4" />
          <span>EQ</span>
        </button>

        <button
          onClick={() => setVisualizerOpen(true)}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-[#FF8A1F] transition-all text-[11px] font-semibold gap-1"
          aria-label="Open Visualizer"
        >
          <Radio className="w-4 h-4" />
          <span>Visualizer</span>
        </button>

        <button
          onClick={() => setSleepTimerOpen(true)}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all text-[11px] font-semibold gap-1 relative"
          aria-label="Set sleep timer"
        >
          <Moon className={`w-4 h-4 ${sleepTimerRemainingSec ? 'text-[#FF8A1F]' : ''}`} />
          <span>{sleepTimerRemainingSec ? `${Math.ceil(sleepTimerRemainingSec / 60)}m` : 'Timer'}</span>
        </button>
      </div>

      {/* Up Next List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5">
        <div className="text-[11px] font-semibold text-[#6F7480] uppercase tracking-wider px-1 mb-2">
          Upcoming Queue
        </div>

        {nextSongs.map((song, idx) => {
          const isCurrent = currentSong?.id === song.id;
          return (
            <div
              key={song.id + '-' + idx}
              onClick={() => playSong(song, queue)}
              className={`flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all group ${
                isCurrent
                  ? 'bg-[#292D36] border border-[#FF8A1F]/30'
                  : 'hover:bg-[#242731]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-9 h-9 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white group-hover:text-[#FF8A1F] truncate transition-colors">
                    {song.title}
                  </h5>
                  <p className="text-[11px] text-[#A9ADB7] truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-semibold text-[#6F7480]">
                  {song.durationFormatted}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromQueue(idx);
                  }}
                  className="p-1 text-[#6F7480] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
