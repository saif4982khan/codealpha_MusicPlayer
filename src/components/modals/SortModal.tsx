import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { SortField } from '../../types';
import {
  X,
  ArrowUpAZ,
  ArrowDownAZ,
  User,
  Disc3,
  Clock,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';

export const SortModal: React.FC = () => {
  const { isSortModalOpen, setSortModalOpen, activeSort, setActiveSort } = usePlayerStore();

  if (!isSortModalOpen) return null;

  const sortOptions: { id: SortField; label: string; icon: React.ElementType }[] = [
    { id: 'title-asc', label: 'Ascending (A–Z)', icon: ArrowUpAZ },
    { id: 'title-desc', label: 'Descending (Z–A)', icon: ArrowDownAZ },
    { id: 'artist', label: 'Artist', icon: User },
    { id: 'album', label: 'Album', icon: Disc3 },
    { id: 'duration', label: 'Duration', icon: Clock },
    { id: 'dateAdded', label: 'Date Added', icon: Calendar },
    { id: 'dateModified', label: 'Date Modified', icon: Calendar },
    { id: 'composer', label: 'Composer', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-sm bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <h3 className="text-base font-bold text-white tracking-tight">Sort By</h3>
          <button
            onClick={() => setSortModalOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close sort modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="py-3 space-y-1.5">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = activeSort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveSort(opt.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-[#292D36] text-[#FF8A1F] border border-[#FF8A1F]/30 font-semibold'
                    : 'text-[#A9ADB7] hover:bg-[#242731] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-[#FF8A1F]' : 'text-[#6F7480]'
                    }`}
                  />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#FF8A1F]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
