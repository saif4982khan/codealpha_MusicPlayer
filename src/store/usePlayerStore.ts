import { create } from 'zustand';
import {
  Song,
  Artist,
  Album,
  Folder,
  Playlist,
  ViewType,
  SortField,
  VisualizerMode,
  EQPreset,
  RepeatMode,
  ToastMessage
} from '../types';
import {
  INITIAL_SONGS,
  INITIAL_ARTISTS,
  INITIAL_ALBUMS,
  INITIAL_FOLDERS,
  INITIAL_PLAYLISTS,
  RECENT_SEARCH_SUGGESTIONS
} from '../data/mockMusic';
import { audioEngine } from '../services/audioEngine';

export interface PlayerStore {
  // Navigation
  activeView: ViewType;
  activeDetailId: string | null;
  navigationHistory: { view: ViewType; detailId: string | null }[];
  navigateTo: (view: ViewType, detailId?: string | null) => void;
  goBack: () => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Catalog
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  folders: Folder[];
  playlists: Playlist[];

  // Player State
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  previousVolume: number;
  isMuted: boolean;
  playbackSpeed: number;
  shuffle: boolean;
  repeat: RepeatMode;
  queue: Song[];
  queueIndex: number;
  recentlyPlayed: Song[];

  // Favorites
  likedSongIds: string[];
  likedAlbumIds: string[];
  likedArtistIds: string[];
  toggleFavoriteSong: (songId: string) => void;
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleFavoriteArtist: (artistId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  searchFilter: 'all' | 'songs' | 'artists' | 'albums' | 'playlists';
  setSearchFilter: (filter: 'all' | 'songs' | 'artists' | 'albums' | 'playlists') => void;

  // Sorting
  activeSort: SortField;
  setActiveSort: (sort: SortField) => void;

  // Modals & Panels
  isNowPlayingOpen: boolean;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  isLyricsOpen: boolean;
  setLyricsOpen: (open: boolean) => void;
  isQueueOpen: boolean;
  setQueueOpen: (open: boolean) => void;
  isVisualizerOpen: boolean;
  setVisualizerOpen: (open: boolean) => void;
  isSortModalOpen: boolean;
  setSortModalOpen: (open: boolean) => void;
  isEqualizerOpen: boolean;
  setEqualizerOpen: (open: boolean) => void;
  isSleepTimerOpen: boolean;
  setSleepTimerOpen: (open: boolean) => void;
  isCreatePlaylistOpen: boolean;
  setCreatePlaylistOpen: (open: boolean) => void;
  isAddToPlaylistOpen: boolean;
  setAddToPlaylistOpen: (open: boolean, targetSong?: Song | null) => void;
  targetSongForPlaylist: Song | null;
  isDetailsModalOpen: boolean;
  setDetailsModalOpen: (open: boolean, song?: Song | null) => void;
  detailsSong: Song | null;
  isContextMenuOpen: boolean;
  contextMenuSong: Song | null;
  contextMenuPosition: { x: number; y: number } | null;
  openContextMenu: (song: Song, pos?: { x: number; y: number }) => void;
  closeContextMenu: () => void;

  // Sleep Timer
  sleepTimerMinutes: number | null;
  sleepTimerRemainingSec: number | null;
  setSleepTimer: (minutes: number | null) => void;

  // Audio Processing Settings
  eqPreset: EQPreset;
  eqBands: number[]; // 5 band values in dB [-12 to +12]
  setEQPreset: (preset: EQPreset) => void;
  setEQBand: (bandIndex: number, gainDb: number) => void;
  crossfadeSeconds: number;
  setCrossfadeSeconds: (sec: number) => void;
  gaplessEnabled: boolean;
  setGaplessEnabled: (enabled: boolean) => void;
  visualizerMode: VisualizerMode;
  setVisualizerMode: (mode: VisualizerMode) => void;

  // Appearance
  themeMode: 'saif-dark' | 'oled-black';
  setThemeMode: (theme: 'saif-dark' | 'oled-black') => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Audio Playback Controls
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setPlaybackSpeed: (speed: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (song: Song) => void;
  playSongNextInQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  clearQueue: () => void;
  clearHistory: () => void;

  // Playlist Management
  createPlaylist: (name: string, description: string, cover?: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;

  // Offline / Download Simulation
  downloadedSongIds: string[];
  toggleDownloadSong: (songId: string) => void;

  // Internals
  syncTime: (time: number) => void;
}

// Preset frequencies: 60Hz, 230Hz, 910Hz, 3.6kHz, 14kHz
const EQ_PRESET_MAP: Record<EQPreset, number[]> = {
  flat: [0, 0, 0, 0, 0],
  bass: [6, 4, 1, 0, -1],
  treble: [-2, 0, 2, 5, 7],
  vocal: [-2, 2, 5, 3, 1],
  rock: [5, 3, -1, 3, 5],
  pop: [2, 4, 3, 1, 3],
  classical: [4, 2, 0, 2, 4],
  electronic: [6, 3, 0, 4, 5],
};

// Local storage loaders
const loadStorage = <T>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
};

let playbackTimer: number | null = null;
let sleepInterval: number | null = null;

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  // Navigation
  activeView: 'home',
  activeDetailId: null,
  navigationHistory: [{ view: 'home', detailId: null }],
  navigateTo: (view, detailId = null) => {
    set((state) => ({
      activeView: view,
      activeDetailId: detailId,
      navigationHistory: [...state.navigationHistory, { view, detailId }]
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
  goBack: () => {
    set((state) => {
      if (state.navigationHistory.length > 1) {
        const newHist = [...state.navigationHistory];
        newHist.pop(); // remove current
        const prev = newHist[newHist.length - 1];
        return {
          activeView: prev.view,
          activeDetailId: prev.detailId,
          navigationHistory: newHist
        };
      }
      return { activeView: 'home', activeDetailId: null };
    });
  },

  // Onboarding
  hasCompletedOnboarding: loadStorage('saif_onboarding_done', false),
  completeOnboarding: () => {
    saveStorage('saif_onboarding_done', true);
    set({ hasCompletedOnboarding: true, activeView: 'home' });
  },
  resetOnboarding: () => {
    saveStorage('saif_onboarding_done', false);
    set({ hasCompletedOnboarding: false });
    get().addToast('Onboarding reset. Welcome back!', 'info');
  },

  // Catalog
  songs: INITIAL_SONGS,
  artists: INITIAL_ARTISTS,
  albums: INITIAL_ALBUMS,
  folders: INITIAL_FOLDERS,
  playlists: loadStorage('saif_playlists', INITIAL_PLAYLISTS),

  // Player State
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: loadStorage('saif_vol', 0.8),
  previousVolume: 0.8,
  isMuted: false,
  playbackSpeed: 1.0,
  shuffle: false,
  repeat: 'off',
  queue: INITIAL_SONGS,
  queueIndex: 0,
  recentlyPlayed: loadStorage('saif_recent_played', [INITIAL_SONGS[0], INITIAL_SONGS[1]]),

  // Favorites
  likedSongIds: loadStorage('saif_liked_songs', ['song-1', 'song-6', 'song-8']),
  likedAlbumIds: loadStorage('saif_liked_albums', ['album-starboy', 'album-positions']),
  likedArtistIds: loadStorage('saif_liked_artists', ['artist-weeknd', 'artist-ariana']),
  toggleFavoriteSong: (id) => {
    set((state) => {
      const exists = state.likedSongIds.includes(id);
      const updated = exists
        ? state.likedSongIds.filter((x) => x !== id)
        : [...state.likedSongIds, id];
      saveStorage('saif_liked_songs', updated);
      get().addToast(
        exists ? 'Removed from favorites' : 'Added to favorites',
        'info'
      );
      return { likedSongIds: updated };
    });
  },
  toggleFavoriteAlbum: (id) => {
    set((state) => {
      const exists = state.likedAlbumIds.includes(id);
      const updated = exists
        ? state.likedAlbumIds.filter((x) => x !== id)
        : [...state.likedAlbumIds, id];
      saveStorage('saif_liked_albums', updated);
      get().addToast(
        exists ? 'Removed album from favorites' : 'Saved album to favorites',
        'info'
      );
      return { likedAlbumIds: updated };
    });
  },
  toggleFavoriteArtist: (id) => {
    set((state) => {
      const exists = state.likedArtistIds.includes(id);
      const updated = exists
        ? state.likedArtistIds.filter((x) => x !== id)
        : [...state.likedArtistIds, id];
      saveStorage('saif_liked_artists', updated);
      get().addToast(
        exists ? 'Unfollowed artist' : 'Following artist',
        'info'
      );
      return { likedArtistIds: updated };
    });
  },

  // Search
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  recentSearches: loadStorage('saif_recent_searches', RECENT_SEARCH_SUGGESTIONS.slice(0, 6)),
  addRecentSearch: (query) => {
    if (!query.trim()) return;
    set((state) => {
      const filtered = state.recentSearches.filter((s) => s.toLowerCase() !== query.toLowerCase());
      const updated = [query, ...filtered].slice(0, 10);
      saveStorage('saif_recent_searches', updated);
      return { recentSearches: updated };
    });
  },
  clearRecentSearches: () => {
    saveStorage('saif_recent_searches', []);
    set({ recentSearches: [] });
    get().addToast('Search history cleared', 'info');
  },
  searchFilter: 'all',
  setSearchFilter: (filter) => set({ searchFilter: filter }),

  // Sorting
  activeSort: 'title-asc',
  setActiveSort: (sort) => {
    set({ activeSort: sort, isSortModalOpen: false });
    get().addToast(`Sorted by ${sort.replace('-', ' ')}`, 'info');
  },

  // Modals & Panels
  isNowPlayingOpen: false,
  openNowPlaying: () => set({ isNowPlayingOpen: true }),
  closeNowPlaying: () => set({ isNowPlayingOpen: false }),
  isLyricsOpen: false,
  setLyricsOpen: (open) => set({ isLyricsOpen: open }),
  isQueueOpen: false,
  setQueueOpen: (open) => set({ isQueueOpen: open }),
  isVisualizerOpen: false,
  setVisualizerOpen: (open) => set({ isVisualizerOpen: open }),
  isSortModalOpen: false,
  setSortModalOpen: (open) => set({ isSortModalOpen: open }),
  isEqualizerOpen: false,
  setEqualizerOpen: (open) => set({ isEqualizerOpen: open }),
  isSleepTimerOpen: false,
  setSleepTimerOpen: (open) => set({ isSleepTimerOpen: open }),
  isCreatePlaylistOpen: false,
  setCreatePlaylistOpen: (open) => set({ isCreatePlaylistOpen: open }),
  isAddToPlaylistOpen: false,
  setAddToPlaylistOpen: (open, targetSong = null) =>
    set({ isAddToPlaylistOpen: open, targetSongForPlaylist: targetSong }),
  targetSongForPlaylist: null,
  isDetailsModalOpen: false,
  setDetailsModalOpen: (open, song = null) =>
    set({ isDetailsModalOpen: open, detailsSong: song || get().currentSong }),
  detailsSong: null,
  isContextMenuOpen: false,
  contextMenuSong: null,
  contextMenuPosition: null,
  openContextMenu: (song, pos) =>
    set({
      isContextMenuOpen: true,
      contextMenuSong: song,
      contextMenuPosition: pos || null
    }),
  closeContextMenu: () =>
    set({ isContextMenuOpen: false, contextMenuSong: null, contextMenuPosition: null }),

  // Sleep Timer
  sleepTimerMinutes: null,
  sleepTimerRemainingSec: null,
  setSleepTimer: (minutes) => {
    if (sleepInterval) {
      clearInterval(sleepInterval);
      sleepInterval = null;
    }
    if (!minutes) {
      set({ sleepTimerMinutes: null, sleepTimerRemainingSec: null, isSleepTimerOpen: false });
      get().addToast('Sleep timer turned off', 'info');
      return;
    }
    const totalSec = minutes * 60;
    set({
      sleepTimerMinutes: minutes,
      sleepTimerRemainingSec: totalSec,
      isSleepTimerOpen: false
    });
    get().addToast(`Sleep timer set for ${minutes} minutes`, 'success');

    sleepInterval = window.setInterval(() => {
      const remaining = get().sleepTimerRemainingSec;
      if (remaining && remaining > 1) {
        set({ sleepTimerRemainingSec: remaining - 1 });
      } else {
        // Sleep timer ended!
        if (sleepInterval) clearInterval(sleepInterval);
        set({ isPlaying: false, sleepTimerMinutes: null, sleepTimerRemainingSec: null });
        audioEngine.pause();
        get().addToast('Sleep timer reached. Playback paused.', 'info');
      }
    }, 1000);
  },

  // Audio Processing Settings
  eqPreset: 'flat',
  eqBands: [0, 0, 0, 0, 0],
  setEQPreset: (preset) => {
    const gains = EQ_PRESET_MAP[preset] || [0, 0, 0, 0, 0];
    audioEngine.setEQGains(gains);
    set({ eqPreset: preset, eqBands: gains });
    get().addToast(`Equalizer: ${preset.toUpperCase()} preset applied`, 'info');
  },
  setEQBand: (index, gainDb) => {
    set((state) => {
      const newBands = [...state.eqBands];
      newBands[index] = gainDb;
      audioEngine.setEQGains(newBands);
      return { eqBands: newBands, eqPreset: 'flat' };
    });
  },
  crossfadeSeconds: loadStorage('saif_crossfade', 2),
  setCrossfadeSeconds: (sec) => {
    saveStorage('saif_crossfade', sec);
    set({ crossfadeSeconds: sec });
    get().addToast(`Crossfade: ${sec}s`, 'info');
  },
  gaplessEnabled: loadStorage('saif_gapless', true),
  setGaplessEnabled: (enabled) => {
    saveStorage('saif_gapless', enabled);
    set({ gaplessEnabled: enabled });
    get().addToast(`Gapless playback ${enabled ? 'enabled' : 'disabled'}`, 'info');
  },
  visualizerMode: 'bars',
  setVisualizerMode: (mode) => set({ visualizerMode: mode }),

  // Appearance
  themeMode: loadStorage('saif_theme', 'saif-dark'),
  setThemeMode: (theme) => {
    saveStorage('saif_theme', theme);
    set({ themeMode: theme });
    if (theme === 'oled-black') {
      document.documentElement.classList.add('oled-theme');
    } else {
      document.documentElement.classList.remove('oled-theme');
    }
    get().addToast(`Theme: ${theme === 'oled-black' ? 'OLED Black' : 'Saif Dark'}`, 'info');
  },
  compactMode: loadStorage('saif_compact', false),
  setCompactMode: (compact) => {
    saveStorage('saif_compact', compact);
    set({ compactMode: compact });
  },

  // Toasts
  toasts: [],
  addToast: (text, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    set((state) => ({ toasts: [...state.toasts.slice(-4), { id, text, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 3200);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Audio Playback Controls
  playSong: (song, newQueue) => {
    const state = get();
    const queue = newQueue || (state.queue.length > 0 ? state.queue : state.songs);
    let queueIdx = queue.findIndex((s) => s.id === song.id);
    if (queueIdx === -1) {
      queueIdx = 0;
    }

    // Crossfade handling
    if (state.isPlaying && state.crossfadeSeconds > 0) {
      audioEngine.crossfadeTo(song.audioToneType || 'synthwave', state.crossfadeSeconds);
    } else {
      audioEngine.playTone(song.audioToneType || 'synthwave');
    }

    // Media Session API
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album,
        artwork: [
          { src: song.cover, sizes: '96x96', type: 'image/jpeg' },
          { src: song.cover, sizes: '192x192', type: 'image/jpeg' },
          { src: song.cover, sizes: '512x512', type: 'image/jpeg' },
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => get().togglePlayPause());
      navigator.mediaSession.setActionHandler('pause', () => get().togglePlayPause());
      navigator.mediaSession.setActionHandler('previoustrack', () => get().playPrevious());
      navigator.mediaSession.setActionHandler('nexttrack', () => get().playNext());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) {
          get().seek(details.seekTime);
        }
      });
    }

    // Update Recently Played
    const filteredRecent = state.recentlyPlayed.filter((s) => s.id !== song.id);
    const updatedRecent = [song, ...filteredRecent].slice(0, 30);
    saveStorage('saif_recent_played', updatedRecent);

    // Playback loop ticker
    if (playbackTimer) clearInterval(playbackTimer);
    playbackTimer = window.setInterval(() => {
      const curState = get();
      if (!curState.isPlaying) return;
      const nextTime = curState.currentTime + 1;
      if (nextTime >= curState.duration) {
        // Track finished
        if (curState.repeat === 'one') {
          curState.seek(0);
        } else {
          curState.playNext();
        }
      } else {
        set({ currentTime: nextTime });
      }
    }, 1000);

    set({
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
      duration: song.duration,
      queue,
      queueIndex: queueIdx,
      recentlyPlayed: updatedRecent
    });
  },

  togglePlayPause: () => {
    const { currentSong, isPlaying, songs, playSong } = get();
    if (!currentSong) {
      if (songs.length > 0) {
        playSong(songs[0]);
      }
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
      if (playbackTimer) {
        clearInterval(playbackTimer);
        playbackTimer = null;
      }
      set({ isPlaying: false });
    } else {
      audioEngine.resume();
      if (playbackTimer) clearInterval(playbackTimer);
      playbackTimer = window.setInterval(() => {
        const curState = get();
        if (!curState.isPlaying) return;
        const nextTime = curState.currentTime + 1;
        if (nextTime >= curState.duration) {
          if (curState.repeat === 'one') {
            curState.seek(0);
          } else {
            curState.playNext();
          }
        } else {
          set({ currentTime: nextTime });
        }
      }, 1000);
      set({ isPlaying: true });
    }
  },

  playNext: () => {
    const { queue, queueIndex, shuffle, repeat, playSong } = get();
    if (queue.length === 0) return;
    if (repeat === 'one') {
      get().seek(0);
      return;
    }

    let nextIdx: number;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length) {
        if (repeat === 'all') {
          nextIdx = 0;
        } else {
          // Finished playlist
          audioEngine.stop();
          set({ isPlaying: false, currentTime: 0 });
          return;
        }
      }
    }
    playSong(queue[nextIdx], queue);
  },

  playPrevious: () => {
    const { queue, queueIndex, currentTime, playSong } = get();
    if (queue.length === 0) return;

    // If past 3 seconds, replay current song
    if (currentTime > 3) {
      get().seek(0);
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    playSong(queue[prevIdx], queue);
  },

  seek: (time) => {
    const boundedTime = Math.max(0, Math.min(get().duration, time));
    set({ currentTime: boundedTime });
  },

  setVolume: (vol) => {
    audioEngine.setVolume(vol);
    saveStorage('saif_vol', vol);
    set({ volume: vol, isMuted: vol === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume, previousVolume } = get();
    if (isMuted) {
      const restore = previousVolume > 0 ? previousVolume : 0.8;
      audioEngine.setVolume(restore);
      set({ isMuted: false, volume: restore });
    } else {
      audioEngine.setVolume(0);
      set({ isMuted: true, previousVolume: volume, volume: 0 });
    }
  },

  setPlaybackSpeed: (speed) => {
    audioEngine.setPlaybackSpeed(speed);
    set({ playbackSpeed: speed });
    get().addToast(`Playback speed: ${speed}x`, 'info');
  },

  toggleShuffle: () => {
    set((state) => {
      const nextShuffle = !state.shuffle;
      get().addToast(`Shuffle ${nextShuffle ? 'On' : 'Off'}`, 'info');
      return { shuffle: nextShuffle };
    });
  },

  cycleRepeat: () => {
    set((state) => {
      const nextRepeat: RepeatMode =
        state.repeat === 'off' ? 'all' : state.repeat === 'all' ? 'one' : 'off';
      get().addToast(
        nextRepeat === 'off'
          ? 'Repeat Off'
          : nextRepeat === 'all'
          ? 'Repeat All'
          : 'Repeat Current Song',
        'info'
      );
      return { repeat: nextRepeat };
    });
  },

  addToQueue: (song) => {
    set((state) => {
      const newQueue = [...state.queue, song];
      get().addToast(`"${song.title}" added to queue`, 'success');
      return { queue: newQueue };
    });
  },

  playSongNextInQueue: (song) => {
    set((state) => {
      const newQueue = [...state.queue];
      newQueue.splice(state.queueIndex + 1, 0, song);
      get().addToast(`"${song.title}" will play next`, 'success');
      return { queue: newQueue };
    });
  },

  removeFromQueue: (index) => {
    set((state) => {
      const newQueue = state.queue.filter((_, i) => i !== index);
      let newIndex = state.queueIndex;
      if (index < state.queueIndex) {
        newIndex--;
      }
      return { queue: newQueue, queueIndex: Math.max(0, newIndex) };
    });
  },

  reorderQueue: (from, to) => {
    set((state) => {
      const newQueue = [...state.queue];
      const [moved] = newQueue.splice(from, 1);
      newQueue.splice(to, 0, moved);
      return { queue: newQueue };
    });
  },

  clearQueue: () => {
    set((state) => {
      const cur = state.currentSong;
      return { queue: cur ? [cur] : [], queueIndex: 0 };
    });
    get().addToast('Queue cleared', 'info');
  },

  clearHistory: () => {
    saveStorage('saif_recent_played', []);
    set({ recentlyPlayed: [] });
    get().addToast('Recently played history cleared', 'info');
  },

  // Playlist Management
  createPlaylist: (name, description, cover) => {
    const newPlaylist: Playlist = {
      id: 'playlist-' + Date.now(),
      name: name.trim() || 'My Playlist',
      description: description.trim() || 'Created with Saif',
      cover:
        cover ||
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      songCount: 0,
      songs: [],
      createdAt: new Date().toISOString().split('T')[0],
      isCustom: true
    };
    set((state) => {
      const updated = [newPlaylist, ...state.playlists];
      saveStorage('saif_playlists', updated);
      get().addToast(`Playlist "${newPlaylist.name}" created`, 'success');
      return { playlists: updated, isCreatePlaylistOpen: false };
    });
  },

  addSongToPlaylist: (playlistId, songId) => {
    set((state) => {
      const updated = state.playlists.map((pl) => {
        if (pl.id === playlistId) {
          if (pl.songs.includes(songId)) return pl;
          return {
            ...pl,
            songs: [...pl.songs, songId],
            songCount: pl.songs.length + 1
          };
        }
        return pl;
      });
      saveStorage('saif_playlists', updated);
      get().addToast('Added to playlist', 'success');
      return { playlists: updated, isAddToPlaylistOpen: false, targetSongForPlaylist: null };
    });
  },

  removeSongFromPlaylist: (playlistId, songId) => {
    set((state) => {
      const updated = state.playlists.map((pl) => {
        if (pl.id === playlistId) {
          const songs = pl.songs.filter((s) => s !== songId);
          return { ...pl, songs, songCount: songs.length };
        }
        return pl;
      });
      saveStorage('saif_playlists', updated);
      get().addToast('Song removed from playlist', 'info');
      return { playlists: updated };
    });
  },

  deletePlaylist: (playlistId) => {
    set((state) => {
      const updated = state.playlists.filter((p) => p.id !== playlistId);
      saveStorage('saif_playlists', updated);
      get().addToast('Playlist deleted', 'info');
      return { playlists: updated, activeView: 'playlists' };
    });
  },

  // Offline / Download Simulation
  downloadedSongIds: loadStorage('saif_downloaded', ['song-1', 'song-6']),
  toggleDownloadSong: (id) => {
    set((state) => {
      const isDownloaded = state.downloadedSongIds.includes(id);
      const updated = isDownloaded
        ? state.downloadedSongIds.filter((x) => x !== id)
        : [...state.downloadedSongIds, id];
      saveStorage('saif_downloaded', updated);
      get().addToast(
        isDownloaded ? 'Removed from offline storage' : 'Song saved for offline playback',
        'success'
      );
      return { downloadedSongIds: updated };
    });
  },

  syncTime: (time) => set({ currentTime: time })
}));
