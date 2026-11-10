import React from 'react';
import { Sparkles, Star } from 'lucide-react';

interface CircularGaugeProps {
  score: number;
  maxScore?: number;
  title: string;
  questionNumber: number;
  distribution: Record<number, number>;
  totalRespondents: number;
  colorTheme?: 'gold' | 'emerald' | 'blue' | 'purple' | 'amber';
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  score,
  maxScore = 5,
  title,
  questionNumber,
  distribution,
  totalRespondents,
  colorTheme = 'gold',
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Disney magical theme gradient palettes
  const gradients = {
    gold: {
      from: '#fbbf24',
      to: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.4)',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      textColor: 'text-amber-400',
    },
    emerald: {
      from: '#34d399',
      to: '#059669',
      glow: 'rgba(16, 185, 129, 0.4)',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      textColor: 'text-emerald-400',
    },
    blue: {
      from: '#60a5fa',
      to: '#2563eb',
      glow: 'rgba(37, 99, 235, 0.4)',
      badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      textColor: 'text-blue-400',
    },
    purple: {
      from: '#c084fc',
      to: '#9333ea',
      glow: 'rgba(147, 51, 234, 0.4)',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      textColor: 'text-purple-400',
    },
    amber: {
      from: '#fde047',
      to: '#d97706',
      glow: 'rgba(217, 119, 6, 0.4)',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      textColor: 'text-amber-400',
    },
  };

  const selectedTheme = gradients[colorTheme];

  // Likert scale interpretation
  const getLevel = (val: number) => {
    if (val >= 4.51) return 'มากที่สุด ✨';
    if (val >= 3.51) return 'มาก ⭐';
    if (val >= 2.51) return 'ปานกลาง';
    if (val >= 1.51) return 'น้อย';
    return 'น้อยที่สุด';
  };

  const gradientId = `magic-grad-${questionNumber}`;
  const glowFilterId = `glow-${questionNumber}`;

  return (
    <div className="bg-slate-900/75 backdrop-blur-md rounded-2xl p-5 border border-amber-400/25 shadow-xl shadow-indigo-950/40 hover:border-amber-400/50 hover:shadow-amber-500/10 transition-all duration-300 flex flex-col items-center text-center relative group overflow-hidden">
      {/* Subtle magical star decor in background */}
      <div className="absolute top-2 right-2 opacity-30 group-hover:opacity-60 transition-opacity">
        <Sparkles className="w-4 h-4 text-amber-300" />
      </div>

      {/* Question Number Badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
          {questionNumber}
        </span>
        <span className="text-xs font-semibold text-amber-200/90 tracking-wide">
          คำถามข้อที่ {questionNumber}
        </span>
      </div>

      {/* Circular SVG Donut Gauge */}
      <div className="relative w-36 h-36 my-1 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={selectedTheme.from} />
              <stop offset="100%" stopColor={selectedTheme.to} />
            </linearGradient>
            <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={selectedTheme.to} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background circle track */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800/80"
            fill="transparent"
          />

          {/* Animated Progress circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            filter={`url(#${glowFilterId})`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score details */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-3xl font-extrabold font-mono-numbers tracking-tight"
            style={{ color: selectedTheme.from }}
          >
            {score.toFixed(2)}
          </span>
          <span className="text-[11px] font-semibold text-slate-400">
            เต็ม {maxScore.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono font-medium text-amber-300 mt-0.5">
            ({Math.round(percentage)}%)
          </span>
        </div>
      </div>

      {/* Level interpretation pill */}
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${selectedTheme.badgeBg}`}>
        {getLevel(score)}
      </div>

      {/* Question Title */}
      <h3 className="mt-3 text-xs sm:text-sm font-semibold text-slate-100 leading-snug line-clamp-2 min-h-[2.5rem]">
        {title}
      </h3>

      {/* Star distribution mini-strip */}
      <div className="w-full mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono-numbers">
        <span className="text-slate-400">สัดส่วน 5 ดาว:</span>
        <div className="flex items-center gap-1 font-semibold text-amber-300">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{distribution[5] || 0} คน</span>
          <span className="text-slate-500 font-normal">
            ({totalRespondents > 0 ? Math.round(((distribution[5] || 0) / totalRespondents) * 100) : 0}%)
          </span>
        </div>
      </div>
    </div>
  );
};
