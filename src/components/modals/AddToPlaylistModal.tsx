import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, FolderPlus, Plus, Check } from 'lucide-react';

export const AddToPlaylistModal: React.FC = () => {
  const {
    isAddToPlaylistOpen,
    setAddToPlaylistOpen,
    targetSongForPlaylist,
    playlists,
    addSongToPlaylist,
    setCreatePlaylistOpen
  } = usePlayerStore();

  if (!isAddToPlaylistOpen || !targetSongForPlaylist) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF8A1F]/20 text-[#FF8A1F]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Add to Playlist</h3>
              <p className="text-xs text-[#A9ADB7] truncate max-w-[200px]">
                {targetSongForPlaylist.title}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddToPlaylistOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create New Playlist option */}
        <div className="py-3">
          <button
            onClick={() => {
              setAddToPlaylistOpen(false);
              setCreatePlaylistOpen(true);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] border border-dashed border-white/20 text-[#FF8A1F] text-xs font-bold transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Playlist</span>
          </button>
        </div>

        {/* Playlists List */}
        <div className="space-y-1.5 pb-2">
          {playlists.map((pl) => {
            const containsSong = pl.songs.includes(targetSongForPlaylist.id);
            return (
              <button
                key={pl.id}
                onClick={() => addSongToPlaylist(pl.id, targetSongForPlaylist.id)}
                disabled={containsSong}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                  containsSong
                    ? 'bg-[#242731]/40 opacity-60 cursor-default'
                    : 'bg-[#242731] hover:bg-[#292D36] text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={pl.cover}
                    alt={pl.name}
                    className="w-10 h-10 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{pl.name}</h5>
                    <p className="text-[11px] text-[#6F7480]">{pl.songCount} songs</p>
                  </div>
                </div>

                {containsSong && <Check className="w-4 h-4 text-[#FF8A1F] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
