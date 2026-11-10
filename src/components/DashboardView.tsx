import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Users,
  Maximize2,
  Minimize2,
  FileSpreadsheet,
  PlusCircle,
  RotateCcw,
  MessageSquare,
  QrCode,
  Sparkles,
  Crown,
  Wand2,
  Star,
  PieChart,
  LayoutGrid,
} from 'lucide-react';
import { SurveyStats, QUESTIONS, getInterpretation } from '../types';
import { CircularGauge } from './CircularGauge';
import { OverallDonutChart } from './OverallDonutChart';

interface DashboardViewProps {
  stats: SurveyStats;
  surveyUrl: string;
  onOpenQRModal: () => void;
  onExportCSV: () => void;
  onAddSample: () => Promise<void>;
  onResetData: () => Promise<void>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  surveyUrl,
  onOpenQRModal,
  onExportCSV,
  onAddSample,
  onResetData,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAddingSample, setIsAddingSample] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [chartViewMode, setChartViewMode] = useState<'all' | 'radial' | 'donut'>('all');

  // Render embedded Projector QR Code
  useEffect(() => {
    if (qrCanvasRef.current && surveyUrl) {
      QRCode.toCanvas(
        qrCanvasRef.current,
        surveyUrl,
        {
          width: 96,
          margin: 1,
          color: {
            dark: '#1e1b4b',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Projector QR Code error:', error);
        }
      );
    }
  }, [surveyUrl]);

  // Handle Fullscreen for Projector
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleSampleClick = async () => {
    setIsAddingSample(true);
    await onAddSample();
    setIsAddingSample(false);
  };

  const handleResetClick = async () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลผลประเมินทั้งหมดเพื่อเริ่มใหม่ใช่หรือไม่?')) {
      setIsResetting(true);
      await onResetData();
      setIsResetting(false);
    }
  };

  const overallInterp = getInterpretation(stats.overallAverage);

  // Compute total distribution across all ratings
  const totalStarDist = { star5: 0, star4: 0, star3: 0, star2: 0, star1: 0 };
  let allRatingsCount = 0;
  stats.responses.forEach((res) => {
    res.ratings.forEach((val) => {
      allRatingsCount++;
      if (val === 5) totalStarDist.star5++;
      else if (val === 4) totalStarDist.star4++;
      else if (val === 3) totalStarDist.star3++;
      else if (val === 2) totalStarDist.star2++;
      else if (val === 1) totalStarDist.star1++;
    });
  });

  const positiveRatingsCount = totalStarDist.star5 + totalStarDist.star4;
  const positivePercentage =
    allRatingsCount > 0 ? Math.round((positiveRatingsCount / allRatingsCount) * 100) : 0;

  const colorThemes: ('gold' | 'emerald' | 'blue' | 'purple' | 'amber')[] = [
    'gold',
    'emerald',
    'blue',
    'purple',
    'amber',
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#070a1e] via-[#0d1238] to-[#090d28] text-slate-100 px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
      {/* Decorative magical starry background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-10 left-[15%] w-1.5 h-1.5 bg-amber-200 rounded-full animate-twinkle" />
        <div className="absolute top-24 left-[35%] w-1 h-1 bg-yellow-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-16 right-[20%] w-2 h-2 bg-amber-300 rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-48 right-[10%] w-1.5 h-1.5 bg-purple-300 rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-32 left-[8%] w-1.5 h-1.5 bg-yellow-200 rounded-full animate-twinkle" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-20 right-[25%] w-2 h-2 bg-amber-200 rounded-full animate-twinkle" style={{ animationDelay: '2.3s' }} />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Disney Fairytale Magic Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-400/20">
          <div>
            <div className="flex items-center gap-3">
              {/* Disney Magic Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <Crown className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                    Disney Magical Evaluation Dashboard
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold border border-amber-400/30">
                    <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Live Real-time</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                  <span>✨ ผลการประเมินความพึงพอใจการอบรมแดนมหัศจรรย์ (กราฟวงกลม &amp; อัปเดตทันที)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSampleClick}
              disabled={isAddingSample}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-200 border border-amber-400/30 flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              title="สุ่มผลการตอบตัวอย่างเพื่อทดสอบการแสดงผลและอนิเมชันกราฟวงกลม"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAddingSample ? 'กำลังร่ายเวทมนตร์...' : 'สุ่มตัวอย่าง (+3)'}</span>
            </button>

            <button
              onClick={handleResetClick}
              disabled={isResetting}
              className="px-3 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="ล้างข้อมูลผลประเมินเพื่อเริ่มใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>ล้างข้อมูล</span>
            </button>

            <button
              onClick={onExportCSV}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-all active:scale-95"
              title="ดาวน์โหลดไฟล์ CSV ภาษาไทย UTF-8 BOM"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>ดาวน์โหลด CSV</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-amber-400/30 flex items-center gap-1.5 transition-colors"
              title="เปิดมุมมองฉายโปรเจกเตอร์เต็มจอ"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-300" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-300" />}
              <span className="hidden sm:inline">{isFullscreen ? 'ย่อหน้าจอ' : 'ฉายเต็มจอ'}</span>
            </button>
          </div>
        </div>

        {/* Hero KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Respondents */}
          <div className="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-5 shadow-xl shadow-indigo-950/40 relative overflow-hidden group">
            <div className="flex items-center justify-between text-amber-200/90 text-xs font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-400" />
                <span>จำนวนผู้ร่วมประเมิน</span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400/60" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono-numbers">
                {stats.totalCount}
              </span>
              <span className="text-xs text-amber-200/80">คน</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {stats.totalCount === 0 ? 'รอผู้เข้าร่วมสแกนตอบ' : 'ซิงก์ผลลัพธ์สดทันที'}
            </p>
          </div>

          {/* Card 2: Overall Grand Score with Disney Badge */}
          <div className="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-5 shadow-xl shadow-indigo-950/40 sm:col-span-2 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-200/90 text-xs font-semibold flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>คะแนนความพึงพอใจเฉลี่ยรวมทั้งหลักสูตร</span>
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-300 border border-amber-400/40 shadow-sm flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>ระดับ: {overallInterp.level}</span>
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono-numbers tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                {stats.overallAverage.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 5.00</span>
              <span className="text-xs text-amber-300/80 hidden sm:inline font-medium">
                ({overallInterp.enLevel})
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold ml-auto">
                เชิงบวก {positivePercentage}%
              </span>
            </div>

            {/* Glowing Golden Gauge Bar */}
            <div className="w-full bg-slate-800/80 h-3 rounded-full mt-3 overflow-hidden border border-amber-400/20">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 transition-all duration-700 ease-out shadow-sm shadow-amber-400/50"
                style={{ width: `${(stats.overallAverage / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-amber-200/60 mt-1 font-mono-numbers">
              <span>1.00 (ควรปรับปรุง)</span>
              <span>3.00 (ปานกลาง)</span>
              <span className="text-amber-300 font-semibold">5.00 (ยอดเยี่ยมที่สุด ✨)</span>
            </div>
          </div>

          {/* Card 3: Projector Attendee Scan QR Card with Disney Golden Frame */}
          <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 border border-amber-400/40 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
            <div
              onClick={onOpenQRModal}
              className="bg-white p-1.5 rounded-xl shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all shadow-md"
              title="คลิกเพื่อขยาย QR Code"
            >
              <canvas ref={qrCanvasRef} className="rounded block" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5" />
                <span>สแกนร่วมประเมิน</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                ใช้มือถือเปิดกล้องส่อง QR Code บนจอได้ทันที
              </p>
              <button
                onClick={onOpenQRModal}
                className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold underline pt-0.5 block"
              >
                ขยาย QR Code เต็มจอ 🔍
              </button>
            </div>
          </div>
        </div>

        {/* Chart View Mode Selector & Criteria Bar */}
        <div className="p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-amber-400/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-200 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>โหมดกราฟวงกลม:</span>
            </span>
            <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setChartViewMode('all')}
                className={`px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1 ${
                  chartViewMode === 'all'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>ทั้งหมด</span>
              </button>
              <button
                onClick={() => setChartViewMode('radial')}
                className={`px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1 ${
                  chartViewMode === 'radial'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>วงกลมรายข้อ (5 ข้อ)</span>
              </button>
              <button
                onClick={() => setChartViewMode('donut')}
                className={`px-3 py-1 rounded-md font-medium text-xs transition-colors flex items-center gap-1 ${
                  chartViewMode === 'donut'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>โดนัทภาพรวม</span>
              </button>
            </div>
          </div>

          {/* Likert Scale Legend */}
          <div className="flex flex-wrap items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              4.51-5.00 มากที่สุด ✨
            </span>
            <span className="flex items-center gap-1 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              3.51-4.50 มาก
            </span>
            <span className="flex items-center gap-1 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              2.51-3.50 ปานกลาง
            </span>
            <span className="flex items-center gap-1 text-orange-300">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              1.51-2.50 น้อย
            </span>
            <span className="flex items-center gap-1 text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              1.00-1.50 น้อยที่สุด
            </span>
          </div>
        </div>

        {/* SECTION 1: CIRCULAR GAUGES FOR 5 QUESTIONS (กราฟวงกลมรายข้อ) */}
        {(chartViewMode === 'all' || chartViewMode === 'radial') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">
                  ผลคะแนนเฉลี่ยรายข้อรูปแบบกราฟวงกลม (Circular Radial Donut Gauges)
                </h2>
              </div>
              <span className="text-xs text-amber-300 font-mono-numbers">
                สเกล 1.00 ถึง 5.00
              </span>
            </div>

            {/* 5 Circular Donut Gauges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {QUESTIONS.map((questionTitle, idx) => {
                const avg = stats.questionAverages[idx] || 0;
                const dist = stats.distribution[idx] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                return (
                  <CircularGauge
                    key={idx}
                    questionNumber={idx + 1}
                    title={questionTitle}
                    score={avg}
                    distribution={dist}
                    totalRespondents={stats.totalCount}
                    colorTheme={colorThemes[idx % colorThemes.length]}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: OVERALL DONUT DISTRIBUTION + RECENT FEEDBACK */}
        {(chartViewMode === 'all' || chartViewMode === 'donut') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Donut Breakdown (2 cols) */}
            <div className="lg:col-span-2">
              <OverallDonutChart
                distribution={totalStarDist}
                totalRatings={allRatingsCount}
              />
            </div>

            {/* Disney Fairytale Recent Feedback Stream (1 col) */}
            <div className="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-6 shadow-xl shadow-indigo-950/40 flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    เสียงสะท้อนจากผู้เข้าร่วมอบรม
                  </h2>
                </div>
                <span className="text-xs text-amber-300 font-mono-numbers">
                  {stats.recentFeedback.length} ข้อความ
                </span>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-1">
                {stats.recentFeedback.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-amber-400/40" />
                    <p className="text-xs">ยังไม่มีข้อเสนอแนะส่งเข้ามา</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      เมื่อผู้เข้าอบรมพิมพ์ข้อความ จะปรากฏขึ้นทันทีตรงนี้
                    </p>
                  </div>
                ) : (
                  stats.recentFeedback.map((item) => {
                    const itemAvg = item.ratings.reduce((a, b) => a + b, 0) / 5;
                    const itemInterp = getInterpretation(itemAvg);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-slate-950/60 rounded-xl border border-amber-400/20 space-y-2 hover:border-amber-400/40 transition-colors relative"
                      >
                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          &ldquo;{item.feedback}&rdquo;
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono-numbers">
                          <span className="flex items-center gap-1 font-semibold text-amber-300">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>
                              {itemAvg.toFixed(1)}/5 ({itemInterp.level})
                            </span>
                          </span>
                          <span>
                            {new Date(item.createdAt).toLocaleTimeString('th-TH', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            น.
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
