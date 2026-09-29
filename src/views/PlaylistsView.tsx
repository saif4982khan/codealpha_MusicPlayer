import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Playlist } from '../types';
import { Plus, Play, Trash2 } from 'lucide-react';

export const PlaylistsView: React.FC = () => {
  const { playlists, setCreatePlaylistOpen, navigateTo, deletePlaylist } = usePlayerStore();

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Playlists</h2>
          <p className="text-xs text-[#A9ADB7]">Your custom audio mixes and collections</p>
        </div>

        <button
          onClick={() => setCreatePlaylistOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Grid of Playlists */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Create Playlist Quick Card */}
        <div
          onClick={() => setCreatePlaylistOpen(true)}
          className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#292D36]/40 hover:bg-[#292D36]/80 border-2 border-dashed border-white/10 hover:border-[#FF8A1F] cursor-pointer group transition-all min-h-[220px]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#FF8A1F]/20 group-hover:bg-[#FF8A1F] text-[#FF8A1F] group-hover:text-white flex items-center justify-center transition-all mb-3 shadow-md">
            <Plus className="w-7 h-7" />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-[#FF8A1F] transition-colors text-center">
            Create Playlist
          </span>
          <span className="text-[11px] text-[#6F7480] text-center mt-1">
            Build a unique vibe
          </span>
        </div>

        {/* Existing Playlists */}
        {playlists.map((pl: Playlist) => (
          <div
            key={pl.id}
            onClick={() => navigateTo('playlist-detail', pl.id)}
            className="p-3.5 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-[#1D2028]">
              <img
                src={pl.cover}
                alt={pl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <div className="w-11 h-11 rounded-full bg-[#FF8A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF8A1F]/40">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between gap-1">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                  {pl.name}
                </h4>
                {pl.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(pl.id);
                    }}
                    className="p-1 text-[#6F7480] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete playlist"
                    aria-label="Delete playlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[11px] text-[#A9ADB7] mt-0.5">{pl.songCount} tracks</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
