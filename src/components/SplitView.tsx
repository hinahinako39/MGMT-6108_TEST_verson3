import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppProfile, LayoutMode } from '../types/comparison';
import { IFrameCard } from './IFrameCard';
import { GripVertical, GripHorizontal } from 'lucide-react';

interface SplitViewProps {
  leftApp: AppProfile;
  rightApp: AppProfile;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  onUpdateLeftUrl: (url: string) => void;
  onUpdateRightUrl: (url: string) => void;
  refreshKey: number;
}

export const SplitView: React.FC<SplitViewProps> = ({
  leftApp,
  rightApp,
  layoutMode,
  setLayoutMode,
  onUpdateLeftUrl,
  onUpdateRightUrl,
  refreshKey,
}) => {
  // Percentage for split pane (default 50%)
  const [splitRatio, setSplitRatio] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDragging = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      let ratio: number;
      if (layoutMode === 'split-horizontal') {
        const offset = clientX - rect.left;
        ratio = (offset / rect.width) * 100;
      } else {
        const offset = clientY - rect.top;
        ratio = (offset / rect.height) * 100;
      }

      // Constrain between 15% and 85%
      const constrainedRatio = Math.max(15, Math.min(85, ratio));
      setSplitRatio(constrainedRatio);
    },
    [isDragging, layoutMode]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchmove', onDrag);
      window.addEventListener('touchend', stopDragging);
    } else {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
    }

    return () => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onDrag);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, onDrag, stopDragging]);

  // If focus left or right
  if (layoutMode === 'focus-left') {
    return (
      <div className="relative w-full h-full p-2 flex flex-col">
        <div className="absolute top-4 right-6 z-20 flex items-center space-x-2 bg-neutral-900/90 border border-neutral-700 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs">
          <span className="text-xs text-neutral-300">Solo View: {leftApp.shortName}</span>
          <button
            onClick={() => setLayoutMode('split-horizontal')}
            className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-0.5 rounded bg-neutral-800"
          >
            Back to Split
          </button>
        </div>
        <IFrameCard
          side="left"
          app={leftApp}
          onUpdateUrl={onUpdateLeftUrl}
          refreshKey={refreshKey}
        />
      </div>
    );
  }

  if (layoutMode === 'focus-right') {
    return (
      <div className="relative w-full h-full p-2 flex flex-col">
        <div className="absolute top-4 right-6 z-20 flex items-center space-x-2 bg-neutral-900/90 border border-neutral-700 px-3 py-1.5 rounded-full shadow-lg backdrop-blur-xs">
          <span className="text-xs text-neutral-300">Solo View: {rightApp.shortName}</span>
          <button
            onClick={() => setLayoutMode('split-horizontal')}
            className="text-xs text-sky-400 hover:text-sky-300 font-medium px-2 py-0.5 rounded bg-neutral-800"
          >
            Back to Split
          </button>
        </div>
        <IFrameCard
          side="right"
          app={rightApp}
          onUpdateUrl={onUpdateRightUrl}
          refreshKey={refreshKey}
        />
      </div>
    );
  }

  const isHorizontal = layoutMode === 'split-horizontal';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full p-2 flex select-none overflow-hidden ${
        isHorizontal ? 'flex-row' : 'flex-col'
      }`}
    >
      {/* Invisible overlay while dragging to prevent iframes from stealing mouse events */}
      {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize select-none bg-transparent" />}

      {/* Left/Top App Pane */}
      <div
        style={{
          width: isHorizontal ? `${splitRatio}%` : '100%',
          height: isHorizontal ? '100%' : `${splitRatio}%`,
        }}
        className="flex min-w-[200px] min-h-[150px] transition-none"
      >
        <IFrameCard
          side="left"
          app={leftApp}
          onUpdateUrl={onUpdateLeftUrl}
          refreshKey={refreshKey}
        />
      </div>

      {/* Draggable Divider Handle */}
      <div
        onMouseDown={startDragging}
        onTouchStart={startDragging}
        role="separator"
        aria-valuenow={Math.round(splitRatio)}
        aria-valuemin={15}
        aria-valuemax={85}
        tabIndex={0}
        className={`group relative flex items-center justify-center shrink-0 z-20 transition-colors ${
          isHorizontal
            ? 'w-3 h-full cursor-col-resize hover:bg-neutral-800/80'
            : 'h-3 w-full cursor-row-resize hover:bg-neutral-800/80'
        } ${isDragging ? 'bg-amber-500/20' : ''}`}
      >
        <div
          className={`flex items-center justify-center rounded-full bg-neutral-800 border border-neutral-700 group-hover:border-neutral-500 text-neutral-400 group-hover:text-neutral-200 transition shadow-md ${
            isHorizontal ? 'w-5 h-10 py-1' : 'w-10 h-5 px-1'
          }`}
        >
          {isHorizontal ? (
            <GripVertical className="w-3.5 h-3.5" />
          ) : (
            <GripHorizontal className="w-3.5 h-3.5" />
          )}
        </div>

        {/* Floating Quick Preset Split Pill on Hover */}
        <div className="absolute -top-1 opacity-0 group-hover:opacity-100 transition pointer-events-auto bg-neutral-900 border border-neutral-700 rounded-md px-1.5 py-0.5 shadow-xl flex items-center gap-1 z-30 text-[10px] text-neutral-300 font-mono">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSplitRatio(30);
            }}
            className="hover:text-amber-400 px-1 hover:bg-neutral-800 rounded"
          >
            30%
          </button>
          <span>|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSplitRatio(50);
            }}
            className="hover:text-amber-400 px-1 hover:bg-neutral-800 rounded"
          >
            50%
          </button>
          <span>|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSplitRatio(70);
            }}
            className="hover:text-amber-400 px-1 hover:bg-neutral-800 rounded"
          >
            70%
          </button>
        </div>
      </div>

      {/* Right/Bottom App Pane */}
      <div
        style={{
          width: isHorizontal ? `${100 - splitRatio}%` : '100%',
          height: isHorizontal ? '100%' : `${100 - splitRatio}%`,
        }}
        className="flex min-w-[200px] min-h-[150px] transition-none"
      >
        <IFrameCard
          side="right"
          app={rightApp}
          onUpdateUrl={onUpdateRightUrl}
          refreshKey={refreshKey}
        />
      </div>
    </div>
  );
};
