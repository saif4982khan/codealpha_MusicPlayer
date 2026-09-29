import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Folder, Song } from '../types';
import { Play, Shuffle, FolderOpen, Heart, MoreVertical } from 'lucide-react';

export const FolderDetailView: React.FC = () => {
  const {
    activeDetailId,
    folders,
    songs,
    playSong,
    currentSong,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    toggleShuffle
  } = usePlayerStore();

  const folder = folders.find((f: Folder) => f.id === activeDetailId) || folders[0];
  const folderSongs = songs.filter((s: Song) => folder.songs.includes(s.id));

  return (
    <div className="space-y-6 pb-32">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#292D36] to-[#242731] border border-white/[0.06] flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-20 h-20 rounded-3xl bg-[#FF8A1F] text-white flex items-center justify-center shadow-xl shadow-[#FF8A1F]/30 shrink-0">
          <FolderOpen className="w-10 h-10" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <span className="text-[11px] font-bold text-[#FF8A1F] uppercase tracking-wider block">
            Folder Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {folder.name}
          </h2>
          <p className="text-xs text-[#A9ADB7] mt-1.5">
            {folderSongs.length} audio files • {folder.totalDuration}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
            <button
              onClick={() => {
                if (folderSongs.length > 0) {
                  playSong(folderSongs[0], folderSongs);
                }
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play All</span>
            </button>

            <button
              onClick={() => {
                if (folderSongs.length > 0) {
                  toggleShuffle();
                  const rand = folderSongs[Math.floor(Math.random() * folderSongs.length)];
                  playSong(rand, folderSongs);
                }
              }}
              className="p-2.5 rounded-full bg-[#242731] hover:bg-[#30343E] text-white transition-all"
              title="Shuffle"
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="space-y-1.5">
        {folderSongs.map((song: Song, idx: number) => {
          const isCurrent = currentSong?.id === song.id;
          const isLiked = likedSongIds.includes(song.id);

          return (
            <div
              key={song.id}
              onClick={() => playSong(song, folderSongs)}
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
                  className="p-1.5 text-[#6F7480] hover:text-white transition-colors"
                  aria-label="Track options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
