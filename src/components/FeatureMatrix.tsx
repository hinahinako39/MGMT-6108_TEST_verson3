import React, { useState, useMemo } from 'react';
import { AppProfile, FeatureComparisonItem } from '../types/comparison';
import { COMPARISON_FEATURES } from '../data/comparisonData';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Search,
  Copy,
  Check,
  Download,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FeatureMatrixProps {
  leftApp: AppProfile;
  rightApp: AppProfile;
}

export const FeatureMatrix: React.FC<FeatureMatrixProps> = ({ leftApp, rightApp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const categories = useMemo(() => {
    const cats = ['All'];
    COMPARISON_FEATURES.forEach((item) => {
      if (!cats.includes(item.category)) cats.push(item.category);
    });
    return cats;
  }, []);

  const filteredFeatures = useMemo(() => {
    return COMPARISON_FEATURES.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.featureName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.leftAppFeature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rightAppFeature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.verdict.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyMarkdown = () => {
    const markdown = `# Side-by-Side App Comparison: ${leftApp.name} vs. ${rightApp.name}

## Left: [${leftApp.name}](${leftApp.url})
- **Framework & Stack**: ${leftApp.framework}
- **Hosting**: ${leftApp.hosting}
- **Fonts**: ${leftApp.fonts.join(', ')}
- **UI Paradigm**: ${leftApp.uiParadigm}

## Right: [${rightApp.name}](${rightApp.url})
- **Framework & Stack**: ${rightApp.framework}
- **Hosting**: ${rightApp.hosting}
- **Fonts**: ${rightApp.fonts.join(', ')}
- **UI Paradigm**: ${rightApp.uiParadigm}

## Feature Comparison Matrix
${COMPARISON_FEATURES.map(
  (f) => `### ${f.featureName} (${f.category})
- **${leftApp.shortName}**: [${f.leftAppFeature.status.toUpperCase()}] ${f.leftAppFeature.description}
- **${rightApp.shortName}**: [${f.rightAppFeature.status.toUpperCase()}] ${f.rightAppFeature.description}
- **Verdict**: ${f.verdict}
`
).join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStatusBadge = (status: FeatureComparisonItem['leftAppFeature']['status']) => {
    switch (status) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Included
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Alternative Form
          </span>
        );
      case 'not-present':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-neutral-500" />
            Not Present
          </span>
        );
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-neutral-950 text-neutral-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Architectural Audit
                </span>
                <span className="text-xs text-neutral-500">• Comparative Breakdown</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Editorial & Technical Comparison Matrix
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                Analysis of layout philosophy, interactive ergonomics, typography systems, and reader engagement across both implementations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl text-xs font-medium border border-neutral-700 transition shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Markdown' : 'Copy Audit (Markdown)'}</span>
              </button>
            </div>
          </div>

          {/* Quick Dual Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            {/* Left App Profile */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Left: {leftApp.shortName}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">{leftApp.hosting}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{leftApp.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{leftApp.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Stack: {leftApp.framework}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Fonts: {leftApp.fonts.join(', ')}
                  </span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-neutral-300">
                {leftApp.keyHighlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right App Profile */}
            <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    Right: {rightApp.shortName}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">{rightApp.hosting}</span>
                </div>
                <h3 className="text-base font-semibold text-white">{rightApp.name}</h3>
                <p className="text-xs text-neutral-400 mt-1">{rightApp.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Stack: {rightApp.framework}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    Style: {rightApp.fonts.join(', ')}
                  </span>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-neutral-300">
                {rightApp.keyHighlights.slice(0, 3).map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            />
          </div>
        </div>

        {/* Comparison List */}
        <div className="space-y-4">
          {filteredFeatures.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 md:p-5 hover:border-neutral-700 transition shadow-md"
            >
              {/* Category & Title */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-900/50">
                    {item.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{item.featureName}</h4>
                </div>
              </div>

              {/* Side-by-Side Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Left implementation */}
                <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-400">
                      {leftApp.shortName}
                    </span>
                    {renderStatusBadge(item.leftAppFeature.status)}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {item.leftAppFeature.description}
                  </p>
                </div>

                {/* Right implementation */}
                <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-sky-400">
                      {rightApp.shortName}
                    </span>
                    {renderStatusBadge(item.rightAppFeature.status)}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {item.rightAppFeature.description}
                  </p>
                </div>
              </div>

              {/* Comparative Verdict */}
              <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-lg p-2.5 flex items-start gap-2 text-xs">
                <span className="text-neutral-400 font-semibold shrink-0">Audit Verdict:</span>
                <span className="text-neutral-300">{item.verdict}</span>
              </div>
            </div>
          ))}

          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No matching features found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
