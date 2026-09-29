import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  Mic2,
  Radio,
  Share2,
  Sliders,
  Moon,
  Volume2,
  VolumeX,
  Sparkles,
  Info
} from 'lucide-react';

export const NowPlayingModal: React.FC = () => {
  const {
    isNowPlayingOpen,
    closeNowPlaying,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
    likedSongIds,
    toggleFavoriteSong,
    isLyricsOpen,
    setLyricsOpen,
    isVisualizerOpen,
    setVisualizerOpen,
    isQueueOpen,
    setQueueOpen,
    setEqualizerOpen,
    setSleepTimerOpen,
    setDetailsModalOpen,
    openContextMenu,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    addToast
  } = usePlayerStore();

  if (!isNowPlayingOpen || !currentSong) return null;

  const isLiked = likedSongIds.includes(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentSong.title,
          text: `Listening to ${currentSong.title} by ${currentSong.artist} on Saif`,
          url: window.location.href,
        });
      } catch {
        // Fallback
        navigator.clipboard.writeText(
          `Listening to ${currentSong.title} by ${currentSong.artist} on Saif! ${window.location.href}`
        );
        addToast('Link copied to clipboard', 'success');
      }
    } else {
      navigator.clipboard.writeText(
        `Listening to ${currentSong.title} by ${currentSong.artist} on Saif! ${window.location.href}`
      );
      addToast('Link copied to clipboard', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-300">
      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none filter blur-3xl scale-125"
        style={{
          backgroundImage: `url(${currentSong.cover})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative w-full max-w-lg min-h-screen sm:min-h-0 sm:h-auto sm:my-8 bg-[#1D2028]/95 sm:rounded-3xl border sm:border-white/[0.08] shadow-2xl p-6 sm:p-8 flex flex-col justify-between select-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={closeNowPlaying}
            className="p-2.5 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all shadow-sm"
            aria-label="Minimize player"
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#6F7480] uppercase tracking-widest block">
              Playing From Album
            </span>
            <span className="text-xs font-semibold text-white/90 truncate max-w-[200px] block">
              {currentSong.album}
            </span>
          </div>

          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              openContextMenu(currentSong, { x: rect.left, y: rect.bottom });
            }}
            className="p-2.5 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all shadow-sm"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Center Artwork */}
        <div className="my-auto py-4 flex flex-col items-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/80 ring-1 ring-white/10 group">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Tone style badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#1D2028]/80 backdrop-blur-md border border-white/10 text-[10px] font-semibold tracking-wider text-[#FF8A1F] uppercase">
              {currentSong.genre}
            </div>
          </div>

          {/* Song Info & Favorite */}
          <div className="w-full mt-6 flex items-center justify-between">
            <div className="min-w-0 flex-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                {currentSong.title}
              </h2>
              <p className="text-sm font-medium text-[#A9ADB7] mt-0.5 truncate">
                {currentSong.artist}
              </p>
            </div>

            <button
              onClick={() => toggleFavoriteSong(currentSong.id)}
              className="p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] transition-all hover:scale-110 active:scale-95 shrink-0"
              aria-label="Toggle favorite"
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : 'hover:text-[#FF8A1F]'
                }`}
              />
            </button>
          </div>

          {/* Scrubber Progress Bar */}
          <div className="w-full mt-6 space-y-1.5">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full cursor-pointer appearance-none bg-white/[0.08]"
              style={{
                background: `linear-gradient(to right, #FF8A1F ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}%)`
              }}
              aria-label="Seek track"
            />
            <div className="flex justify-between text-xs font-semibold text-[#6F7480]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Audio Controls */}
          <div className="w-full flex items-center justify-between mt-6 px-2">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2.5 rounded-2xl transition-all ${
                shuffle
                  ? 'text-[#FF8A1F] bg-[#FF8A1F]/10'
                  : 'text-[#6F7480] hover:text-white'
              }`}
              aria-label="Toggle shuffle"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrevious}
              className="p-3 rounded-2xl text-white hover:text-[#FF8A1F] hover:bg-white/[0.05] transition-all active:scale-95"
              aria-label="Previous track"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            {/* Big Play/Pause Button */}
            <button
              onClick={togglePlayPause}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white flex items-center justify-center shadow-xl shadow-[#FF8A1F]/35 hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white ml-1" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="p-3 rounded-2xl text-white hover:text-[#FF8A1F] hover:bg-white/[0.05] transition-all active:scale-95"
              aria-label="Next track"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={cycleRepeat}
              className={`p-2.5 rounded-2xl transition-all ${
                repeat !== 'off'
                  ? 'text-[#FF8A1F] bg-[#FF8A1F]/10'
                  : 'text-[#6F7480] hover:text-white'
              }`}
              aria-label="Cycle repeat"
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-5 h-5" />
              ) : (
                <Repeat className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Bottom Utility Tools */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[#A9ADB7]">
          {/* Synchronized Lyrics */}
          <button
            onClick={() => setLyricsOpen(!isLyricsOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isLyricsOpen
                ? 'bg-[#FF8A1F]/20 text-[#FF8A1F]'
                : 'hover:bg-white/[0.05] hover:text-white'
            }`}
            aria-label="Lyrics"
          >
            <Mic2 className="w-4 h-4" />
            <span>Lyrics</span>
          </button>

          {/* Visualizer */}
          <button
            onClick={() => setVisualizerOpen(!isVisualizerOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isVisualizerOpen
                ? 'bg-[#FF8A1F]/20 text-[#FF8A1F]'
                : 'hover:bg-white/[0.05] hover:text-white'
            }`}
            aria-label="Visualizer"
          >
            <Radio className="w-4 h-4" />
            <span>Visualizer</span>
          </button>

          {/* Equalizer */}
          <button
            onClick={() => setEqualizerOpen(true)}
            className="p-2 rounded-xl hover:bg-white/[0.05] hover:text-[#FF8A1F] transition-all"
            title="Equalizer"
            aria-label="Equalizer"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Track Details */}
          <button
            onClick={() => setDetailsModalOpen(true, currentSong)}
            className="p-2 rounded-xl hover:bg-white/[0.05] hover:text-[#FF8A1F] transition-all"
            title="Song details"
            aria-label="Song details"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl hover:bg-white/[0.05] hover:text-[#FF8A1F] transition-all"
            title="Share track"
            aria-label="Share track"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Queue */}
          <button
            onClick={() => setQueueOpen(!isQueueOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              isQueueOpen
                ? 'bg-[#FF8A1F]/20 text-[#FF8A1F]'
                : 'hover:bg-white/[0.05] hover:text-white'
            }`}
            aria-label="Queue"
          >
            <ListMusic className="w-4 h-4" />
            <span>Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
