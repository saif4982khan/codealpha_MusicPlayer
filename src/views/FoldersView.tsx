import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { Folder } from '../types';
import { FolderClosed, FolderOpen, ChevronRight } from 'lucide-react';

export const FoldersView: React.FC = () => {
  const { folders, navigateTo } = usePlayerStore();

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-xl font-bold text-white tracking-tight">Audio Folders</h2>
        <p className="text-xs text-[#A9ADB7]">
          Organized file system directory albums and collections
        </p>
      </div>

      {/* Grid of Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {folders.map((folder: Folder) => (
          <div
            key={folder.id}
            onClick={() => navigateTo('folder-detail', folder.id)}
            className="flex items-center justify-between p-4 rounded-3xl bg-[#292D36]/80 hover:bg-[#292D36] border border-white/[0.06] hover:border-[#FF8A1F]/40 cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-[#FF8A1F]/15 group-hover:bg-[#FF8A1F] text-[#FF8A1F] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0">
                <FolderClosed className="w-7 h-7 group-hover:hidden" />
                <FolderOpen className="w-7 h-7 hidden group-hover:block" />
              </div>

              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white group-hover:text-[#FF8A1F] transition-colors truncate">
                  {folder.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#A9ADB7] mt-1">
                  <span>{folder.songCount} songs</span>
                  <span>•</span>
                  <span>{folder.totalDuration}</span>
                </div>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-[#6F7480] group-hover:text-white transition-colors shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
