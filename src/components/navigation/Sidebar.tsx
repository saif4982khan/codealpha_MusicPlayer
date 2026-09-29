import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ViewType } from '../../types';
import {
  Home,
  Search,
  Music2,
  Users2,
  Disc3,
  FolderClosed,
  ListMusic,
  Heart,
  Clock,
  Settings,
  Sparkles,
  Sliders,
  Radio
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    likedSongIds,
    songs,
    playlists,
    openNowPlaying,
    currentSong,
    isPlaying,
    setEqualizerOpen,
    setVisualizerOpen
  } = usePlayerStore();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'songs', label: 'Songs', icon: Music2, badge: songs.length },
    { id: 'artists', label: 'Artists', icon: Users2 },
    { id: 'albums', label: 'Albums', icon: Disc3 },
    { id: 'folders', label: 'Folders', icon: FolderClosed },
    { id: 'playlists', label: 'Playlists', icon: ListMusic, badge: playlists.length },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: likedSongIds.length },
    { id: 'recently-played', label: 'Recently Played', icon: Clock },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#1D2028] border-r border-white/[0.07] px-5 py-6 select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-8 cursor-pointer" onClick={() => navigateTo('home')}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A1F] to-[#FF9D3D] flex items-center justify-center shadow-lg shadow-[#FF8A1F]/30 ring-2 ring-[#FF8A1F]/20">
          <Music2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white block">Saif</span>
          <span className="text-[11px] font-medium text-[#FF8A1F] tracking-wide uppercase">Music Player</span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        <div className="text-[11px] font-semibold text-[#6F7480] uppercase tracking-wider px-3 mb-2">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-[#292D36] text-[#FF8A1F] shadow-sm font-semibold'
                  : 'text-[#A9ADB7] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-[#FF8A1F]' : 'text-[#6F7480] group-hover:text-white'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#FF8A1F]/20 text-[#FF8A1F]'
                      : 'bg-white/[0.06] text-[#6F7480]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Audio Tools Section */}
        <div className="pt-6">
          <div className="text-[11px] font-semibold text-[#6F7480] uppercase tracking-wider px-3 mb-2">
            Audio Studio
          </div>
          <button
            onClick={() => setEqualizerOpen(true)}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-white/[0.04] transition-all group"
          >
            <Sliders className="w-5 h-5 text-[#6F7480] group-hover:text-[#FF8A1F] transition-colors" />
            <span>Equalizer & FX</span>
          </button>
          <button
            onClick={() => setVisualizerOpen(true)}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-white/[0.04] transition-all group"
          >
            <Radio className="w-5 h-5 text-[#6F7480] group-hover:text-[#FF8A1F] transition-colors" />
            <span>Live Visualizer</span>
          </button>
        </div>
      </div>

      {/* Mini Card or Now Playing Preview */}
      {currentSong && (
        <div
          onClick={openNowPlaying}
          className="my-4 p-3 rounded-2xl bg-[#242731] border border-white/[0.06] hover:border-[#FF8A1F]/30 cursor-pointer transition-all group relative overflow-hidden"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className={`w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 ${
                isPlaying ? 'animate-pulse' : ''
              }`}
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white truncate block group-hover:text-[#FF8A1F] transition-colors">
                {currentSong.title}
              </span>
              <span className="text-[11px] text-[#A9ADB7] truncate block">
                {currentSong.artist}
              </span>
            </div>
            {isPlaying && (
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A1F] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8A1F]"></span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/[0.06] space-y-1">
        <button
          onClick={() => navigateTo('settings')}
          className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
            activeView === 'settings'
              ? 'bg-[#292D36] text-[#FF8A1F]'
              : 'text-[#A9ADB7] hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Settings className="w-5 h-5 text-[#6F7480]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
