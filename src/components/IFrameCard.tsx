import React, { useState, useRef } from 'react';
import {
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Smartphone,
  Tablet,
  Monitor,
  Maximize,
  Edit2,
  ZoomIn,
  AlertCircle
} from 'lucide-react';
import { AppProfile, DevicePreset } from '../types/comparison';
import { DEVICE_PRESETS } from '../data/comparisonData';

interface IFrameCardProps {
  side: 'left' | 'right';
  app: AppProfile;
  onUpdateUrl: (newUrl: string) => void;
  refreshKey: number;
}

export const IFrameCard: React.FC<IFrameCardProps> = ({
  side,
  app,
  onUpdateUrl,
  refreshKey,
}) => {
  const [device, setDevice] = useState<DevicePreset>('responsive');
  const [zoom, setZoom] = useState<number>(100);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(app.url);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDirectHelp, setShowDirectHelp] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentDevice = DEVICE_PRESETS.find((d) => d.id === device) || DEVICE_PRESETS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(app.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReload = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      // Force reload iframe
      const src = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = src;
        }
      }, 50);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = tempUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    onUpdateUrl(finalUrl);
    setIsEditingUrl(false);
    setIsLoading(true);
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
      {/* App Card Header */}
      <div className="bg-neutral-900/95 border-b border-neutral-800 p-3 flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Identity & Badge */}
          <div className="flex items-center space-x-2 min-w-0">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase ${
                side === 'left'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}
            >
              {side === 'left' ? 'LEFT APP' : 'RIGHT APP'}
            </span>
            <div className="truncate">
              <h2 className="text-xs font-semibold text-neutral-100 truncate flex items-center gap-1.5">
                {app.name}
              </h2>
            </div>
          </div>

          {/* Quick Actions (Open External, Copy, Reload) */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleCopy}
              title="Copy URL"
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleReload}
              title="Reload Frame"
              className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open directly in new tab"
              className="flex items-center space-x-1 p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline text-[11px]">Open Tab</span>
            </a>
          </div>
        </div>

        {/* URL Bar & Device Viewport bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          {/* URL Display / Inline Editor */}
          {isEditingUrl ? (
            <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-1">
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs px-2 py-1 rounded focus:outline-none focus:border-amber-500 font-mono"
                autoFocus
              />
              <button
                type="submit"
                className="px-2 py-1 bg-neutral-800 text-white rounded text-xs hover:bg-neutral-700 font-medium"
              >
                Go
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempUrl(app.url);
                  setIsEditingUrl(false);
                }}
                className="px-2 py-1 text-neutral-400 text-xs hover:text-white"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex-1 flex items-center min-w-[200px] bg-neutral-950/60 border border-neutral-800/80 rounded px-2 py-1 text-[11px] font-mono text-neutral-400 truncate group">
              <span className="text-emerald-500 mr-1.5">🔒</span>
              <span className="truncate text-neutral-300">{app.url}</span>
              <button
                onClick={() => setIsEditingUrl(true)}
                title="Edit URL"
                className="ml-auto opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-white transition"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Device & Zoom Controls */}
          <div className="flex items-center space-x-1 shrink-0 bg-neutral-950/80 p-0.5 rounded-lg border border-neutral-800">
            <button
              onClick={() => setDevice('responsive')}
              title="Full Fluid Responsive"
              className={`p-1 rounded ${
                device === 'responsive'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              title="Desktop View (1440px)"
              className={`p-1 rounded ${
                device === 'desktop'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              title="Tablet View (768px)"
              className={`p-1 rounded ${
                device === 'tablet'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              title="Mobile View (390px)"
              className={`p-1 rounded ${
                device === 'mobile'
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>

            {/* Zoom Selector */}
            <div className="border-l border-neutral-800 pl-1 ml-0.5 flex items-center">
              <ZoomIn className="w-3 h-3 text-neutral-500 mr-1" />
              <select
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="bg-transparent text-neutral-300 text-[10px] font-mono focus:outline-none cursor-pointer"
              >
                <option value={50} className="bg-neutral-900">50%</option>
                <option value={75} className="bg-neutral-900">75%</option>
                <option value={90} className="bg-neutral-900">90%</option>
                <option value={100} className="bg-neutral-900">100%</option>
                <option value={125} className="bg-neutral-900">125%</option>
              </select>
            </div>
          </div>
        </div>

        {/* App Meta Sub-strip */}
        <div className="flex items-center justify-between text-[11px] text-neutral-400 px-0.5">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-neutral-500">{app.framework}</span>
            <span className="text-neutral-700">•</span>
            <span className="text-neutral-400 truncate">{app.tagline}</span>
          </div>
          <button
            onClick={() => setShowDirectHelp(!showDirectHelp)}
            title="Troubleshooting tips"
            className="text-neutral-500 hover:text-neutral-300 text-[10px] shrink-0 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            <span>Info</span>
          </button>
        </div>

        {showDirectHelp && (
          <div className="bg-neutral-950/90 border border-neutral-800 p-2 rounded text-[11px] text-neutral-300 flex items-center justify-between gap-2">
            <span>
              If this frame fails to load due to browser third-party restrictions, click{' '}
              <a href={app.url} target="_blank" rel="noreferrer" className="text-amber-400 underline font-medium">
                Open Tab
              </a>{' '}
              to interact directly in a full window.
            </span>
            <button
              onClick={() => setShowDirectHelp(false)}
              className="text-neutral-400 hover:text-white px-1.5 py-0.5 bg-neutral-800 rounded text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Frame Body Area */}
      <div className="relative flex-1 w-full bg-neutral-950 overflow-auto flex items-center justify-center p-2">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-neutral-950/70 z-10 flex flex-col items-center justify-center pointer-events-none backdrop-blur-xs">
            <div className="w-8 h-8 border-2 border-neutral-700 border-t-amber-400 rounded-full animate-spin mb-2" />
            <p className="text-xs text-neutral-400 font-medium">Loading {app.shortName}...</p>
          </div>
        )}

        {device === 'responsive' ? (
          /* Full Responsive Mode */
          <div
            className="w-full h-full"
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
              width: zoom !== 100 ? `${100 / (zoom / 100)}%` : '100%',
              height: zoom !== 100 ? `${100 / (zoom / 100)}%` : '100%',
            }}
          >
            <iframe
              key={`${app.url}-${refreshKey}`}
              ref={iframeRef}
              src={app.url}
              title={app.name}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
            />
          </div>
        ) : (
          /* Emulated Device Viewport */
          <div
            className="flex flex-col items-center justify-center my-auto"
            style={{
              transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
              transformOrigin: 'top center',
            }}
          >
            {/* Device frame container */}
            <div
              className={`relative bg-neutral-900 border-4 border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
                device === 'mobile' ? 'rounded-[36px] border-[10px] border-neutral-800' : ''
              }`}
              style={{
                width: typeof currentDevice.width === 'number' ? `${currentDevice.width}px` : currentDevice.width,
                height: typeof currentDevice.height === 'number' ? `${currentDevice.height}px` : currentDevice.height,
              }}
            >
              {/* Mobile notch / dynamic island simulation */}
              {device === 'mobile' && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 pointer-events-none flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full ml-auto mr-2" />
                </div>
              )}

              <iframe
                key={`${app.url}-${refreshKey}-${device}`}
                ref={iframeRef}
                src={app.url}
                title={app.name}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                onLoad={() => setIsLoading(false)}
              />
            </div>
            <div className="text-[11px] text-neutral-500 font-mono mt-2">
              {currentDevice.name} • {currentDevice.userAgentDesc}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
