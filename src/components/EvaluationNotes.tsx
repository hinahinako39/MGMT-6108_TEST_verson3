import React, { useState, useEffect } from 'react';
import { AppProfile } from '../types/comparison';
import { Star, Plus, Trash2, Save, Download, Copy, Check, Sparkles } from 'lucide-react';

interface EvaluationNotesProps {
  leftApp: AppProfile;
  rightApp: AppProfile;
}

interface ScoreState {
  typography: number;
  layout: number;
  interactivity: number;
  performance: number;
}

export const EvaluationNotes: React.FC<EvaluationNotesProps> = ({ leftApp, rightApp }) => {
  const [leftScores, setLeftScores] = useState<ScoreState>(() => {
    const saved = localStorage.getItem('comparator_left_scores');
    return saved ? JSON.parse(saved) : { typography: 5, layout: 5, interactivity: 3, performance: 4 };
  });

  const [rightScores, setRightScores] = useState<ScoreState>(() => {
    const saved = localStorage.getItem('comparator_right_scores');
    return saved ? JSON.parse(saved) : { typography: 4, layout: 4, interactivity: 5, performance: 4 };
  });

  const [notes, setNotes] = useState<string>(() => {
    const saved = localStorage.getItem('comparator_notes');
    return (
      saved ||
      `### Executive Summary\n- **${leftApp.shortName}**: Stands out with authentic New York Times typography, high information density, and traditional newspaper layout.\n- **${rightApp.shortName}**: Excels in modern web application patterns: dedicated slide-over reader modal, saved-for-later reading list, and community comment drawer.\n\n### Recommendation\nCombine the rich serif typography and dense editorial grid of the Left app with the interactive reading modals and bookmarking drawers of the Right app for the optimal digital news experience.`
    );
  });

  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('comparator_left_scores', JSON.stringify(leftScores));
  }, [leftScores]);

  useEffect(() => {
    localStorage.setItem('comparator_right_scores', JSON.stringify(rightScores));
  }, [rightScores]);

  useEffect(() => {
    localStorage.setItem('comparator_notes', notes);
  }, [notes]);

  const calcAverage = (scores: ScoreState) => {
    return ((scores.typography + scores.layout + scores.interactivity + scores.performance) / 4).toFixed(1);
  };

  const handleCopyReport = () => {
    const report = `# App Comparison Scorecard & Evaluation

## Scores
### ${leftApp.name} (Avg: ${calcAverage(leftScores)} / 5)
- Typography: ${leftScores.typography}/5
- Layout & Grid: ${leftScores.layout}/5
- Interactivity: ${leftScores.interactivity}/5
- Performance: ${leftScores.performance}/5

### ${rightApp.name} (Avg: ${calcAverage(rightScores)} / 5)
- Typography: ${rightScores.typography}/5
- Layout & Grid: ${rightScores.layout}/5
- Interactivity: ${rightScores.interactivity}/5
- Performance: ${rightScores.performance}/5

## Evaluation Notes
${notes}
`;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStarRating = (
    value: number,
    onChange: (val: number) => void,
    accentClass: string
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-0.5 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-4 h-4 ${
                star <= value ? `${accentClass} fill-current` : 'text-neutral-700'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto p-4 md:p-6 bg-neutral-950 text-neutral-200">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Scorecard & Review
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Interactive Evaluation & Review Notes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Rate each application on key dimensions, jot down testing impressions, and export a structured review.
            </p>
          </div>

          <button
            onClick={handleCopyReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-xl text-xs font-medium border border-neutral-700 transition shadow-sm self-start sm:self-center"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Report' : 'Copy Full Scorecard'}</span>
          </button>
        </div>

        {/* Side-by-Side Scoring Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left App Scorecard */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Left App
                </span>
                <h3 className="text-base font-semibold text-white">{leftApp.shortName}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-amber-400">{calcAverage(leftScores)}</span>
                <span className="text-xs text-neutral-500 font-medium"> / 5.0</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Typography & Hierarchy</div>
                  <div className="text-[11px] text-neutral-500">Serif fidelity, bylines, font pairing</div>
                </div>
                {renderStarRating(
                  leftScores.typography,
                  (v) => setLeftScores({ ...leftScores, typography: v }),
                  'text-amber-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Layout & Broadsheet Grid</div>
                  <div className="text-[11px] text-neutral-500">Multi-column density & lead stories</div>
                </div>
                {renderStarRating(
                  leftScores.layout,
                  (v) => setLeftScores({ ...leftScores, layout: v }),
                  'text-amber-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Interactive Ergonomics</div>
                  <div className="text-[11px] text-neutral-500">Modals, drawers, reader tools</div>
                </div>
                {renderStarRating(
                  leftScores.interactivity,
                  (v) => setLeftScores({ ...leftScores, interactivity: v }),
                  'text-amber-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Performance & Responsiveness</div>
                  <div className="text-[11px] text-neutral-500">Load speed & mobile layout fluidity</div>
                </div>
                {renderStarRating(
                  leftScores.performance,
                  (v) => setLeftScores({ ...leftScores, performance: v }),
                  'text-amber-400'
                )}
              </div>
            </div>
          </div>

          {/* Right App Scorecard */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                  Right App
                </span>
                <h3 className="text-base font-semibold text-white">{rightApp.shortName}</h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-sky-400">{calcAverage(rightScores)}</span>
                <span className="text-xs text-neutral-500 font-medium"> / 5.0</span>
              </div>
            </div>

            <div className="space-y-3.5 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Typography & Hierarchy</div>
                  <div className="text-[11px] text-neutral-500">Modern sans style & category tags</div>
                </div>
                {renderStarRating(
                  rightScores.typography,
                  (v) => setRightScores({ ...rightScores, typography: v }),
                  'text-sky-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Layout & Broadsheet Grid</div>
                  <div className="text-[11px] text-neutral-500">Clean card spacing & whitespace</div>
                </div>
                {renderStarRating(
                  rightScores.layout,
                  (v) => setRightScores({ ...rightScores, layout: v }),
                  'text-sky-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Interactive Ergonomics</div>
                  <div className="text-[11px] text-neutral-500">Slide-in reader, saved list, comment drawer</div>
                </div>
                {renderStarRating(
                  rightScores.interactivity,
                  (v) => setRightScores({ ...rightScores, interactivity: v }),
                  'text-sky-400'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-neutral-200">Performance & Responsiveness</div>
                  <div className="text-[11px] text-neutral-500">Smooth drawer transitions & lightweight scripts</div>
                </div>
                {renderStarRating(
                  rightScores.performance,
                  (v) => setRightScores({ ...rightScores, performance: v }),
                  'text-sky-400'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scratchpad & Evaluation Notes */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Reviewer Scratchpad & Synthesis</h3>
              <p className="text-xs text-neutral-400">
                Notes are automatically saved locally in your browser session.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
              <Save className="w-3.5 h-3.5" />
              <span>Auto-saved</span>
            </div>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-200 font-mono leading-relaxed focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 resize-y"
            placeholder="Write your comparative notes here..."
          />
        </div>
      </div>
    </div>
  );
};
