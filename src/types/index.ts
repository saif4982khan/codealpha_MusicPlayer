export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  durationFormatted: string; // e.g. "3:45"
  cover: string;
  audioUrl?: string;
  audioToneType?: 'synthwave' | 'lofi' | 'pop' | 'ambient' | 'acoustic' | 'rnb';
  genre: string;
  year: number;
  trackNumber: number;
  lyrics: LyricLine[];
  dateAdded: string;
  bitrate: string;
  sampleRate: string;
  fileSize: string;
  fileFormat: string;
  composer?: string;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  bio: string;
  monthlyListeners: string;
  verified: boolean;
  songCount: number;
  songs: string[]; // Song IDs
  albums: string[]; // Album IDs
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: number;
  songCount: number;
  totalDuration: string;
  genre: string;
  songs: string[]; // Song IDs
}

export interface Folder {
  id: string;
  name: string;
  songCount: number;
  totalDuration: string;
  songs: string[]; // Song IDs
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  songCount: number;
  songs: string[]; // Song IDs
  createdAt: string;
  isCustom?: boolean;
}

export type ViewType =
  | 'home'
  | 'search'
  | 'library'
  | 'songs'
  | 'artists'
  | 'artist-detail'
  | 'albums'
  | 'album-detail'
  | 'folders'
  | 'folder-detail'
  | 'playlists'
  | 'playlist-detail'
  | 'favorites'
  | 'recently-played'
  | 'settings';

export type SortField =
  | 'title-asc'
  | 'title-desc'
  | 'artist'
  | 'album'
  | 'duration'
  | 'dateAdded'
  | 'dateModified'
  | 'composer';

export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'off';

export type EQPreset =
  | 'flat'
  | 'bass'
  | 'treble'
  | 'vocal'
  | 'rock'
  | 'pop'
  | 'classical'
  | 'electronic';

export type RepeatMode = 'off' | 'all' | 'one';

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'success' | 'info' | 'warning';
  icon?: string;
}
