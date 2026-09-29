import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Album, Song } from '../types';
import {
  Play,
  Shuffle,
  Heart,
  Share2,
  MoreVertical
} from 'lucide-react';

export const AlbumDetailView: React.FC = () => {
  const {
    activeDetailId,
    albums,
    songs,
    playSong,
    currentSong,
    likedAlbumIds,
    toggleFavoriteAlbum,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    navigateTo,
    addToast,
    toggleShuffle
  } = usePlayerStore();

  const album = albums.find((a: Album) => a.id === activeDetailId) || albums[0];
  const albumSongs = songs.filter(
    (s: Song) => s.albumId === album.id || s.album.toLowerCase() === album.title.toLowerCase()
  );
  const isLiked = likedAlbumIds.includes(album.id);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: album.title,
          text: `Listen to ${album.title} by ${album.artist} on Saif`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
        addToast('Album link copied to clipboard', 'success');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Album link copied to clipboard', 'success');
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Hero Album Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#242731] to-[#1D2028] border border-white/[0.06] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/10 shrink-0">
            <img
              src={album.cover}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-[#FF8A1F] uppercase tracking-wider block mb-1">
              Album
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {album.title}
            </h1>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-[#A9ADB7] mt-1.5">
              <span
                onClick={() => navigateTo('artist-detail', album.artistId)}
                className="text-white hover:text-[#FF8A1F] cursor-pointer transition-colors"
              >
                {album.artist}
              </span>
              <span>•</span>
              <span>{album.year}</span>
              <span>•</span>
              <span>{albumSongs.length} songs</span>
              <span>•</span>
              <span className="text-[#6F7480]">{album.totalDuration}</span>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
              <button
                onClick={() => {
                  if (albumSongs.length > 0) {
                    playSong(albumSongs[0], albumSongs);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Album</span>
              </button>

              <button
                onClick={() => {
                  if (albumSongs.length > 0) {
                    toggleShuffle();
                    const rand = albumSongs[Math.floor(Math.random() * albumSongs.length)];
                    playSong(rand, albumSongs);
                  }
                }}
                className="p-3 rounded-full bg-[#242731] hover:bg-[#292D36] text-white hover:text-[#FF8A1F] transition-all"
                title="Shuffle Album"
                aria-label="Shuffle Album"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleFavoriteAlbum(album.id)}
                className={`p-3 rounded-full bg-[#242731] hover:bg-[#292D36] transition-all ${
                  isLiked ? 'text-[#FF8A1F]' : 'text-[#A9ADB7] hover:text-white'
                }`}
                title="Favorite Album"
                aria-label="Favorite Album"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FF8A1F]' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all"
                title="Share Album"
                aria-label="Share Album"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks List */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-white tracking-tight px-1">Tracks</h3>

        <div className="space-y-1.5">
          {albumSongs.length === 0 ? (
            <div className="py-12 text-center text-[#6F7480] text-sm">
              No tracks found in this album.
            </div>
          ) : (
            albumSongs.map((song: Song, idx: number) => {
              const isCurrent = currentSong?.id === song.id;
              const isSongLiked = likedSongIds.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, albumSongs)}
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
                      aria-label="Favorite track"
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
            })
          )}
        </div>
      </section>
    </div>
  );
};
