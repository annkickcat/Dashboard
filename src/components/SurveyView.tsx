import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Send, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';
import { QUESTIONS, RATING_LEVELS } from '../types';

interface SurveyViewProps {
  onSuccessSubmit: () => void;
  onGoToDashboard: () => void;
}

const STORAGE_SUBMISSION_KEY = 'liveeval_survey_submitted_token';

export const SurveyView: React.FC<SurveyViewProps> = ({ onSuccessSubmit, onGoToDashboard }) => {
  const [ratings, setRatings] = useState<[number, number, number, number, number]>([0, 0, 0, 0, 0]);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const hasSubmitted = localStorage.getItem(STORAGE_SUBMISSION_KEY);
    if (hasSubmitted) {
      setIsSubmitted(true);
    }
  }, []);

  const handleSelectRating = (questionIndex: number, value: number) => {
    const newRatings = [...ratings] as [number, number, number, number, number];
    newRatings[questionIndex] = value;
    setRatings(newRatings);
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions
    const unratedIndex = ratings.findIndex((r) => r === 0);
    if (unratedIndex !== -1) {
      setErrorMsg(`กรุณาให้คะแนนข้อที่ ${unratedIndex + 1} ให้ครบถ้วนก่อนส่งแบบประเมินครับ`);
      // Scroll to that question smoothly
      const el = document.getElementById(`q-box-${unratedIndex}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const clientId = 'device-' + Math.random().toString(36).substring(2, 9);
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ratings,
          feedback: feedback.trim(),
          clientId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'ไม่สามารถส่งแบบประเมินได้ โปรดลองอีกครั้ง');
      }

      // Record in local storage to prevent duplicate voting
      localStorage.setItem(STORAGE_SUBMISSION_KEY, JSON.stringify({
        date: new Date().toISOString(),
        ratings,
      }));

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Fallback gracefully
      }

      setIsSubmitted(true);
      onSuccessSubmit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(STORAGE_SUBMISSION_KEY);
    setRatings([0, 0, 0, 0, 0]);
    setFeedback('');
    setIsSubmitted(false);
    setErrorMsg(null);
  };

  if (isSubmitted) {
    return (
      <main className="max-w-md mx-auto px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 ring-8 ring-emerald-50/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">ส่งแบบประเมินเรียบร้อยแล้ว</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            ขอบคุณที่ร่วมสละเวลาสะท้อนความคิดเห็น ผลคะแนนของท่านได้ถูกส่งขึ้นสู่หน้าจอแดชบอร์ดของผู้จัดเรียลไทม์แล้วครับ
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 mb-6 space-y-2 text-left">
            <div className="flex items-center justify-between text-slate-500 font-medium pb-2 border-b border-slate-200">
              <span>สถานะการบันทึก:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                บันทึกสำเร็จ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>การป้องกันตอบซ้ำ:</span>
              <span>บันทึกรหัสเครื่องเรียบร้อย</span>
            </div>
            <div className="flex items-center justify-between">
              <span>เวลาที่ส่ง:</span>
              <span className="font-mono">{new Date().toLocaleTimeString('th-TH')} น.</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onGoToDashboard}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>ดูผลลัพธ์บน Live Dashboard</span>
            </button>

            <button
              onClick={handleResetForTesting}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ล้างสถานะเพื่อทดสอบตอบใหม่อีกครั้ง</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  const answeredCount = ratings.filter((r) => r > 0).length;

  return (
    <main className="max-w-xl mx-auto px-4 py-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>แบบประเมินผู้เข้าอบรม</span>
          </div>
          <span className="text-xs font-mono text-slate-500 font-medium">
            ตอบแล้ว {answeredCount}/5 ข้อ
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
          แบบประเมินความพึงพอใจการอบรม
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          ความคิดเห็นของท่านมีคุณค่ายิ่งในการพัฒนาหลักสูตรและวิทยากรในครั้งต่อไป (ไม่ระบุตัวตน 100%)
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">โปรดตรวจสอบแบบสอบถาม</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Survey Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {QUESTIONS.map((questionText, qIdx) => {
          const selectedVal = ratings[qIdx];
          const selectedDesc = RATING_LEVELS.find((l) => l.value === selectedVal);

          return (
            <div
              key={qIdx}
              id={`q-box-${qIdx}`}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                selectedVal > 0
                  ? 'border-blue-200 shadow-sm'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  {qIdx + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                    {questionText}
                  </h3>
                  {selectedDesc && (
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      ระดับที่เลือก: {selectedDesc.value} - {selectedDesc.label} ({selectedDesc.desc})
                    </p>
                  )}
                </div>
              </div>

              {/* 5-scale touch buttons */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pt-1">
                {RATING_LEVELS.map((level) => {
                  const isSelected = selectedVal === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => handleSelectRating(qIdx, level.value)}
                      className={`min-h-[58px] sm:min-h-[64px] flex flex-col items-center justify-center rounded-xl p-1.5 sm:p-2 border-2 transition-all active:scale-95 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-600/20'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg leading-none mb-1">{level.emoji}</span>
                      <span
                        className={`text-sm sm:text-base font-bold font-mono ${
                          isSelected ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {level.value}
                      </span>
                      <span
                        className={`text-[10px] leading-tight text-center font-medium ${
                          isSelected ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {level.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Suggestion Textarea */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <label htmlFor="feedback-input" className="block text-sm font-semibold text-slate-900 mb-1">
            ข้อเสนอแนะหรือความคิดเห็นเพิ่มเติม{' '}
            <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            สิ่งที่ท่านประทับใจเป็นพิเศษ หรือหัวข้อที่ต้องการเรียนรู้เพิ่มเติมในการจัดอบรมครั้งถัดไป
          </p>
          <textarea
            id="feedback-input"
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="ตัวอย่าง: วิทยากรอธิบายดีมาก ตัวอย่างชัดเจน อยากให้มีเวลาทำเวิร์กชอปเพิ่มขึ้น..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400 resize-none"
          />
        </div>

        {/* Sticky Submit Button within thumb reach zone */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full min-h-[52px] rounded-2xl text-white font-semibold text-base shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${
              answeredCount === 5
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                : 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/20'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>กำลังบันทึกผลการประเมิน...</span>
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>
                  {answeredCount === 5
                    ? 'ส่งแบบประเมินความพึงพอใจ'
                    : `กรุณาตอบให้ครบ (${answeredCount}/5)`}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
};
