import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song, SortField } from '../types';
import {
  Play,
  Pause,
  SlidersHorizontal,
  Search,
  MoreVertical,
  Heart,
  Shuffle
} from 'lucide-react';

export const SongsView: React.FC = () => {
  const {
    songs,
    currentSong,
    isPlaying,
    playSong,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    activeSort,
    setSortModalOpen,
    toggleShuffle
  } = usePlayerStore();

  const [filterQuery, setFilterQuery] = useState('');

  // Sort logic
  const getSortedSongs = (list: Song[], sort: SortField): Song[] => {
    const copy = [...list];
    switch (sort) {
      case 'title-asc':
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return copy.sort((a, b) => b.title.localeCompare(a.title));
      case 'artist':
        return copy.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'album':
        return copy.sort((a, b) => a.album.localeCompare(b.album));
      case 'duration':
        return copy.sort((a, b) => b.duration - a.duration);
      case 'dateAdded':
        return copy.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
      case 'composer':
        return copy.sort((a, b) => (a.composer || '').localeCompare(b.composer || ''));
      default:
        return copy;
    }
  };

  const filteredSongs = songs.filter(
    (s: Song) =>
      s.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.artist.toLowerCase().includes(filterQuery.toLowerCase()) ||
      s.album.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const displaySongs = getSortedSongs(filteredSongs, activeSort);

  return (
    <div className="space-y-6 pb-32">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (displaySongs.length > 0) {
                playSong(displaySongs[0], displaySongs);
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 transition-all hover:scale-105 active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play All ({displaySongs.length})</span>
          </button>

          <button
            onClick={toggleShuffle}
            className="p-2.5 rounded-full bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all"
            title="Shuffle"
            aria-label="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Filter Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#6F7480] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter songs..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6F7480] outline-none"
            />
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setSortModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white text-xs font-semibold transition-all shrink-0"
            aria-label="Sort songs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF8A1F]" />
            <span className="hidden sm:inline">Sort</span>
          </button>
        </div>
      </div>

      {/* Songs Table Header for Desktop */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[11px] font-bold text-[#6F7480] uppercase tracking-wider border-b border-white/[0.06]">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Title</div>
        <div className="col-span-3">Album</div>
        <div className="col-span-2 text-right">Duration</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Songs Dense List */}
      <div className="space-y-1.5">
        {displaySongs.length === 0 ? (
          <div className="py-20 text-center text-[#6F7480] text-sm">
            No songs matching "{filterQuery}"
          </div>
        ) : (
          displaySongs.map((song: Song, idx: number) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playSong(song, displaySongs)}
                className={`flex items-center justify-between md:grid md:grid-cols-12 gap-3 sm:gap-4 p-3 rounded-2xl cursor-pointer transition-all group ${
                  isCurrent
                    ? 'bg-[#292D36] border border-[#FF8A1F]/30 shadow-md'
                    : 'bg-[#242731]/50 hover:bg-[#292D36] border border-transparent hover:border-white/[0.04]'
                }`}
              >
                {/* Index / Playing Indicator */}
                <div className="hidden md:flex items-center col-span-1 text-xs font-semibold text-[#6F7480]">
                  {isCurrent && isPlaying ? (
                    <span className="flex gap-0.5 items-end h-3">
                      <span className="w-0.5 bg-[#FF8A1F] h-full animate-bounce" />
                      <span className="w-0.5 bg-[#FF8A1F] h-2/3 animate-bounce" />
                      <span className="w-0.5 bg-[#FF8A1F] h-4/5 animate-bounce" />
                    </span>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Title & Artwork */}
                <div className="flex items-center gap-3.5 min-w-0 md:col-span-5">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                        isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-[#FF8A1F] text-[#FF8A1F]" />
                      ) : (
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4
                      className={`text-sm font-bold truncate transition-colors ${
                        isCurrent ? 'text-[#FF8A1F]' : 'text-white group-hover:text-[#FF8A1F]'
                      }`}
                    >
                      {song.title}
                    </h4>
                    <p className="text-xs text-[#A9ADB7] truncate mt-0.5">{song.artist}</p>
                  </div>
                </div>

                {/* Album Column (Desktop) */}
                <div className="hidden md:flex items-center col-span-3 text-xs text-[#A9ADB7] truncate">
                  {song.album}
                </div>

                {/* Duration Column */}
                <div className="hidden md:flex items-center justify-end col-span-2 text-xs font-semibold text-[#6F7480]">
                  {song.durationFormatted}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 md:col-span-1 shrink-0">
                  <span className="text-xs font-medium text-[#6F7480] sm:hidden pr-2">
                    {song.durationFormatted}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteSong(song.id);
                    }}
                    className="p-2 text-[#6F7480] hover:text-[#FF8A1F] transition-colors"
                    aria-label="Favorite song"
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
                    className="p-2 text-[#6F7480] hover:text-white transition-colors"
                    aria-label="More options"
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
