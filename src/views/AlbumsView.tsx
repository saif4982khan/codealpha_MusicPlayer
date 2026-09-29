import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Album } from '../types';
import { Search, Heart } from 'lucide-react';

export const AlbumsView: React.FC = () => {
  const { albums, navigateTo, likedAlbumIds, toggleFavoriteAlbum } = usePlayerStore();
  const [search, setSearch] = useState('');

  const filteredAlbums = albums.filter(
    (a: Album) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.artist.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Albums</h2>
          <p className="text-xs text-[#A9ADB7]">{albums.length} albums in your collection</p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#6F7480] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search albums..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6F7480] outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
        {filteredAlbums.map((album: Album) => {
          const isLiked = likedAlbumIds.includes(album.id);

          return (
            <div
              key={album.id}
              onClick={() => navigateTo('album-detail', album.id)}
              className="p-3.5 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-[#1D2028]">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteAlbum(album.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#FF8A1F] opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Favorite album"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : ''
                    }`}
                  />
                </button>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                  {album.title}
                </h4>
                <p className="text-xs text-[#A9ADB7] truncate mt-0.5">{album.artist}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#6F7480] mt-2 font-medium">
                  <span>{album.year}</span>
                  <span>•</span>
                  <span>{album.songCount} tracks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
