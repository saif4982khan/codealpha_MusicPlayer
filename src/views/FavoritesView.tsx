import React, { useState } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song, Album, Artist } from '../types';
import { Heart, Play, MoreVertical, Disc3, Users, Music2 } from 'lucide-react';

export const FavoritesView: React.FC = () => {
  const {
    songs,
    albums,
    artists,
    likedSongIds,
    likedAlbumIds,
    likedArtistIds,
    playSong,
    currentSong,
    toggleFavoriteSong,
    toggleFavoriteAlbum,
    toggleFavoriteArtist,
    openContextMenu,
    navigateTo
  } = usePlayerStore();

  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'artists'>('songs');

  const favoriteSongs = songs.filter((s: Song) => likedSongIds.includes(s.id));
  const favoriteAlbums = albums.filter((a: Album) => likedAlbumIds.includes(a.id));
  const favoriteArtists = artists.filter((art: Artist) => likedArtistIds.includes(art.id));

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FF8A1F] text-white flex items-center justify-center shadow-lg shadow-[#FF8A1F]/30">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Your Favorites</h2>
            <p className="text-xs text-[#A9ADB7]">
              {likedSongIds.length} songs • {likedAlbumIds.length} albums • {likedArtistIds.length} artists
            </p>
          </div>
        </div>

        {favoriteSongs.length > 0 && activeTab === 'songs' && (
          <button
            onClick={() => playSong(favoriteSongs[0], favoriteSongs)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Favorites</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          onClick={() => setActiveTab('songs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'songs'
              ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
              : 'bg-[#242731] text-[#A9ADB7] hover:text-white'
          }`}
        >
          <Music2 className="w-3.5 h-3.5" />
          <span>Songs ({favoriteSongs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('albums')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'albums'
              ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
              : 'bg-[#242731] text-[#A9ADB7] hover:text-white'
          }`}
        >
          <Disc3 className="w-3.5 h-3.5" />
          <span>Albums ({favoriteAlbums.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('artists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'artists'
              ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
              : 'bg-[#242731] text-[#A9ADB7] hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Artists ({favoriteArtists.length})</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'songs' && (
        <div className="space-y-1.5">
          {favoriteSongs.length === 0 ? (
            <div className="py-20 text-center text-[#6F7480] bg-[#242731]/30 rounded-3xl border border-white/[0.04]">
              <Heart className="w-12 h-12 text-[#6F7480] mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-white mb-1">No favorite songs yet</h4>
              <p className="text-xs text-[#A9ADB7] max-w-xs mx-auto mb-4">
                Tap the heart icon on any song to save it to your personal favorites.
              </p>
              <button
                onClick={() => navigateTo('songs')}
                className="px-5 py-2.5 rounded-full bg-[#FF8A1F] text-white text-xs font-bold"
              >
                Explore Music
              </button>
            </div>
          ) : (
            favoriteSongs.map((song: Song, idx: number) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, favoriteSongs)}
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
                      className="p-1.5 text-[#FF8A1F] hover:scale-110 transition-transform"
                      aria-label="Remove favorite"
                    >
                      <Heart className="w-4 h-4 fill-[#FF8A1F]" />
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
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {favoriteAlbums.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[#6F7480] bg-[#242731]/30 rounded-3xl border border-white/[0.04]">
              <Disc3 className="w-12 h-12 text-[#6F7480] mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-white mb-1">No favorite albums yet</h4>
              <p className="text-xs text-[#A9ADB7] max-w-xs mx-auto mb-4">
                Add albums to your favorites to see them here.
              </p>
              <button
                onClick={() => navigateTo('albums')}
                className="px-5 py-2.5 rounded-full bg-[#FF8A1F] text-white text-xs font-bold"
              >
                Browse Albums
              </button>
            </div>
          ) : (
            favoriteAlbums.map((album: Album) => (
              <div
                key={album.id}
                onClick={() => navigateTo('album-detail', album.id)}
                className="p-3.5 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all duration-300"
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
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-[#FF8A1F]"
                    aria-label="Remove favorite album"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#FF8A1F]" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F]">
                  {album.title}
                </h4>
                <p className="text-xs text-[#A9ADB7] truncate mt-0.5">{album.artist}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'artists' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {favoriteArtists.length === 0 ? (
            <div className="col-span-full py-20 text-center text-[#6F7480] bg-[#242731]/30 rounded-3xl border border-white/[0.04]">
              <Users className="w-12 h-12 text-[#6F7480] mx-auto mb-3 opacity-40" />
              <h4 className="text-base font-bold text-white mb-1">No followed artists yet</h4>
              <p className="text-xs text-[#A9ADB7] max-w-xs mx-auto mb-4">
                Follow your favorite musicians to stay updated with their songs.
              </p>
              <button
                onClick={() => navigateTo('artists')}
                className="px-5 py-2.5 rounded-full bg-[#FF8A1F] text-white text-xs font-bold"
              >
                Explore Artists
              </button>
            </div>
          ) : (
            favoriteArtists.map((artist: Artist) => (
              <div
                key={artist.id}
                onClick={() => navigateTo('artist-detail', artist.id)}
                className="flex flex-col items-center p-4 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] cursor-pointer group transition-all"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-2 ring-[#FF8A1F]">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F] text-center truncate w-full">
                  {artist.name}
                </h4>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteArtist(artist.id);
                  }}
                  className="mt-3 py-1 px-3 rounded-full text-[11px] font-bold bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/30"
                >
                  Following
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
