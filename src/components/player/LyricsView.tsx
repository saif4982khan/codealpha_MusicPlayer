import React, { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { X, Search, Sparkles } from 'lucide-react';

export const LyricsView: React.FC = () => {
  const {
    isLyricsOpen,
    setLyricsOpen,
    currentSong,
    currentTime,
    seek
  } = usePlayerStore();

  const [searchFilter, setSearchFilter] = useState('');
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active line smoothly
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentTime]);

  if (!isLyricsOpen || !currentSong) return null;

  const lyrics = currentSong.lyrics || [];

  // Find active line index based on current time
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  const filteredLyrics = searchFilter
    ? lyrics.filter((l) => l.text.toLowerCase().includes(searchFilter.toLowerCase()))
    : lyrics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#1D2028] border border-white/[0.08] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#242731]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <h3 className="text-sm font-bold text-white truncate">{currentSong.title}</h3>
              <p className="text-xs text-[#A9ADB7] truncate">{currentSong.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-[#6F7480] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lyric line..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="bg-[#1D2028] border border-white/[0.08] focus:border-[#FF8A1F] rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-[#6F7480] outline-none"
              />
            </div>
            <button
              onClick={() => setLyricsOpen(false)}
              className="p-2 rounded-xl bg-[#292D36] hover:bg-white/[0.1] text-[#A9ADB7] hover:text-white transition-all"
              aria-label="Close lyrics"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrolling Lyrics Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto px-6 py-12 text-center space-y-6 no-scrollbar"
        >
          {filteredLyrics.length === 0 ? (
            <div className="text-[#6F7480] text-sm py-16">
              No lyrics matching "{searchFilter}"
            </div>
          ) : (
            filteredLyrics.map((line, index) => {
              const originalIndex = lyrics.findIndex((l) => l.time === line.time);
              const isActive = originalIndex === activeIndex;

              return (
                <div
                  key={line.time + index}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seek(line.time)}
                  className={`cursor-pointer transition-all duration-300 px-4 py-2 rounded-2xl select-none ${
                    isActive
                      ? 'text-[#FF8A1F] text-2xl sm:text-3xl font-extrabold scale-105 drop-shadow-[0_0_20px_rgba(255,138,31,0.5)]'
                      : 'text-[#6F7480] hover:text-white/80 text-lg sm:text-xl font-medium'
                  }`}
                >
                  {line.text}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-[#242731]/60 border-t border-white/[0.06] text-center text-xs text-[#6F7480]">
          Click any line to jump to that moment in the track
        </div>
      </div>
    </div>
  );
};
