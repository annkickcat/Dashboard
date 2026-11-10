/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { SurveyView } from './components/SurveyView';
import { DashboardView } from './components/DashboardView';
import { StandaloneCodeModal } from './components/StandaloneCodeModal';
import { QRCodeModal } from './components/QRCodeModal';
import { SurveyStats, getInterpretation } from './types';

const defaultStats: SurveyStats = {
  totalCount: 0,
  questionAverages: [0, 0, 0, 0, 0],
  overallAverage: 0,
  interpretation: {
    level: 'ยังไม่มีข้อมูล',
    enLevel: 'No Data Yet',
    color: '#64748b',
    bgLight: '#f8fafc',
  },
  distribution: [
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  ],
  recentFeedback: [],
  responses: [],
};

export default function App() {
  const [activeView, setActiveView] = useState<'survey' | 'dashboard' | 'guide'>('dashboard');
  const [stats, setStats] = useState<SurveyStats>(defaultStats);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [surveyUrl, setSurveyUrl] = useState('');

  // Determine initial view from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'survey') {
      setActiveView('survey');
    } else if (viewParam === 'dashboard') {
      setActiveView('dashboard');
    } else if (viewParam === 'guide') {
      setActiveView('guide');
    } else {
      // Default to survey on small mobile screen, dashboard on desktop
      if (window.innerWidth < 640) {
        setActiveView('survey');
      } else {
        setActiveView('dashboard');
      }
    }

    // Prepare shareable survey URL pointing explicitly to survey view
    const origin = window.location.origin;
    const path = window.location.pathname;
    setSurveyUrl(`${origin}${path}?view=survey`);
  }, []);

  // Fetch initial survey stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/responses');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Connect to Server-Sent Events (SSE) for instant real-time live push
    const eventSource = new EventSource('/api/events');
    eventSource.onmessage = (event) => {
      try {
        const incomingData = JSON.parse(event.data);
        setStats(incomingData);
      } catch (e) {
        console.error('Failed to parse SSE payload', e);
      }
    };

    eventSource.onerror = () => {
      // If SSE disconnects, fallback to gentle polling every 4 seconds
      console.warn('SSE disconnected, falling back to polling');
    };

    const interval = setInterval(fetchStats, 5000);

    return () => {
      eventSource.close();
      clearInterval(interval);
    };
  }, [fetchStats]);

  // Handle Export CSV with Thai UTF-8 BOM
  const handleExportCSV = () => {
    if (stats.responses.length === 0) {
      alert('ยังไม่มีข้อมูลการประเมินสำหรับส่งออกเป็น CSV ครับ');
      return;
    }

    // Prefix with \uFEFF (UTF-8 BOM) for Microsoft Excel Thai compatibility
    let csvContent = '\uFEFF';
    csvContent +=
      'ลำดับ,วันเวลาที่ประเมิน,ข้อ 1 เนื้อหา,ข้อ 2 วิทยากร,ข้อ 3 การนำไปใช้,ข้อ 4 เวลาและสื่อ,ข้อ 5 ภาพรวม,คะแนนเฉลี่ย,ระดับผลการประเมิน,ข้อเสนอแนะ\r\n';

    stats.responses.forEach((res, idx) => {
      const r = res.ratings || [0, 0, 0, 0, 0];
      const avg = Number((r.reduce((a, b) => a + b, 0) / 5).toFixed(2));
      const interp = getInterpretation(avg);
      const fb = (res.feedback || '').replace(/"/g, '""');
      const dateStr = new Date(res.createdAt).toLocaleString('th-TH');

      csvContent += `${idx + 1},"${dateStr}",${r[0]},${r[1]},${r[2]},${r[3]},${r[4]},${avg},"${interp.level}","${fb}"\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `training-eval-report-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Add sample responses for quick demo/testing
  const handleAddSample = async () => {
    try {
      await fetch('/api/responses/sample', { method: 'POST' });
      await fetchStats();
    } catch (err) {
      console.error('Failed to add sample:', err);
    }
  };

  // Reset all survey responses
  const handleResetData = async () => {
    try {
      await fetch('/api/responses/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restoreSamples: false }),
      });
      await fetchStats();
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Universal TopBar */}
      <TopBar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          // Sync URL search param cleanly
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set('view', v);
          window.history.replaceState({}, '', newUrl.toString());
        }}
        onOpenQR={() => setIsQRModalOpen(true)}
        onExportCSV={handleExportCSV}
        totalResponses={stats.totalCount}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'survey' && (
          <SurveyView
            onSuccessSubmit={fetchStats}
            onGoToDashboard={() => {
              setActiveView('dashboard');
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set('view', 'dashboard');
              window.history.replaceState({}, '', newUrl.toString());
            }}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardView
            stats={stats}
            surveyUrl={surveyUrl}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            onExportCSV={handleExportCSV}
            onAddSample={handleAddSample}
            onResetData={handleResetData}
          />
        )}

        {activeView === 'guide' && <StandaloneCodeModal />}
      </div>

      {/* QR Code Modal for Projector Screen or Attendees */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />
    </div>
  );
}
