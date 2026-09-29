import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  X,
  Trash2,
  BookmarkPlus,
  Play,
  GripVertical,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    isQueueOpen,
    setQueueOpen,
    queue,
    queueIndex,
    currentSong,
    playSong,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    setCreatePlaylistOpen
  } = usePlayerStore();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-[#1D2028] border-l border-white/[0.08] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#242731] border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Play Queue</h3>
            <span className="text-xs text-[#A9ADB7] font-medium">
              {queue.length} {queue.length === 1 ? 'song' : 'songs'} in queue
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCreatePlaylistOpen(true)}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-[#FF8A1F] transition-all"
              title="Save as Playlist"
              aria-label="Save queue as playlist"
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <button
              onClick={clearQueue}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-red-400 transition-all"
              title="Clear Queue"
              aria-label="Clear queue"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setQueueOpen(false)}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all ml-1"
              aria-label="Close queue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Song Section */}
        {currentSong && (
          <div className="p-4 bg-[#242731]/50 border-b border-white/[0.06]">
            <span className="text-[10px] font-bold text-[#FF8A1F] uppercase tracking-wider block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-[#292D36] border border-[#FF8A1F]/30">
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-11 h-11 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">{currentSong.title}</h4>
                <p className="text-xs text-[#A9ADB7] truncate">{currentSong.artist}</p>
              </div>
              <span className="text-xs text-[#6F7480] font-semibold pr-2">
                {currentSong.durationFormatted}
              </span>
            </div>
          </div>
        )}

        {/* Queue List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 no-scrollbar">
          <span className="text-[10px] font-bold text-[#6F7480] uppercase tracking-wider block px-2 mb-2">
            Next In Queue
          </span>

          {queue.length === 0 ? (
            <div className="py-16 text-center text-[#6F7480] text-sm">
              The queue is empty.
            </div>
          ) : (
            queue.map((song, idx) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id + '-' + idx}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all group ${
                    isCurrent
                      ? 'bg-[#292D36] border border-[#FF8A1F]/40'
                      : 'hover:bg-[#242731]'
                  }`}
                >
                  {/* Grip / Position */}
                  <span className="text-xs font-semibold text-[#6F7480] w-5 text-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Artwork */}
                  <div
                    onClick={() => playSong(song, queue)}
                    className="relative w-10 h-10 rounded-xl overflow-hidden cursor-pointer shrink-0 group-hover:ring-1 group-hover:ring-[#FF8A1F]"
                  >
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  {/* Meta */}
                  <div
                    onClick={() => playSong(song, queue)}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                      {song.title}
                    </h5>
                    <p className="text-[11px] text-[#A9ADB7] truncate">{song.artist}</p>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button
                        onClick={() => reorderQueue(idx, idx - 1)}
                        className="p-1 text-[#6F7480] hover:text-white"
                        title="Move Up"
                        aria-label="Move song up in queue"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < queue.length - 1 && (
                      <button
                        onClick={() => reorderQueue(idx, idx + 1)}
                        className="p-1 text-[#6F7480] hover:text-white"
                        title="Move Down"
                        aria-label="Move song down in queue"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1 text-[#6F7480] hover:text-red-400"
                      title="Remove from queue"
                      aria-label="Remove song from queue"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
