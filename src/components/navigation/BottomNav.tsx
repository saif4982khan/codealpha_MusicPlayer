import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { ViewType } from '../../types';
import { Home, Search, Library, ListMusic, Settings } from 'lucide-react';

interface TabItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

export const BottomNav: React.FC = () => {
  const { activeView, navigateTo } = usePlayerStore();

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'playlists', label: 'Playlists', icon: ListMusic },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Map sub-views to primary tabs for active tab highlight
  const getEffectiveTab = (view: ViewType): ViewType => {
    if (['songs', 'artists', 'artist-detail', 'albums', 'album-detail', 'folders', 'folder-detail', 'favorites', 'recently-played'].includes(view)) {
      return 'library';
    }
    if (view === 'playlist-detail') {
      return 'playlists';
    }
    return view;
  };

  const effectiveTab = getEffectiveTab(activeView);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1D2028]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 py-2 select-none safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = effectiveTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative min-w-[56px] min-h-[44px] ${
                isActive ? 'text-[#FF8A1F]' : 'text-[#6F7480] hover:text-[#A9ADB7]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#FF8A1F]' : ''
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF8A1F]" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight font-medium ${
                  isActive ? 'text-[#FF8A1F] font-semibold' : 'text-[#6F7480]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
