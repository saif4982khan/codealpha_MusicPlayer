import React from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import {
  Palette,
  PlaySquare,
  Sliders,
  FolderSync,
  Info,
  RotateCcw
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    themeMode,
    setThemeMode,
    compactMode,
    setCompactMode,
    crossfadeSeconds,
    setCrossfadeSeconds,
    gaplessEnabled,
    setGaplessEnabled,
    playbackSpeed,
    setPlaybackSpeed,
    visualizerMode,
    setVisualizerMode,
    setEqualizerOpen,
    clearHistory,
    resetOnboarding,
    addToast
  } = usePlayerStore();

  const handleScanLibrary = () => {
    addToast('Scanning local audio cache...', 'info');
    setTimeout(() => {
      addToast('Library scan complete: 10 audio tracks indexed', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-32 max-w-3xl">
      {/* Header */}
      <div className="pt-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Settings</h2>
        <p className="text-xs text-[#A9ADB7]">
          Customize audio playback, theme appearance, and player preferences
        </p>
      </div>

      {/* Appearance Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Palette className="w-4 h-4 text-[#FF8A1F]" />
          <span>Appearance</span>
        </div>

        <div className="bg-[#242731] border border-white/[0.06] rounded-3xl p-5 space-y-4">
          {/* Theme Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div>
              <h4 className="text-sm font-bold text-white">Theme Palette</h4>
              <p className="text-xs text-[#A9ADB7]">
                Dark Charcoal (Official Saif) or OLED Pure Black
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setThemeMode('saif-dark')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  themeMode === 'saif-dark'
                    ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
                    : 'bg-[#292D36] text-[#A9ADB7] hover:text-white'
                }`}
              >
                Saif Charcoal
              </button>
              <button
                onClick={() => setThemeMode('oled-black')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  themeMode === 'oled-black'
                    ? 'bg-[#FF8A1F] text-white shadow-md shadow-[#FF8A1F]/30'
                    : 'bg-[#292D36] text-[#A9ADB7] hover:text-white'
                }`}
              >
                OLED Black
              </button>
            </div>
          </div>

          {/* Compact View Mode */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Compact Track Lists</h4>
              <p className="text-xs text-[#A9ADB7]">
                Reduce song list padding for higher information density
              </p>
            </div>

            <button
              onClick={() => setCompactMode(!compactMode)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                compactMode ? 'bg-[#FF8A1F]' : 'bg-[#292D36]'
              }`}
              aria-label="Toggle compact mode"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  compactMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Playback Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <PlaySquare className="w-4 h-4 text-[#FF8A1F]" />
          <span>Playback Engine</span>
        </div>

        <div className="bg-[#242731] border border-white/[0.06] rounded-3xl p-5 space-y-5">
          {/* Crossfade */}
          <div className="space-y-2 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Crossfade Duration</h4>
                <p className="text-xs text-[#A9ADB7]">
                  Smooth audio transition fade between consecutive tracks
                </p>
              </div>
              <span className="text-xs font-bold text-[#FF8A1F] px-2.5 py-1 rounded-lg bg-[#FF8A1F]/15">
                {crossfadeSeconds === 0 ? 'Off' : `${crossfadeSeconds}s`}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {[0, 2, 4, 6, 8, 10].map((sec) => (
                <button
                  key={sec}
                  onClick={() => setCrossfadeSeconds(sec)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    crossfadeSeconds === sec
                      ? 'bg-[#FF8A1F] text-white shadow-sm'
                      : 'bg-[#292D36] text-[#A9ADB7] hover:text-white'
                  }`}
                >
                  {sec === 0 ? '0s' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Gapless Playback */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h4 className="text-sm font-bold text-white">Gapless Playback</h4>
              <p className="text-xs text-[#A9ADB7]">
                Eliminate silence between album tracks
              </p>
            </div>

            <button
              onClick={() => setGaplessEnabled(!gaplessEnabled)}
              className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                gaplessEnabled ? 'bg-[#FF8A1F]' : 'bg-[#292D36]'
              }`}
              aria-label="Toggle gapless playback"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  gaplessEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Playback Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Playback Speed</h4>
                <p className="text-xs text-[#A9ADB7]">
                  Adjust tempo for acoustic study or podcasts
                </p>
              </div>
              <span className="text-xs font-bold text-[#FF8A1F] px-2.5 py-1 rounded-lg bg-[#FF8A1F]/15">
                {playbackSpeed}x
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    playbackSpeed === spd
                      ? 'bg-[#FF8A1F] text-white shadow-sm'
                      : 'bg-[#292D36] text-[#A9ADB7] hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audio & Visual FX */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Sliders className="w-4 h-4 text-[#FF8A1F]" />
          <span>Audio Processing & Visual FX</span>
        </div>

        <div className="bg-[#242731] border border-white/[0.06] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <div>
              <h4 className="text-sm font-bold text-white">Hardware Equalizer</h4>
              <p className="text-xs text-[#A9ADB7]">
                5-band graphic EQ filter nodes with musical presets
              </p>
            </div>
            <button
              onClick={() => setEqualizerOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-white text-xs font-bold transition-all"
            >
              Open EQ
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Visualizer Default Mode</h4>
              <p className="text-xs text-[#A9ADB7]">Real-time frequency rendering style</p>
            </div>

            <div className="flex items-center gap-2">
              {(['bars', 'wave', 'circle', 'off'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setVisualizerMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                    visualizerMode === mode
                      ? 'bg-[#FF8A1F] text-white'
                      : 'bg-[#292D36] text-[#A9ADB7] hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Library Data Management */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <FolderSync className="w-4 h-4 text-[#FF8A1F]" />
          <span>Library & Storage</span>
        </div>

        <div className="bg-[#242731] border border-white/[0.06] rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Rescan Media Library</h4>
              <p className="text-xs text-[#A9ADB7]">
                Check for newly added audio tracks and update local tags
              </p>
            </div>
            <button
              onClick={handleScanLibrary}
              className="px-4 py-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-white text-xs font-bold transition-all"
            >
              Scan Now
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div>
              <h4 className="text-sm font-bold text-white">Clear Playback History</h4>
              <p className="text-xs text-[#A9ADB7]">Remove songs from Recently Played</p>
            </div>
            <button
              onClick={clearHistory}
              className="px-4 py-2 rounded-xl bg-[#292D36] hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      {/* About & Onboarding */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Info className="w-4 h-4 text-[#FF8A1F]" />
          <span>About Saif</span>
        </div>

        <div className="bg-[#242731] border border-white/[0.06] rounded-3xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h4 className="text-sm font-bold text-white">Saif Music Player</h4>
              <p className="text-xs text-[#A9ADB7]">
                Designed after Saif Mobile UI Kit • Production Web Audio Engine
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#FF8A1F]/20 text-[#FF8A1F] text-xs font-bold">
              v2.5.0 Pro
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Reset Onboarding Tour</h4>
              <p className="text-xs text-[#A9ADB7]">Replay the intro onboarding screens</p>
            </div>
            <button
              onClick={resetOnboarding}
              className="px-4 py-2 rounded-xl bg-[#292D36] hover:bg-[#30343E] text-[#FF8A1F] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tour</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
