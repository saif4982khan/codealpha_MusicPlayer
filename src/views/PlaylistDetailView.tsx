import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Playlist, Song } from '../types';
import {
  Play,
  Shuffle,
  Trash2,
  Heart,
  MoreVertical,
  MinusCircle,
  Plus
} from 'lucide-react';

export const PlaylistDetailView: React.FC = () => {
  const {
    activeDetailId,
    playlists,
    songs,
    playSong,
    currentSong,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    removeSongFromPlaylist,
    deletePlaylist,
    navigateTo,
    toggleShuffle
  } = usePlayerStore();

  const playlist = playlists.find((p: Playlist) => p.id === activeDetailId) || playlists[0];
  const playlistSongs = songs.filter((s: Song) => playlist.songs.includes(s.id));

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#242731] to-[#1D2028] border border-white/[0.06] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/10 shrink-0">
            <img
              src={playlist.cover}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-[#FF8A1F] uppercase tracking-wider block mb-1">
              Playlist
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {playlist.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#A9ADB7] mt-1.5 max-w-xl">
              {playlist.description}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#6F7480] mt-2">
              <span>{playlistSongs.length} tracks</span>
              <span>•</span>
              <span>Created {playlist.createdAt}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
              <button
                onClick={() => {
                  if (playlistSongs.length > 0) {
                    playSong(playlistSongs[0], playlistSongs);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Playlist</span>
              </button>

              <button
                onClick={() => {
                  if (playlistSongs.length > 0) {
                    toggleShuffle();
                    const rand = playlistSongs[Math.floor(Math.random() * playlistSongs.length)];
                    playSong(rand, playlistSongs);
                  }
                }}
                className="p-3 rounded-full bg-[#242731] hover:bg-[#292D36] text-white hover:text-[#FF8A1F] transition-all"
                title="Shuffle Playlist"
                aria-label="Shuffle Playlist"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {playlist.isCustom && (
                <button
                  onClick={() => deletePlaylist(playlist.id)}
                  className="p-3 rounded-full bg-[#242731] hover:bg-red-500/20 text-[#A9ADB7] hover:text-red-400 transition-all"
                  title="Delete Playlist"
                  aria-label="Delete Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Tracks */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-lg font-bold text-white tracking-tight">Songs</h3>
          <button
            onClick={() => navigateTo('songs')}
            className="flex items-center gap-1 text-xs font-semibold text-[#FF8A1F] hover:text-[#FF9D3D] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add More Songs</span>
          </button>
        </div>

        <div className="space-y-1.5">
          {playlistSongs.length === 0 ? (
            <div className="py-16 text-center text-[#6F7480] text-sm bg-[#242731]/30 rounded-3xl border border-white/[0.04]">
              <p>This playlist is empty.</p>
              <button
                onClick={() => navigateTo('songs')}
                className="mt-3 px-4 py-2 rounded-full bg-[#FF8A1F] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Explore Songs to Add</span>
              </button>
            </div>
          ) : (
            playlistSongs.map((song: Song, idx: number) => {
              const isCurrent = currentSong?.id === song.id;
              const isSongLiked = likedSongIds.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, playlistSongs)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-[#292D36] border border-[#FF8A1F]/30'
                      : 'bg-[#242731]/50 hover:bg-[#292D36]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-xs font-semibold text-[#6F7480] w-5 text-center">
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
                          isSongLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : ''
                        }`}
                      />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSongFromPlaylist(playlist.id, song.id);
                      }}
                      className="p-1.5 text-[#6F7480] hover:text-red-400 transition-colors"
                      title="Remove from playlist"
                      aria-label="Remove from playlist"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        openContextMenu(song, { x: rect.left, y: rect.bottom });
                      }}
                      className="p-1.5 text-[#6F7480] hover:text-white transition-colors"
                      aria-label="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
