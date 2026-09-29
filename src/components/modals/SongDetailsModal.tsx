import React from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, FileText, Music, Disc, Calendar, Layers, Clock, Cpu } from 'lucide-react';

export const SongDetailsModal: React.FC = () => {
  const { isDetailsModalOpen, setDetailsModalOpen, detailsSong } = usePlayerStore();

  if (!isDetailsModalOpen || !detailsSong) return null;

  const rows = [
    { label: 'Title', value: detailsSong.title, icon: Music },
    { label: 'Artist', value: detailsSong.artist, icon: Music },
    { label: 'Album', value: detailsSong.album, icon: Disc },
    { label: 'Duration', value: detailsSong.durationFormatted, icon: Clock },
    { label: 'Genre', value: detailsSong.genre, icon: Layers },
    { label: 'Release Year', value: detailsSong.year.toString(), icon: Calendar },
    { label: 'File Format', value: detailsSong.fileFormat, icon: FileText },
    { label: 'Bitrate', value: detailsSong.bitrate, icon: Cpu },
    { label: 'Sample Rate', value: detailsSong.sampleRate, icon: Cpu },
    { label: 'File Size', value: detailsSong.fileSize, icon: FileText },
    { label: 'Composer', value: detailsSong.composer || 'Unknown', icon: FileText },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-md bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img
              src={detailsSong.cover}
              alt={detailsSong.title}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Track Details</h3>
              <p className="text-xs text-[#A9ADB7] truncate max-w-[200px]">{detailsSong.title}</p>
            </div>
          </div>

          <button
            onClick={() => setDetailsModalOpen(false)}
            className="p-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#A9ADB7] hover:text-white transition-all"
            aria-label="Close track details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Details Grid */}
        <div className="py-4 space-y-2.5">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-start justify-between p-3 rounded-2xl bg-[#242731]/70 border border-white/[0.04]"
              >
                <div className="flex items-center gap-2.5 text-[#6F7480] text-xs font-semibold">
                  <Icon className="w-3.5 h-3.5 text-[#FF8A1F]" />
                  <span>{row.label}</span>
                </div>
                <span className="text-xs font-medium text-white text-right max-w-[220px] break-words">
                  {row.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
