import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song } from '../types';
import { Clock, Trash2, Heart, MoreVertical } from 'lucide-react';

export const RecentlyPlayedView: React.FC = () => {
  const {
    recentlyPlayed,
    playSong,
    currentSong,
    clearHistory,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    navigateTo
  } = usePlayerStore();

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF8A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF8A1F]/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Recently Played</h2>
            <p className="text-xs text-[#A9ADB7]">
              {recentlyPlayed.length} tracks in playback history
            </p>
          </div>
        </div>

        {recentlyPlayed.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#242731] hover:bg-red-500/20 text-[#A9ADB7] hover:text-red-400 text-xs font-bold transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Tracks */}
      <div className="space-y-1.5">
        {recentlyPlayed.length === 0 ? (
          <div className="py-20 text-center text-[#6F7480] bg-[#242731]/30 rounded-3xl border border-white/[0.04]">
            <Clock className="w-12 h-12 text-[#6F7480] mx-auto mb-3 opacity-40" />
            <h4 className="text-base font-bold text-white mb-1">No playback history yet</h4>
            <p className="text-xs text-[#A9ADB7] max-w-xs mx-auto mb-4">
              Songs you play will appear here so you can easily replay your favorite recent moments.
            </p>
            <button
              onClick={() => navigateTo('songs')}
              className="px-5 py-2.5 rounded-full bg-[#FF8A1F] text-white text-xs font-bold"
            >
              Start Listening
            </button>
          </div>
        ) : (
          recentlyPlayed.map((song: Song, idx: number) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id + '-' + idx}
                onClick={() => playSong(song, recentlyPlayed)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#292D36] border border-[#FF8A1F]/30'
                    : 'bg-[#242731]/50 hover:bg-[#292D36]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-semibold text-[#6F7480] w-4 text-center">
                    {idx + 1}
                  </span>
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-11 h-11 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold truncate ${
                        isCurrent ? 'text-[#FF8A1F]' : 'text-white'
                      }`}
                    >
                      {song.title}
                    </h4>
                    <p className="text-xs text-[#A9ADB7] truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-[#6F7480]">
                    {song.durationFormatted}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteSong(song.id);
                    }}
                    className="p-1.5 text-[#6F7480] hover:text-[#FF8A1F] transition-colors"
                    aria-label="Favorite track"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      openContextMenu(song, { x: rect.left, y: rect.bottom });
                    }}
                    className="p-1.5 text-[#6F7480] hover:text-white transition-colors"
                    aria-label="Track options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
