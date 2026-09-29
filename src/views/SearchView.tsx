import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Song, Artist, Album, Playlist } from '../types';
import {
  Search,
  X,
  Clock,
  Heart,
  MoreVertical,
  Disc3,
  Users,
  Music2,
  ListMusic
} from 'lucide-react';

export const SearchView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    searchFilter,
    setSearchFilter,
    songs,
    artists,
    albums,
    playlists,
    playSong,
    currentSong,
    likedSongIds,
    toggleFavoriteSong,
    openContextMenu,
    navigateTo
  } = usePlayerStore();

  const query = searchQuery.trim().toLowerCase();

  // Search results
  const matchedSongs = songs.filter(
    (s: Song) =>
      s.title.toLowerCase().includes(query) ||
      s.artist.toLowerCase().includes(query) ||
      s.album.toLowerCase().includes(query) ||
      s.genre.toLowerCase().includes(query)
  );

  const matchedArtists = artists.filter(
    (a: Artist) => a.name.toLowerCase().includes(query) || a.bio.toLowerCase().includes(query)
  );

  const matchedAlbums = albums.filter(
    (alb: Album) => alb.title.toLowerCase().includes(query) || alb.artist.toLowerCase().includes(query)
  );

  const matchedPlaylists = playlists.filter(
    (pl: Playlist) =>
      pl.name.toLowerCase().includes(query) || pl.description.toLowerCase().includes(query)
  );

  const hasQuery = query.length > 0;

  const handleSelectRecent = (term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query) {
      addRecentSearch(searchQuery);
    }
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Search Input Box */}
      <form onSubmit={handleSearchSubmit} className="relative pt-2">
        <Search className="w-5 h-5 text-[#FF8A1F] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          autoFocus
          placeholder="Search songs, artists, albums, or playlists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#242731] border border-white/[0.08] focus:border-[#FF8A1F] rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-[#6F7480] outline-none shadow-md transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#6F7480] hover:text-white"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((cat) => {
          const isActive = searchFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setSearchFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
                  : 'bg-[#242731] text-[#A9ADB7] hover:text-white hover:bg-[#292D36]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* When no query is entered: Show Recent Searches and Suggestions */}
      {!hasQuery && (
        <div className="space-y-6">
          {recentSearches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF8A1F]" />
                  <h3 className="text-sm font-bold text-white tracking-tight">Recent Searches</h3>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs font-semibold text-[#6F7480] hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term: string) => (
                  <button
                    key={term}
                    onClick={() => handleSelectRecent(term)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-xs font-medium text-white transition-all group border border-white/[0.04]"
                  >
                    <span>{term}</span>
                    <Search className="w-3 h-3 text-[#6F7480] group-hover:text-[#FF8A1F]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories Browse */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-white tracking-tight">Explore Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => navigateTo('songs')}
                className="p-4 rounded-3xl bg-gradient-to-br from-[#292D36] to-[#1D2028] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer group transition-all"
              >
                <Music2 className="w-6 h-6 text-[#FF8A1F] mb-2" />
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F]">Top Songs</h4>
                <p className="text-[11px] text-[#A9ADB7] mt-0.5">Explore chart toppers</p>
              </div>

              <div
                onClick={() => navigateTo('artists')}
                className="p-4 rounded-3xl bg-gradient-to-br from-[#292D36] to-[#1D2028] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer group transition-all"
              >
                <Users className="w-6 h-6 text-[#FF8A1F] mb-2" />
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F]">Artists</h4>
                <p className="text-[11px] text-[#A9ADB7] mt-0.5">Discover top vocalists</p>
              </div>

              <div
                onClick={() => navigateTo('albums')}
                className="p-4 rounded-3xl bg-gradient-to-br from-[#292D36] to-[#1D2028] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer group transition-all"
              >
                <Disc3 className="w-6 h-6 text-[#FF8A1F] mb-2" />
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F]">Albums</h4>
                <p className="text-[11px] text-[#A9ADB7] mt-0.5">Full studio albums</p>
              </div>

              <div
                onClick={() => navigateTo('playlists')}
                className="p-4 rounded-3xl bg-gradient-to-br from-[#292D36] to-[#1D2028] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer group transition-all"
              >
                <ListMusic className="w-6 h-6 text-[#FF8A1F] mb-2" />
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F]">Playlists</h4>
                <p className="text-[11px] text-[#A9ADB7] mt-0.5">Curated mood mixes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {hasQuery && (
        <div className="space-y-8">
          {/* Songs Results */}
          {(searchFilter === 'all' || searchFilter === 'songs') && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Songs ({matchedSongs.length})</h3>
              {matchedSongs.length === 0 ? (
                <div className="text-xs text-[#6F7480] py-2">No matching songs.</div>
              ) : (
                <div className="space-y-1.5">
                  {matchedSongs.map((song: Song) => {
                    const isCurrent = currentSong?.id === song.id;
                    const isLiked = likedSongIds.includes(song.id);

                    return (
                      <div
                        key={song.id}
                        onClick={() => {
                          playSong(song, matchedSongs);
                          addRecentSearch(song.title);
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-[#292D36] border border-[#FF8A1F]/30'
                            : 'bg-[#242731]/50 hover:bg-[#292D36]'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
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
                            className="p-1.5 text-[#6F7480] hover:text-[#FF8A1F]"
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
                            className="p-1.5 text-[#6F7480] hover:text-white"
                            aria-label="Song options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Artists Results */}
          {(searchFilter === 'all' || searchFilter === 'artists') && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Artists ({matchedArtists.length})</h3>
              {matchedArtists.length === 0 ? (
                <div className="text-xs text-[#6F7480] py-2">No matching artists.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {matchedArtists.map((artist: Artist) => (
                    <div
                      key={artist.id}
                      onClick={() => {
                        navigateTo('artist-detail', artist.id);
                        addRecentSearch(artist.name);
                      }}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] border border-white/[0.04] cursor-pointer group transition-all"
                    >
                      <img
                        src={artist.image}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-[#FF8A1F] truncate">
                          {artist.name}
                        </h4>
                        <p className="text-[11px] text-[#A9ADB7]">Artist</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Albums Results */}
          {(searchFilter === 'all' || searchFilter === 'albums') && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Albums ({matchedAlbums.length})</h3>
              {matchedAlbums.length === 0 ? (
                <div className="text-xs text-[#6F7480] py-2">No matching albums.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {matchedAlbums.map((album: Album) => (
                    <div
                      key={album.id}
                      onClick={() => {
                        navigateTo('album-detail', album.id);
                        addRecentSearch(album.title);
                      }}
                      className="p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] border border-white/[0.04] cursor-pointer group transition-all"
                    >
                      <img
                        src={album.cover}
                        alt={album.title}
                        className="w-full aspect-square rounded-xl object-cover mb-2"
                      />
                      <h4 className="text-xs font-bold text-white group-hover:text-[#FF8A1F] truncate">
                        {album.title}
                      </h4>
                      <p className="text-[11px] text-[#A9ADB7] truncate">{album.artist}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Playlists Results */}
          {(searchFilter === 'all' || searchFilter === 'playlists') && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white">Playlists ({matchedPlaylists.length})</h3>
              {matchedPlaylists.length === 0 ? (
                <div className="text-xs text-[#6F7480] py-2">No matching playlists.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {matchedPlaylists.map((pl: Playlist) => (
                    <div
                      key={pl.id}
                      onClick={() => {
                        navigateTo('playlist-detail', pl.id);
                        addRecentSearch(pl.name);
                      }}
                      className="p-3 rounded-2xl bg-[#242731] hover:bg-[#292D36] border border-white/[0.04] cursor-pointer group transition-all"
                    >
                      <img
                        src={pl.cover}
                        alt={pl.name}
                        className="w-full aspect-square rounded-xl object-cover mb-2"
                      />
                      <h4 className="text-xs font-bold text-white group-hover:text-[#FF8A1F] truncate">
                        {pl.name}
                      </h4>
                      <p className="text-[11px] text-[#A9ADB7] truncate">{pl.songCount} tracks</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
