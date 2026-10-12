import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SplitView } from './components/SplitView';
import { DiffSlider } from './components/DiffSlider';
import { FeatureMatrix } from './components/FeatureMatrix';
import { EvaluationNotes } from './components/EvaluationNotes';
import { INITIAL_APPS } from './data/comparisonData';
import { AppProfile, LayoutMode } from './types/comparison';

export default function App() {
  const [apps, setApps] = useState<{ left: AppProfile; right: AppProfile }>(INITIAL_APPS);
  const [activeTab, setActiveTab] = useState<'live' | 'diff' | 'features' | 'eval'>('live');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('split-horizontal');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSwap = () => {
    setApps((prev) => ({
      left: { ...prev.right, id: 'left' },
      right: { ...prev.left, id: 'right' },
    }));
  };

  const handleRefreshBoth = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateLeftUrl = (newUrl: string) => {
    setApps((prev) => ({
      ...prev,
      left: {
        ...prev.left,
        url: newUrl,
      },
    }));
  };

  const handleUpdateRightUrl = (newUrl: string) => {
    setApps((prev) => ({
      ...prev,
      right: {
        ...prev.right,
        url: newUrl,
      },
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onSwap={handleSwap}
        onRefreshBoth={handleRefreshBoth}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Main Body depending on Active Tab */}
      <main className="flex-1 w-full h-[calc(100vh-53px)] overflow-hidden relative">
        {activeTab === 'live' && (
          <SplitView
            leftApp={apps.left}
            rightApp={apps.right}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            onUpdateLeftUrl={handleUpdateLeftUrl}
            onUpdateRightUrl={handleUpdateRightUrl}
            refreshKey={refreshKey}
          />
        )}

        {activeTab === 'diff' && (
          <DiffSlider
            leftApp={apps.left}
            rightApp={apps.right}
            refreshKey={refreshKey}
          />
        )}

        {activeTab === 'features' && (
          <FeatureMatrix
            leftApp={apps.left}
            rightApp={apps.right}
          />
        )}

        {activeTab === 'eval' && (
          <EvaluationNotes
            leftApp={apps.left}
            rightApp={apps.right}
          />
        )}
      </main>
    </div>
  );
}
