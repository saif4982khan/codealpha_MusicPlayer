import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  Play,
  Pause,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
  ListMusic,
  Maximize2
} from 'lucide-react';

export const MiniPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    openNowPlaying,
    likedSongIds,
    toggleFavoriteSong,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    setQueueOpen
  } = usePlayerStore();

  if (!currentSong) return null;

  const isLiked = likedSongIds.includes(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-[60px] lg:bottom-0 left-0 right-0 z-40 px-3 lg:px-6 py-2 pointer-events-none">
      <div
        onClick={openNowPlaying}
        className="pointer-events-auto max-w-6xl mx-auto rounded-2xl bg-[#242731]/95 backdrop-blur-xl border border-white/[0.09] shadow-2xl overflow-hidden cursor-pointer group hover:border-[#FF8A1F]/40 transition-all select-none"
      >
        {/* Progress Bar Line */}
        <div className="w-full bg-white/[0.08] h-1 relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF8A1F] to-[#FF9D3D] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Left: Artwork & Song Meta */}
          <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial sm:w-72">
            <div className="relative shrink-0">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className={`w-12 h-12 rounded-xl object-cover shadow-md ${
                  isPlaying ? 'ring-2 ring-[#FF8A1F]/50 scale-105' : ''
                } transition-all duration-300`}
              />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#FF8A1F] rounded-full animate-bounce h-full" style={{ animationDelay: '0ms' }} />
                    <span className="w-0.5 bg-[#FF8A1F] rounded-full animate-bounce h-2/3" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 bg-[#FF8A1F] rounded-full animate-bounce h-4/5" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                {currentSong.title}
              </h4>
              <p className="text-xs text-[#A9ADB7] truncate">
                {currentSong.artist}
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavoriteSong(currentSong.id);
              }}
              className="p-1.5 rounded-full hover:bg-white/[0.06] text-[#A9ADB7] hover:text-[#FF8A1F] transition-colors shrink-0"
              aria-label="Favorite song"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : ''
                }`}
              />
            </button>
          </div>

          {/* Desktop Center: Duration details */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#6F7480]">
            <span>
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60)
                .toString()
                .padStart(2, '0')}
            </span>
            <span>/</span>
            <span>{currentSong.durationFormatted}</span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Volume Slider */}
            <div
              className="hidden lg:flex items-center gap-2 mr-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={toggleMute}
                className="text-[#A9ADB7] hover:text-white transition-colors"
                aria-label="Mute toggle"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#FF8A1F]" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1"
                aria-label="Volume slider"
              />
            </div>

            {/* Queue Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQueueOpen(true);
              }}
              className="hidden sm:flex p-2 rounded-xl hover:bg-white/[0.06] text-[#A9ADB7] hover:text-white transition-colors"
              title="Queue"
              aria-label="Open Queue"
            >
              <ListMusic className="w-5 h-5" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white flex items-center justify-center shadow-lg shadow-[#FF8A1F]/30 hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Skip Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playNext();
              }}
              className="p-2 rounded-xl hover:bg-white/[0.06] text-[#A9ADB7] hover:text-white transition-colors"
              aria-label="Next song"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Fullscreen Player Expand */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openNowPlaying();
              }}
              className="hidden sm:flex p-2 rounded-xl hover:bg-white/[0.06] text-[#A9ADB7] hover:text-white transition-colors"
              title="Expand player"
              aria-label="Expand player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
