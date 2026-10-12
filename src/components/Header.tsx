import React from 'react';
import {
  Columns2,
  Rows2,
  ArrowLeftRight,
  RefreshCw,
  Maximize2,
  Minimize2,
  Split,
  Layers,
  FileSpreadsheet,
  CheckSquare
} from 'lucide-react';
import { LayoutMode } from '../types/comparison';

interface HeaderProps {
  activeTab: 'live' | 'diff' | 'features' | 'eval';
  setActiveTab: (tab: 'live' | 'diff' | 'features' | 'eval') => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  onSwap: () => void;
  onRefreshBoth: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  layoutMode,
  setLayoutMode,
  onSwap,
  onRefreshBoth,
  isFullscreen,
  toggleFullscreen,
}) => {
  return (
    <header className="bg-neutral-900 border-b border-neutral-800 text-white select-none z-30 sticky top-0">
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
            VS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-semibold tracking-wide text-neutral-100">
                App Comparator
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                Live Dual View
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Comparing NYT Digital vs. Stitch Newsroom
            </p>
          </div>
        </div>

        {/* Center: Main View Tabs */}
        <nav className="flex items-center p-1 bg-neutral-950/80 rounded-lg border border-neutral-800/80">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'live'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Split className="w-3.5 h-3.5 text-amber-400" />
            <span>Side-by-Side</span>
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'diff'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Diff Slider</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'features'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Feature Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('eval')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'eval'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scorecard & Notes</span>
          </button>
        </nav>

        {/* Right: Quick Tools */}
        <div className="flex items-center space-x-2">
          {activeTab === 'live' && (
            <div className="hidden lg:flex items-center space-x-1 bg-neutral-950/70 p-1 rounded-lg border border-neutral-800">
              <button
                onClick={() => setLayoutMode('split-horizontal')}
                title="Split Side-by-Side"
                className={`p-1.5 rounded ${
                  layoutMode === 'split-horizontal'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('split-vertical')}
                title="Split Stacked (Top/Bottom)"
                className={`p-1.5 rounded ${
                  layoutMode === 'split-vertical'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Rows2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('focus-left')}
                title="Focus Left App"
                className={`px-2 py-1 text-xs rounded font-medium ${
                  layoutMode === 'focus-left'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Left Only
              </button>
              <button
                onClick={() => setLayoutMode('focus-right')}
                title="Focus Right App"
                className={`px-2 py-1 text-xs rounded font-medium ${
                  layoutMode === 'focus-right'
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Right Only
              </button>
            </div>
          )}

          <button
            onClick={onSwap}
            title="Swap Left and Right apps"
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Swap</span>
          </button>

          <button
            onClick={onRefreshBoth}
            title="Reload both app frames"
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reload All</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
