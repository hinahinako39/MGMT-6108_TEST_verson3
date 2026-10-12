import React, { useState, useRef, useCallback, useEffect } from 'react';
import { AppProfile } from '../types/comparison';
import { ExternalLink, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface DiffSliderProps {
  leftApp: AppProfile;
  rightApp: AppProfile;
  refreshKey: number;
}

export const DiffSlider: React.FC<DiffSliderProps> = ({
  leftApp,
  rightApp,
  refreshKey,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [mode, setMode] = useState<'wipe' | 'blend'>('wipe');
  const [opacity, setOpacity] = useState<number>(50);
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
      const offset = clientX - rect.left;
      const pct = (offset / rect.width) * 100;
      setSliderPosition(Math.max(2, Math.min(98, pct)));
    },
    [isDragging]
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

  return (
    <div className="flex flex-col h-full w-full p-4 gap-3 bg-neutral-950">
      {/* Diff Controls Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-neutral-800 text-neutral-200">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-200">Overlay & Curtain Comparator</h2>
            <p className="text-xs text-neutral-400">
              Drag the divider or adjust opacity to inspect layout alignment and typography
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setMode('wipe')}
              className={`px-3 py-1 rounded font-medium transition ${
                mode === 'wipe' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Curtain Wipe
            </button>
            <button
              onClick={() => setMode('blend')}
              className={`px-3 py-1 rounded font-medium transition ${
                mode === 'blend' ? 'bg-indigo-600 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Alpha Blend
            </button>
          </div>

          {mode === 'blend' && (
            <div className="flex items-center space-x-2 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
              <span className="text-xs text-neutral-400">NYT</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-neutral-400">Stitch</span>
            </div>
          )}

          {/* Quick preset positions */}
          {mode === 'wipe' && (
            <div className="hidden sm:flex items-center space-x-1 text-xs font-mono text-neutral-400">
              <button
                onClick={() => setSliderPosition(25)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                25%
              </button>
              <button
                onClick={() => setSliderPosition(50)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                50%
              </button>
              <button
                onClick={() => setSliderPosition(75)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300"
              >
                75%
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Interactive Comparison Stage */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden select-none"
      >
        {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize select-none bg-transparent" />}

        {mode === 'wipe' ? (
          <>
            {/* Base layer: Right App (Stitch News) */}
            <div className="absolute inset-0 w-full h-full">
              <iframe
                key={`right-${refreshKey}`}
                src={rightApp.url}
                title={rightApp.name}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>

            {/* Top clipped layer: Left App (NYT) */}
            <div
              className="absolute inset-0 h-full overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Fix the inner iframe width to 100% of the parent container so layout does not squish */}
              <div
                className="h-full"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw',
                }}
              >
                <iframe
                  key={`left-${refreshKey}`}
                  src={leftApp.url}
                  title={leftApp.name}
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>

            {/* Draggable Divider Handle Line */}
            <div
              onMouseDown={startDragging}
              onTouchStart={startDragging}
              style={{ left: `${sliderPosition}%` }}
              className="absolute top-0 bottom-0 w-1 bg-indigo-500 z-30 cursor-col-resize -translate-x-1/2 hover:w-1.5 transition-all shadow-[0_0_10px_rgba(99,102,241,0.8)]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold pointer-events-none">
                ↔
              </div>
            </div>

            {/* Label Tags on Top Left & Top Right */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none bg-neutral-900/90 border border-neutral-700 px-2.5 py-1 rounded text-xs text-amber-400 font-semibold shadow-lg backdrop-blur-xs">
              Left: {leftApp.shortName} ({Math.round(sliderPosition)}%)
            </div>
            <div className="absolute top-3 right-3 z-20 pointer-events-none bg-neutral-900/90 border border-neutral-700 px-2.5 py-1 rounded text-xs text-sky-400 font-semibold shadow-lg backdrop-blur-xs">
              Right: {rightApp.shortName} ({Math.round(100 - sliderPosition)}%)
            </div>
          </>
        ) : (
          /* Alpha Blend Mode */
          <div className="relative w-full h-full">
            {/* Background: Left App */}
            <div className="absolute inset-0 w-full h-full">
              <iframe
                key={`left-blend-${refreshKey}`}
                src={leftApp.url}
                title={leftApp.name}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
            {/* Foreground: Right App with adjustable opacity */}
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-150"
              style={{ opacity: opacity / 100 }}
            >
              <iframe
                key={`right-blend-${refreshKey}`}
                src={rightApp.url}
                title={rightApp.name}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-neutral-900/90 border border-neutral-700 px-4 py-1.5 rounded-full text-xs text-neutral-200 shadow-xl backdrop-blur-xs font-mono">
              NYT Digital {100 - opacity}% / Stitch News {opacity}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
