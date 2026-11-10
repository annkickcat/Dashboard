import React from 'react';
import { Star, Sparkles } from 'lucide-react';

interface OverallDonutChartProps {
  distribution: {
    star5: number;
    star4: number;
    star3: number;
    star2: number;
    star1: number;
  };
  totalRatings: number;
}

export const OverallDonutChart: React.FC<OverallDonutChartProps> = ({
  distribution,
  totalRatings,
}) => {
  const slices = [
    { label: '5 ดาว (มากที่สุด)', count: distribution.star5, color: '#fbbf24', bg: 'bg-amber-400' },
    { label: '4 ดาว (มาก)', count: distribution.star4, color: '#34d399', bg: 'bg-emerald-400' },
    { label: '3 ดาว (ปานกลาง)', count: distribution.star3, color: '#60a5fa', bg: 'bg-blue-400' },
    { label: '2 ดาว (น้อย)', count: distribution.star2, color: '#f59e0b', bg: 'bg-amber-500' },
    { label: '1 ดาว (น้อยที่สุด)', count: distribution.star1, color: '#f87171', bg: 'bg-rose-400' },
  ];

  const total = totalRatings || 1;
  const radius = 60;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  return (
    <div className="bg-slate-900/75 backdrop-blur-md rounded-2xl p-6 border border-amber-400/25 shadow-xl shadow-indigo-950/40">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-base sm:text-lg font-bold text-white">
            สัดส่วนดาวความพึงพอใจภาพรวม (Donut Chart)
          </h2>
        </div>
        <span className="text-xs text-amber-300 font-mono-numbers">
          รวม {totalRatings} คะแนน
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
        {/* SVG Multi-segment Donut Chart */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Base track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Segments */}
            {slices.map((slice, index) => {
              const slicePercent = slice.count / total;
              if (slicePercent <= 0) return null;

              const strokeDasharray = `${circumference * slicePercent} ${
                circumference * (1 - slicePercent)
              }`;
              const strokeDashoffset = -circumference * cumulativePercent;
              cumulativePercent += slicePercent;

              return (
                <circle
                  key={index}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="transparent"
                  className="transition-all duration-700 ease-out hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>

          {/* Central content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-amber-300 font-mono-numbers">
              {Math.round(((distribution.star5 + distribution.star4) / total) * 100)}%
            </span>
            <span className="text-[10px] text-slate-300 text-center leading-tight">
              ความพึงพอใจ<br />เชิงบวก (4-5★)
            </span>
          </div>
        </div>

        {/* Legend list */}
        <div className="w-full sm:w-auto flex-1 space-y-2 text-xs">
          {slices.map((slice, index) => {
            const pct = Math.round((slice.count / total) * 100);
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-950/40 hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${slice.bg} shadow-sm shrink-0`} />
                  <span className="text-slate-300 font-medium">{slice.label}</span>
                </div>
                <div className="flex items-center gap-2 font-mono-numbers">
                  <span className="font-bold text-white">{slice.count}</span>
                  <span className="text-slate-400">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
