import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Artist } from '../types';
import { Search, Check, UserPlus } from 'lucide-react';

export const ArtistsView: React.FC = () => {
  const { artists, navigateTo, likedArtistIds, toggleFavoriteArtist } = usePlayerStore();
  const [search, setSearch] = useState('');

  const filteredArtists = artists.filter((a: Artist) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-32">
      {/* Search Header */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Artists</h2>
          <p className="text-xs text-[#A9ADB7]">{artists.length} artists in your library</p>
        </div>

        <div className="relative w-full max-w-xs">
          <Search className="w-3.5 h-3.5 text-[#6F7480] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl py-2 pl-9 pr-4 text-xs text-white placeholder-[#6F7480] outline-none"
          />
        </div>
      </div>

      {/* Grid of Artists */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {filteredArtists.map((artist: Artist) => {
          const isFollowing = likedArtistIds.includes(artist.id);

          return (
            <div
              key={artist.id}
              onClick={() => navigateTo('artist-detail', artist.id)}
              className="flex flex-col items-center p-4 rounded-3xl bg-[#292D36]/70 hover:bg-[#292D36] border border-white/[0.05] hover:border-[#FF8A1F]/30 transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              {/* Circular Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 ring-2 ring-white/10 group-hover:ring-[#FF8A1F] transition-all duration-300 shadow-lg">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F] transition-colors text-center truncate w-full">
                {artist.name}
              </h4>
              <span className="text-[11px] text-[#A9ADB7] mt-0.5">
                {artist.songCount} {artist.songCount === 1 ? 'song' : 'songs'}
              </span>

              {/* Follow Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteArtist(artist.id);
                }}
                className={`mt-3 w-full py-1.5 px-3 rounded-full text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isFollowing
                    ? 'bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/40'
                    : 'bg-[#242731] hover:bg-white/[0.1] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3 h-3" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
