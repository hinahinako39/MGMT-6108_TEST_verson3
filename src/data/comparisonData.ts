import { AppProfile, FeatureComparisonItem, DeviceConfig } from '../types/comparison';

export const INITIAL_APPS: { left: AppProfile; right: AppProfile } = {
  left: {
    id: 'left',
    name: 'The New York Times Digital Edition',
    shortName: 'NYT Digital',
    url: 'https://sample-interface-aka-mgmt-6108.vercel.app/',
    tagline: 'Classic broadsheet editorial newspaper with authentic serif typography and multi-column density',
    badge: 'Editorial Broadsheet',
    accentColor: '#121212',
    framework: 'React 19 + Vite + Tailwind CSS',
    hosting: 'Vercel Edge Network',
    fonts: ['Libre Baskerville', 'Newsreader', 'Inter'],
    keyHighlights: [
      'Authentic New York Times masthead with date stamp & weather/markets banner',
      'Multi-column editorial grid mimicking physical broadsheet journalism',
      'Editorial opinion columns, bylines, datelines, and article excerpts',
      'Subtle serif typography hierarchy designed for sustained long-form reading',
      'Extensive news sections: World, U.S., Politics, Business, Tech, Opinion, Culture'
    ],
    uiParadigm: 'In-page broadsheet browsing with density-oriented layouts'
  },
  right: {
    id: 'right',
    name: 'Newsroom — Stitch UI Prototype',
    shortName: 'Stitch Newsroom',
    url: 'https://haneshiro-stitch-news.niceglade16.chatgpt.site/',
    tagline: 'Modern interactive news prototype featuring slide-over reader modals and engagement drawers',
    badge: 'Interactive Prototype',
    accentColor: '#0284c7',
    framework: 'Tailwind CSS CDN + Interactive Dialog Script',
    hosting: 'Cloudflare Edge CDN',
    fonts: ['System Sans-serif', 'Clean Modern Display'],
    keyHighlights: [
      'Interactive reader dialog modal with estimated read time & audio story toggle',
      'Built-in "Saved for later" bookmark drawer for quick reading lists',
      'Dedicated comment thread & community discussion slide-out panel',
      'Photo inspection lightbox and interactive news tip submission modal',
      'Contemporary modern card UI with tag badges, rounded borders, and clean gutters'
    ],
    uiParadigm: 'Modal & drawer-driven reading with interactive community tools'
  }
};

export const DEVICE_PRESETS: DeviceConfig[] = [
  {
    id: 'responsive',
    name: 'Full Width',
    width: '100%',
    height: '100%',
    icon: 'Maximize',
    userAgentDesc: 'Standard viewport (100% of available split)'
  },
  {
    id: 'desktop',
    name: 'Desktop (1440px)',
    width: 1440,
    height: 900,
    icon: 'Monitor',
    userAgentDesc: 'Desktop standard (1440 × 900)'
  },
  {
    id: 'tablet',
    name: 'Tablet (768px)',
    width: 768,
    height: 1024,
    icon: 'Tablet',
    userAgentDesc: 'iPad / Tablet portrait (768 × 1024)'
  },
  {
    id: 'mobile',
    name: 'Mobile (390px)',
    width: 390,
    height: 844,
    icon: 'Smartphone',
    userAgentDesc: 'iPhone 14/15/16 Pro (390 × 844)'
  }
];

export const COMPARISON_FEATURES: FeatureComparisonItem[] = [
  {
    id: 'typography',
    category: 'Typography & Visuals',
    featureName: 'Typography Hierarchy & Tone',
    leftAppFeature: {
      status: 'supported',
      description: 'Classic serif typography (Libre Baskerville & Newsreader) reminiscent of traditional paper print. High editorial authority.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Modern sans-serif typography with clean UI accents, crisp uppercase category labels, and modern letter spacing.'
    },
    verdict: 'Left wins for authentic journalism feel; Right wins for modern digital product aesthetic.'
  },
  {
    id: 'grid-density',
    category: 'Navigation & Layout',
    featureName: 'Layout Density & Front-Page Structure',
    leftAppFeature: {
      status: 'supported',
      description: 'Dense 4-column newspaper layout with headline hierarchy, lead stories, side columns, and opinion sub-grids.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Modular card-based feed with generous whitespace, prominent category chips, and hero image focus.'
    },
    verdict: 'Left presents more information above the fold; Right offers a cleaner, less overwhelming scan.'
  },
  {
    id: 'reader-experience',
    category: 'Interactive Experience',
    featureName: 'Article Reading Experience',
    leftAppFeature: {
      status: 'partial',
      description: 'Direct in-flow page structure with multi-section scroll and traditional newspaper anchor navigation.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Rich slide-in reading modal with formatted body text, estimated reading time, author card, and full-screen reading mode.'
    },
    verdict: 'Right provides a focused reading experience with modal distraction-free reading.'
  },
  {
    id: 'saved-articles',
    category: 'Reader Tools',
    featureName: 'Saved for Later / Bookmarking',
    leftAppFeature: {
      status: 'not-present',
      description: 'Focused primarily on layout presentation without dedicated interactive bookmark state persistence.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Interactive "Saved for later" sidebar drawer allowing readers to queue articles and manage their reading list.'
    },
    verdict: 'Right provides built-in client bookmark management out-of-the-box.'
  },
  {
    id: 'discussion-comments',
    category: 'Reader Tools',
    featureName: 'Comment & Discussion Drawer',
    leftAppFeature: {
      status: 'not-present',
      description: 'No interactive commenting drawer in the primary prototype view.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Dedicated slide-over comments panel with simulated reader responses and comment submission form.'
    },
    verdict: 'Right includes community discussion UI elements.'
  },
  {
    id: 'multimedia',
    category: 'Interactive Experience',
    featureName: 'Multimedia, Audio & Lightbox',
    leftAppFeature: {
      status: 'partial',
      description: 'Editorial photo integration with authentic captions, photographer credits, and news section dividers.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Interactive image preview modal with high-res lightbox and audio story player toggle.'
    },
    verdict: 'Right provides richer modal media previews.'
  },
  {
    id: 'news-tip',
    category: 'Reader Tools',
    featureName: 'Reader Engagement & News Tip Form',
    leftAppFeature: {
      status: 'not-present',
      description: 'Standard editorial header with subscription and login hooks.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Interactive "Send a news tip" workflow dialog with topic category selection and tip details.'
    },
    verdict: 'Right includes an interactive investigative tip form.'
  },
  {
    id: 'tech-stack',
    category: 'Tech Architecture',
    featureName: 'Underlying Tech Stack & Tooling',
    leftAppFeature: {
      status: 'supported',
      description: 'React SPA bundled with Vite, Tailwind CSS v4, Google Fonts preconnect, and Vercel edge deployment.'
    },
    rightAppFeature: {
      status: 'supported',
      description: 'Stitch UI prototype with native ES script interactions, Tailwind CSS utility classes, and Cloudflare CDN.'
    },
    verdict: 'Both leverage modern edge hosting; Left is React-componentized, Right is lightweight prototype-driven.'
  }
];
