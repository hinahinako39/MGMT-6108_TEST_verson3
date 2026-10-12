export type LayoutMode = 'split-horizontal' | 'split-vertical' | 'diff-slider' | 'focus-left' | 'focus-right';

export type DevicePreset = 'responsive' | 'mobile' | 'tablet' | 'desktop';

export interface DeviceConfig {
  id: DevicePreset;
  name: string;
  width: number | string;
  height: number | string;
  icon: string;
  userAgentDesc: string;
}

export interface AppProfile {
  id: 'left' | 'right';
  name: string;
  shortName: string;
  url: string;
  tagline: string;
  badge: string;
  accentColor: string;
  framework: string;
  hosting: string;
  fonts: string[];
  keyHighlights: string[];
  uiParadigm: string;
}

export interface FeatureComparisonItem {
  id: string;
  category: 'Typography & Visuals' | 'Navigation & Layout' | 'Interactive Experience' | 'Reader Tools' | 'Tech Architecture';
  featureName: string;
  leftAppFeature: {
    status: 'supported' | 'partial' | 'not-present';
    description: string;
  };
  rightAppFeature: {
    status: 'supported' | 'partial' | 'not-present';
    description: string;
  };
  verdict: string;
}
