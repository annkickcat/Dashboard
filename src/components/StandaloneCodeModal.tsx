import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, BookOpen, Layers } from 'lucide-react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
  FIREBASE_DEPLOY_GUIDE_MD,
} from '../utils/standaloneCode';

export const StandaloneCodeModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('survey');
  const [copied, setCopied] = useState(false);

  const currentContent =
    activeTab === 'survey'
      ? STANDALONE_SURVEY_HTML
      : activeTab === 'dashboard'
      ? STANDALONE_DASHBOARD_HTML
      : FIREBASE_DEPLOY_GUIDE_MD;

  const currentFilename =
    activeTab === 'survey'
      ? 'index.html'
      : activeTab === 'dashboard'
      ? 'dashboard.html'
      : 'FIREBASE_DEPLOY_GUIDE.md';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = currentContent;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const mimeType = activeTab === 'guide' ? 'text/markdown;charset=utf-8;' : 'text/html;charset=utf-8;';
    const blob = new Blob([currentContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              โค้ดแยก 2 ไฟล์ &amp; คู่มือติดตั้ง Firebase Realtime Database
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              เขียนด้วย HTML + JavaScript + Firebase Realtime Database ทำงานแบบ Serverless ฟรี 100%
            </p>
          </div>
        </div>

        {/* Feature summary chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ไม่ต้องตั้งค่าเซิร์ฟเวอร์ (Serverless)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            ซิงก์ผลลัพธ์ขึ้นจอโปรเจกเตอร์ทันทีเมื่อมีคนส่ง
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            ป้องกันการตอบซ้ำด้วย Local Storage
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            รองรับ Export CSV ภาษาไทย UTF-8 BOM
          </span>
        </div>
      </div>

      {/* Tabs & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('survey')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'survey'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>1. หน้าตอบ (index.html)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>2. หน้าแดชบอร์ด (dashboard.html)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>3. คู่มือติดตั้ง &amp; Deploy ทีละขั้น</span>
          </button>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            onClick={handleCopy}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ด'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด {currentFilename}</span>
          </button>
        </div>
      </div>

      {/* Content Display Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between text-xs text-slate-300 border-b border-slate-800">
          <span className="font-mono font-semibold text-slate-100">{currentFilename}</span>
          <span className="text-[11px] text-slate-400">
            {activeTab === 'guide'
              ? 'คำแนะนำการตั้งค่าแบบละเอียด'
              : 'พร้อมนำไปใช้งานบน Firebase Realtime Database ทันที'}
          </span>
        </div>

        {activeTab === 'guide' ? (
          <div className="p-6 sm:p-8 prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed whitespace-pre-line font-sans">
            {FIREBASE_DEPLOY_GUIDE_MD}
          </div>
        ) : (
          <div className="relative">
            <pre className="p-6 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed max-h-[640px] select-all">
              <code>{currentContent}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
