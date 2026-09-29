import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import {
  X,
  PlaySquare,
  ListPlus,
  FolderPlus,
  Disc3,
  User,
  Info,
  BellRing,
  Ban,
  Share2,
  Trash2,
  Download,
  Heart
} from 'lucide-react';

export const ContextMenu: React.FC = () => {
  const {
    isContextMenuOpen,
    contextMenuSong,
    closeContextMenu,
    playSongNextInQueue,
    addToQueue,
    setAddToPlaylistOpen,
    navigateTo,
    setDetailsModalOpen,
    toggleDownloadSong,
    downloadedSongIds,
    toggleFavoriteSong,
    likedSongIds,
    addToast
  } = usePlayerStore();

  if (!isContextMenuOpen || !contextMenuSong) return null;

  const isDownloaded = downloadedSongIds.includes(contextMenuSong.id);
  const isLiked = likedSongIds.includes(contextMenuSong.id);

  const handleAction = (callback: () => void) => {
    callback();
    closeContextMenu();
  };

  const handleShare = async () => {
    closeContextMenu();
    if (navigator.share) {
      try {
        await navigator.share({
          title: contextMenuSong.title,
          text: `Check out ${contextMenuSong.title} by ${contextMenuSong.artist} on Saif`,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(
          `Check out ${contextMenuSong.title} by ${contextMenuSong.artist} on Saif! ${window.location.href}`
        );
        addToast('Link copied to clipboard', 'success');
      }
    } else {
      navigator.clipboard.writeText(
        `Check out ${contextMenuSong.title} by ${contextMenuSong.artist} on Saif! ${window.location.href}`
      );
      addToast('Link copied to clipboard', 'success');
    }
  };

  return (
    <div
      onClick={closeContextMenu}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1D2028] border-t sm:border border-white/[0.08] rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar"
      >
        {/* Track preview banner */}
        <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/[0.06]">
          <img
            src={contextMenuSong.cover}
            alt={contextMenuSong.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate">{contextMenuSong.title}</h4>
            <p className="text-xs text-[#A9ADB7] truncate">{contextMenuSong.artist}</p>
          </div>
          <button
            onClick={closeContextMenu}
            className="p-2 rounded-xl bg-[#292D36] text-[#A9ADB7] hover:text-white"
            aria-label="Close context menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action list */}
        <div className="space-y-1">
          <button
            onClick={() => handleAction(() => playSongNextInQueue(contextMenuSong))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <PlaySquare className="w-4 h-4 text-[#FF8A1F]" />
            <span>Play Next</span>
          </button>

          <button
            onClick={() => handleAction(() => addToQueue(contextMenuSong))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <ListPlus className="w-4 h-4 text-[#FF8A1F]" />
            <span>Add to Playing Queue</span>
          </button>

          <button
            onClick={() => handleAction(() => setAddToPlaylistOpen(true, contextMenuSong))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <FolderPlus className="w-4 h-4 text-[#A9ADB7]" />
            <span>Add to Playlist</span>
          </button>

          <button
            onClick={() => handleAction(() => toggleFavoriteSong(contextMenuSong.id))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked ? 'fill-[#FF8A1F] text-[#FF8A1F]' : 'text-[#A9ADB7]'
              }`}
            />
            <span>{isLiked ? 'Remove from Favorites' : 'Add to Favorites'}</span>
          </button>

          <button
            onClick={() =>
              handleAction(() => navigateTo('album-detail', contextMenuSong.albumId))
            }
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <Disc3 className="w-4 h-4 text-[#A9ADB7]" />
            <span>Go to Album</span>
          </button>

          <button
            onClick={() =>
              handleAction(() => navigateTo('artist-detail', contextMenuSong.artistId))
            }
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <User className="w-4 h-4 text-[#A9ADB7]" />
            <span>Go to Artist</span>
          </button>

          <button
            onClick={() => handleAction(() => setDetailsModalOpen(true, contextMenuSong))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <Info className="w-4 h-4 text-[#A9ADB7]" />
            <span>Details</span>
          </button>

          <button
            onClick={() => handleAction(() => toggleDownloadSong(contextMenuSong.id))}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <Download className="w-4 h-4 text-[#A9ADB7]" />
            <span>{isDownloaded ? 'Remove from Offline' : 'Save for Offline'}</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <Share2 className="w-4 h-4 text-[#A9ADB7]" />
            <span>Share</span>
          </button>

          <button
            onClick={() =>
              handleAction(() =>
                addToast(
                  'Ringtone setup is managed through your device system audio settings.',
                  'info'
                )
              )
            }
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-[#A9ADB7] hover:text-white hover:bg-[#242731] transition-all"
          >
            <BellRing className="w-4 h-4 text-[#A9ADB7]" />
            <span>Set as Ringtone</span>
          </button>

          <button
            onClick={() =>
              handleAction(() => addToast(`Added "${contextMenuSong.title}" to blocklist`, 'info'))
            }
            className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Ban className="w-4 h-4" />
            <span>Add to Blocklist</span>
          </button>
        </div>
      </div>
    </div>
  );
};
