import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import {
  Music2,
  Users,
  Disc3,
  FolderClosed,
  ListMusic,
  Heart,
  Clock,
  ChevronRight
} from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    songs,
    artists,
    albums,
    folders,
    playlists,
    likedSongIds,
    recentlyPlayed,
    navigateTo
  } = usePlayerStore();

  const sections = [
    {
      id: 'songs' as const,
      title: 'Songs',
      count: `${songs.length} songs`,
      icon: Music2,
      color: 'bg-orange-500/20 text-[#FF8A1F]'
    },
    {
      id: 'artists' as const,
      title: 'Artists',
      count: `${artists.length} artists`,
      icon: Users,
      color: 'bg-orange-500/20 text-[#FF8A1F]'
    },
    {
      id: 'albums' as const,
      title: 'Albums',
      count: `${albums.length} albums`,
      icon: Disc3,
      color: 'bg-orange-500/20 text-[#FF8A1F]'
    },
    {
      id: 'folders' as const,
      title: 'Folders',
      count: `${folders.length} folders`,
      icon: FolderClosed,
      color: 'bg-orange-500/20 text-[#FF8A1F]'
    },
    {
      id: 'playlists' as const,
      title: 'Playlists',
      count: `${playlists.length} playlists`,
      icon: ListMusic,
      color: 'bg-orange-500/20 text-[#FF8A1F]'
    },
    {
      id: 'favorites' as const,
      title: 'Favorites',
      count: `${likedSongIds.length} favorited tracks`,
      icon: Heart,
      color: 'bg-red-500/20 text-red-400'
    },
    {
      id: 'recently-played' as const,
      title: 'Recently Played',
      count: `${recentlyPlayed.length} songs in history`,
      icon: Clock,
      color: 'bg-blue-500/20 text-blue-400'
    },
  ];

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Your Music Library</h2>
        <p className="text-xs text-[#A9ADB7]">
          All your tracks, artists, albums, folders and custom playlists in one place
        </p>
      </div>

      {/* Grid of Library Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              onClick={() => navigateTo(sec.id)}
              className="flex items-center justify-between p-4 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 ${sec.color}`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white group-hover:text-[#FF8A1F] transition-colors truncate">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-[#A9ADB7] mt-0.5">{sec.count}</p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-[#6F7480] group-hover:text-white transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
