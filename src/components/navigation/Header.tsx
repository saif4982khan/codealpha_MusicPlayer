import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  Search,
  ArrowLeft,
  SlidersHorizontal,
  Moon,
  Radio,
  Sliders,
  Sparkles,
  Music2
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeView,
    goBack,
    navigationHistory,
    navigateTo,
    searchQuery,
    setSearchQuery,
    setSortModalOpen,
    setSleepTimerOpen,
    sleepTimerRemainingSec,
    setEqualizerOpen,
    setVisualizerOpen
  } = usePlayerStore();

  const canGoBack =
    navigationHistory.length > 1 ||
    [
      'artist-detail',
      'album-detail',
      'folder-detail',
      'playlist-detail',
      'recently-played'
    ].includes(activeView);

  const getTitle = () => {
    switch (activeView) {
      case 'home':
        return 'Discover';
      case 'search':
        return 'Search';
      case 'library':
        return 'Your Library';
      case 'songs':
        return 'Songs';
      case 'artists':
        return 'Artists';
      case 'artist-detail':
        return 'Artist';
      case 'albums':
        return 'Albums';
      case 'album-detail':
        return 'Album';
      case 'folders':
        return 'Folders';
      case 'folder-detail':
        return 'Folder';
      case 'playlists':
        return 'Playlists';
      case 'playlist-detail':
        return 'Playlist';
      case 'favorites':
        return 'Favorites';
      case 'recently-played':
        return 'Recently Played';
      case 'settings':
        return 'Settings';
      default:
        return 'Saif';
    }
  };

  const showSortButton = ['songs', 'library', 'playlist-detail', 'favorites'].includes(activeView);

  return (
    <header className="sticky top-0 z-30 bg-[#1D2028]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 py-3.5 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {canGoBack ? (
          <button
            onClick={goBack}
            className="p-2 -ml-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF8A1F] to-[#FF9D3D] flex items-center justify-center shadow-md shadow-[#FF8A1F]/20">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">Saif</span>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white hidden lg:block">
          {getTitle()}
        </h1>
      </div>

      {/* Center Search Bar for Desktop */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F7480]" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activeView !== 'search') {
                navigateTo('search');
              }
            }}
            onFocus={() => {
              if (activeView !== 'search') {
                navigateTo('search');
              }
            }}
            className="w-full bg-[#242731] hover:bg-[#292D36] focus:bg-[#292D36] border border-white/[0.08] focus:border-[#FF8A1F]/50 rounded-2xl py-2 pl-10 pr-4 text-sm text-white placeholder-[#6F7480] outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Button */}
        <button
          onClick={() => navigateTo('search')}
          className="md:hidden p-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Sort Popup Trigger */}
        {showSortButton && (
          <button
            onClick={() => setSortModalOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Sort options"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF8A1F]" />
            <span className="hidden sm:inline">Sort</span>
          </button>
        )}

        {/* Equalizer Quick Access */}
        <button
          onClick={() => setEqualizerOpen(true)}
          className="p-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-[#FF8A1F] transition-all"
          title="Equalizer"
          aria-label="Open Equalizer"
        >
          <Sliders className="w-5 h-5" />
        </button>

        {/* Visualizer Quick Access */}
        <button
          onClick={() => setVisualizerOpen(true)}
          className="p-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-[#FF8A1F] transition-all"
          title="Audio Visualizer"
          aria-label="Open Visualizer"
        >
          <Radio className="w-5 h-5" />
        </button>

        {/* Sleep Timer */}
        <button
          onClick={() => setSleepTimerOpen(true)}
          className="p-2 rounded-2xl bg-[#242731] hover:bg-[#292D36] text-[#A9ADB7] hover:text-white transition-all relative"
          title="Sleep Timer"
          aria-label="Sleep timer"
        >
          <Moon className={`w-5 h-5 ${sleepTimerRemainingSec ? 'text-[#FF8A1F]' : ''}`} />
          {sleepTimerRemainingSec && (
            <span className="absolute -top-1 -right-1 bg-[#FF8A1F] text-black text-[9px] font-bold px-1.5 py-0.2 rounded-full">
              {Math.ceil(sleepTimerRemainingSec / 60)}m
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
