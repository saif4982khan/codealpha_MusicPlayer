import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song, Album, Artist } from '../types';
import {
  Play,
  Shuffle,
  Heart,
  Check,
  UserPlus,
  MoreVertical,
  BadgeCheck
} from 'lucide-react';

export const ArtistDetailView: React.FC = () => {
  const {
    activeDetailId,
    artists,
    songs,
    albums,
    playSong,
    currentSong,
    likedArtistIds,
    toggleFavoriteArtist,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    navigateTo,
    toggleShuffle
  } = usePlayerStore();

  const artist = artists.find((a: Artist) => a.id === activeDetailId) || artists[0];
  const artistSongs = songs.filter((s: Song) => s.artistId === artist.id || s.artist.toLowerCase().includes(artist.name.toLowerCase()));
  const artistAlbums = albums.filter((alb: Album) => alb.artistId === artist.id || alb.artist.toLowerCase().includes(artist.name.toLowerCase()));
  const isFollowing = likedArtistIds.includes(artist.id);

  const relatedArtists = artists.filter((a: Artist) => a.id !== artist.id).slice(0, 4);

  return (
    <div className="space-y-8 pb-32">
      {/* Artist Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#242731] to-[#1D2028] border border-white/[0.06] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 shrink-0">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-[#FF8A1F] uppercase tracking-wider mb-1">
              {artist.verified && <BadgeCheck className="w-4 h-4 text-[#FF8A1F]" />}
              <span>Verified Artist</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="text-xs sm:text-sm text-[#A9ADB7] mt-1">
              {artist.monthlyListeners} monthly listeners
            </p>

            <p className="text-xs text-[#6F7480] mt-2 max-w-xl line-clamp-2 sm:line-clamp-none">
              {artist.bio}
            </p>

            {/* CTAs */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
              <button
                onClick={() => {
                  if (artistSongs.length > 0) {
                    playSong(artistSongs[0], artistSongs);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF8A1F] hover:bg-[#FF9D3D] text-white text-xs font-bold shadow-lg shadow-[#FF8A1F]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Play Artist</span>
              </button>

              <button
                onClick={() => {
                  if (artistSongs.length > 0) {
                    toggleShuffle();
                    const rand = artistSongs[Math.floor(Math.random() * artistSongs.length)];
                    playSong(rand, artistSongs);
                  }
                }}
                className="p-3 rounded-full bg-[#242731] hover:bg-[#292D36] text-white hover:text-[#FF8A1F] transition-all"
                title="Shuffle Artist"
                aria-label="Shuffle Artist"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={() => toggleFavoriteArtist(artist.id)}
                className={`flex items-center gap-1.5 px-4 py-3 rounded-full text-xs font-bold transition-all ${
                  isFollowing
                    ? 'bg-[#FF8A1F]/20 text-[#FF8A1F] border border-[#FF8A1F]/40'
                    : 'bg-[#242731] hover:bg-[#292D36] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Songs Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Popular Songs</h3>

        <div className="space-y-1.5">
          {artistSongs.length === 0 ? (
            <div className="py-8 text-center text-[#6F7480] text-xs">
              No tracks uploaded for this artist yet.
            </div>
          ) : (
            artistSongs.map((song: Song, idx: number) => {
              const isCurrent = currentSong?.id === song.id;
              const isLiked = likedSongIds.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playSong(song, artistSongs)}
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
                      <p className="text-xs text-[#A9ADB7] truncate">{song.album}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[#6F7480]">
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

      {/* Artist Albums */}
      {artistAlbums.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-tight">Discography</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {artistAlbums.map((album: Album) => (
              <div
                key={album.id}
                onClick={() => navigateTo('album-detail', album.id)}
                className="p-3 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-[#1D2028]">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FF8A1F]">
                  {album.title}
                </h4>
                <p className="text-xs text-[#A9ADB7] mt-0.5">{album.year} • Album</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Artists */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Fans Also Like</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedArtists.map((rel: Artist) => (
            <div
              key={rel.id}
              onClick={() => navigateTo('artist-detail', rel.id)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] border border-white/[0.05] cursor-pointer group transition-all"
            >
              <img
                src={rel.image}
                alt={rel.name}
                className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-white group-hover:text-[#FF8A1F] truncate">
                  {rel.name}
                </h5>
                <p className="text-[11px] text-[#A9ADB7]">Artist</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
