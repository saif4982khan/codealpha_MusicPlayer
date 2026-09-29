import React, { useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, ListPlus, Image } from 'lucide-react';

export const CreatePlaylistModal: React.FC = () => {
  const { isCreatePlaylistOpen, setCreatePlaylistOpen, createPlaylist } = usePlayerStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isCreatePlaylistOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name, description);
    setName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FF8A1F]/20 text-[#FF8A1F]">
              <ListPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create Playlist</h3>
              <p className="text-xs text-[#A9ADB7]">Add custom collection</p>
            </div>
          </div>

          <button
            onClick={() => setCreatePlaylistOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-[#6F7480] uppercase tracking-wider block mb-1.5">
              Playlist Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Chill Road Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#6F7480] outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#6F7480] uppercase tracking-wider block mb-1.5">
              Description (optional)
            </label>
            <textarea
              rows={3}
              placeholder="Give your playlist a mood or vibe description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#6F7480] outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white font-bold text-sm shadow-lg shadow-[#FF8A1F]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Playlist
          </button>
        </form>
      </div>
    </div>
  );
};
