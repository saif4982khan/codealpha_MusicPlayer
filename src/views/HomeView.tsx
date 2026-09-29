import React, { useState, useEffect } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song, Artist, Album } from '../types';
import {
  Play,
  Pause,
  Heart,
  MoreVertical,
  ChevronRight,
  Sparkles,
  Clock,
  TrendingUp,
  Zap,
  Music2
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    songs,
    artists,
    albums,
    recentlyPlayed,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    navigateTo
  } = usePlayerStore();

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredSongs = songs.slice(0, 5);
  const suggestedSongs: Song[] = songs.slice(0, 6);
  const featuredArtists: Artist[] = artists.slice(0, 7);
  const recentList: Song[] = recentlyPlayed.length > 0 ? recentlyPlayed.slice(0, 5) : songs.slice(0, 5);
  const hotAlbums = albums.slice(0, 6);

  // Auto-rotate featured banner
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % featuredSongs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredSongs.length]);

  const featured = featuredSongs[featuredIndex];
  const isFeaturedCurrent = currentSong?.id === featured?.id;
  const isFeaturedLiked = featured ? likedSongIds.includes(featured.id) : false;

  const categories = [
    { label: 'All', view: 'home' as const, active: true },
    { label: 'Songs', view: 'songs' as const },
    { label: 'Artists', view: 'artists' as const },
    { label: 'Albums', view: 'albums' as const },
  ];

  return (
    <div className="space-y-8 pb-36">
      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2">
        {categories.map((cat, idx) => (
          <button
            key={cat.label}
            onClick={() => navigateTo(cat.view)}
            className={`px-5 py-2 rounded-full text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-200 ${
              idx === 0
                ? 'bg-[#FF8A1F] text-white shadow-lg shadow-[#FF8A1F]/30'
                : 'bg-[#242731] text-[#A9ADB7] hover:bg-[#292D36] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* === HERO FEATURED BANNER === */}
      {featured && (
        <section className="relative rounded-3xl overflow-hidden h-52 sm:h-64 shadow-2xl group cursor-pointer">
          {/* Background artwork with blur */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${featured.cover})`, filter: 'blur(4px) brightness(0.4)', transform: 'scale(1.08)' }}
          />

          {/* Orange gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-5 sm:p-6">
            {/* Badge + Dot indicators */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[#FF8A1F] bg-[#FF8A1F]/15 border border-[#FF8A1F]/30 px-3 py-1 rounded-full backdrop-blur-md">
                <Zap className="w-3 h-3" />
                Featured Pick
              </span>

              {/* Slide dots */}
              <div className="flex items-center gap-1.5">
                {featuredSongs.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setFeaturedIndex(i); }}
                    className={`rounded-full transition-all duration-300 ${
                      i === featuredIndex
                        ? 'w-5 h-1.5 bg-[#FF8A1F]'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Song info + controls */}
            <div className="flex items-end justify-between gap-4">
              <div className="flex items-end gap-4 min-w-0">
                {/* Album art thumbnail */}
                <img
                  src={featured.cover}
                  alt={featured.title}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover shadow-xl ring-1 ring-white/20 shrink-0"
                />

                <div className="min-w-0">
                  <p className="text-[10px] text-[#A9ADB7] font-semibold uppercase tracking-wider mb-1">{featured.genre}</p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-[#A9ADB7] mt-0.5 truncate">{featured.artist}</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavoriteSong(featured.id);
                  }}
                  className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                  aria-label="Favorite"
                >
                  <Heart className={`w-4 h-4 ${isFeaturedLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : 'text-white'}`} />
                </button>

                <button
                  onClick={() => {
                    if (isFeaturedCurrent) {
                      togglePlayPause();
                    } else {
                      playSong(featured, songs);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-sm font-bold shadow-xl shadow-[#FF8A1F]/40 transition-all hover:scale-105 active:scale-95"
                >
                  {isFeaturedCurrent && isPlaying ? (
                    <><Pause className="w-4 h-4 fill-white" /><span>Pause</span></>
                  ) : (
                    <><Play className="w-4 h-4 fill-white" /><span>Play</span></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* === SUGGESTED FOR YOU === */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Suggested For You
            </h2>
            <Sparkles className="w-4 h-4 text-[#FF8A1F]" />
          </div>
          <button
            onClick={() => navigateTo('songs')}
            className="text-xs font-semibold text-[#FF8A1F] hover:text-[#FF9D3D] flex items-center gap-0.5 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scroll grid */}
        <div className="flex lg:grid lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar pb-2">
          {suggestedSongs.map((song: Song) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id}
                className="w-40 sm:w-44 lg:w-auto shrink-0 group rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/40 p-3 flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              >
                {/* Artwork */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-[#1D2028]">
                  <img
                    src={song.cover}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => {
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playSong(song, songs);
                        }
                      }}
                      className="w-12 h-12 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white flex items-center justify-center shadow-xl shadow-[#FF8A1F]/40 transform scale-75 group-hover:scale-100 transition-all active:scale-95"
                      aria-label="Play song"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Currently playing ring */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-[#FF8A1F]/70" />
                  )}

                  {/* Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteSong(song.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-[#FF8A1F] transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Favorite song"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : ''}`} />
                  </button>
                </div>

                {/* Metadata & More */}
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-[11px] text-[#A9ADB7] truncate mt-0.5">
                      {song.artist}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = e.currentTarget.getBoundingClientRect();
                      openContextMenu(song, { x: rect.left, y: rect.bottom });
                    }}
                    className="p-1 text-[#6F7480] hover:text-white transition-colors"
                    aria-label="Song options"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* === RECENTLY PLAYED === */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Recently Played
            </h2>
            <Clock className="w-4 h-4 text-[#A9ADB7]" />
          </div>
          <button
            onClick={() => navigateTo('recently-played')}
            className="text-xs font-semibold text-[#FF8A1F] hover:text-[#FF9D3D] flex items-center gap-0.5 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentList.map((song: Song, idx: number) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id + '-' + idx}
                onClick={() => playSong(song, recentList)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                  isCurrent
                    ? 'bg-[#292D36] border border-[#FF8A1F]/30'
                    : 'bg-[#242731]/60 hover:bg-[#292D36] border border-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Track number */}
                  <span className="text-xs font-semibold text-[#6F7480] w-4 text-center shrink-0 hidden sm:block">
                    {idx + 1}
                  </span>

                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm">
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

                  <div className="min-w-0">
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

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="text-xs font-semibold text-[#6F7480] hidden sm:inline">
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
          })}
        </div>
      </section>

      {/* === POPULAR ARTISTS === */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Popular Artists
            </h2>
            <TrendingUp className="w-4 h-4 text-[#A9ADB7]" />
          </div>
          <button
            onClick={() => navigateTo('artists')}
            className="text-xs font-semibold text-[#FF8A1F] hover:text-[#FF9D3D] flex items-center gap-0.5 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-2">
          {featuredArtists.map((artist: Artist) => (
            <div
              key={artist.id}
              onClick={() => navigateTo('artist-detail', artist.id)}
              className="flex flex-col items-center gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <div className="w-full h-full rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-[#FF8A1F] transition-all duration-300 shadow-lg group-hover:scale-105">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#1D2028] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs font-bold text-white group-hover:text-[#FF8A1F] transition-colors text-center max-w-[90px] truncate">
                {artist.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* === HOT ALBUMS === */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Hot Albums
            </h2>
            <Music2 className="w-4 h-4 text-[#A9ADB7]" />
          </div>
          <button
            onClick={() => navigateTo('albums')}
            className="text-xs font-semibold text-[#FF8A1F] hover:text-[#FF9D3D] flex items-center gap-0.5 transition-colors"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {hotAlbums.map((album: Album) => (
            <div
              key={album.id}
              onClick={() => navigateTo('album-detail', album.id)}
              className="p-3 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-[#1D2028] shadow-md">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#FF8A1F] transition-colors">
                {album.title}
              </h4>
              <p className="text-[11px] text-[#A9ADB7] truncate mt-0.5">{album.artist}</p>
              <p className="text-[10px] text-[#6F7480] mt-1">{album.year}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
