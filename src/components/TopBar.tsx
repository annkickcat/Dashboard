import React from 'react';
import { QrCode, FileSpreadsheet, Code2 } from 'lucide-react';

interface TopBarProps {
  activeView: 'survey' | 'dashboard' | 'guide';
  setActiveView: (view: 'survey' | 'dashboard' | 'guide') => void;
  onOpenQR: () => void;
  onExportCSV: () => void;
  totalResponses: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  setActiveView,
  onOpenQR,
  onExportCSV,
  totalResponses,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
            ✨
          </div>
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-lg font-bold tracking-tight text-slate-900 hover:text-amber-600 transition-colors whitespace-nowrap shrink-0 text-left flex items-center gap-1.5"
          >
            <span>LiveEval</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              🏰 Disney Magic
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveView('survey')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              activeView === 'survey'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            หน้าแบบสอบถาม (มือถือ)
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🏰 หน้า Dashboard วงกลม (ดิสนีย์)</span>
            {totalResponses > 0 && (
              <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                activeView === 'dashboard' ? 'bg-slate-950/20 text-slate-900' : 'bg-amber-100 text-amber-800'
              }`}>
                {totalResponses}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('guide')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1 ${
              activeView === 'guide'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>โค้ดแยก 2 ไฟล์ & วิธี Deploy</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenQR}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="แสดง QR Code สำหรับผู้เข้าอบรมสแกน"
          >
            <QrCode className="w-4 h-4 text-slate-700" />
            <span>สแกน QR Code</span>
          </button>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            title="ดาวน์โหลดผลประเมินเป็นไฟล์ Excel / CSV รองรับภาษาไทย"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>ดาวน์โหลด CSV</span>
          </button>
        </div>
      </div>
    </header>
  );
};
