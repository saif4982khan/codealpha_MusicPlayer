import React, { useEffect } from 'react';
import { usePlayerStore } from './store/usePlayerStore';
import { Sidebar } from './components/navigation/Sidebar';
import { BottomNav } from './components/navigation/BottomNav';
import { Header } from './components/navigation/Header';
import { RightPanel } from './components/navigation/RightPanel';
import { MiniPlayer } from './components/player/MiniPlayer';
import { NowPlayingModal } from './components/player/NowPlayingModal';
import { LyricsView } from './components/player/LyricsView';
import { QueueDrawer } from './components/player/QueueDrawer';
import { VisualizerModal } from './components/player/VisualizerModal';
import { EqualizerModal } from './components/player/EqualizerModal';
import { SleepTimerModal } from './components/player/SleepTimerModal';
import { SortModal } from './components/modals/SortModal';
import { ContextMenu } from './components/modals/ContextMenu';
import { SongDetailsModal } from './components/modals/SongDetailsModal';
import { CreatePlaylistModal } from './components/modals/CreatePlaylistModal';
import { AddToPlaylistModal } from './components/modals/AddToPlaylistModal';
import { OnboardingModal } from './components/modals/OnboardingModal';
import { ToastContainer } from './components/common/ToastContainer';

// Views
import { HomeView } from './views/HomeView';
import { SongsView } from './views/SongsView';
import { ArtistsView } from './views/ArtistsView';
import { ArtistDetailView } from './views/ArtistDetailView';
import { AlbumsView } from './views/AlbumsView';
import { AlbumDetailView } from './views/AlbumDetailView';
import { FoldersView } from './views/FoldersView';
import { FolderDetailView } from './views/FolderDetailView';
import { PlaylistsView } from './views/PlaylistsView';
import { PlaylistDetailView } from './views/PlaylistDetailView';
import { FavoritesView } from './views/FavoritesView';
import { RecentlyPlayedView } from './views/RecentlyPlayedView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { SettingsView } from './views/SettingsView';

export const App: React.FC = () => {
  const {
    activeView,
    themeMode,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    currentTime,
    duration,
    volume,
    setVolume,
    toggleMute
  } = usePlayerStore();

  // Apply theme class on mount and change
  useEffect(() => {
    if (themeMode === 'oled-black') {
      document.documentElement.classList.add('oled-theme');
    } else {
      document.documentElement.classList.remove('oled-theme');
    }
  }, [themeMode]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(currentTime - 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.05));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.05));
          break;
        case 'KeyN':
          e.preventDefault();
          playNext();
          break;
        case 'KeyP':
          e.preventDefault();
          playPrevious();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, playNext, playPrevious, seek, currentTime, volume, setVolume, toggleMute]);

  // Render active view component
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'songs':
        return <SongsView />;
      case 'artists':
        return <ArtistsView />;
      case 'artist-detail':
        return <ArtistDetailView />;
      case 'albums':
        return <AlbumsView />;
      case 'album-detail':
        return <AlbumDetailView />;
      case 'folders':
        return <FoldersView />;
      case 'folder-detail':
        return <FolderDetailView />;
      case 'playlists':
        return <PlaylistsView />;
      case 'playlist-detail':
        return <PlaylistDetailView />;
      case 'favorites':
        return <FavoritesView />;
      case 'recently-played':
        return <RecentlyPlayedView />;
      case 'search':
        return <SearchView />;
      case 'library':
        return <LibraryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1D2028] text-white flex flex-col antialiased selection:bg-[#FF8A1F] selection:text-white">
      <div className="flex-1 flex w-full">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* Center Main View Column */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Header />
          <main className="flex-1 px-4 sm:px-6 py-4 max-w-7xl w-full mx-auto">
            {renderView()}
          </main>
        </div>

        {/* Right Queue & Quick Tools (Wide Desktop) */}
        <RightPanel />
      </div>

      {/* Persistent MiniPlayer */}
      <MiniPlayer />

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Fullscreen & Floating Modals */}
      <OnboardingModal />
      <NowPlayingModal />
      <LyricsView />
      <QueueDrawer />
      <VisualizerModal />
      <EqualizerModal />
      <SleepTimerModal />
      <SortModal />
      <ContextMenu />
      <SongDetailsModal />
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <ToastContainer />
    </div>
  );
};

export default App;
