export interface SurveyResponse {
  id: string;
  ratings: [number, number, number, number, number];
  feedback: string;
  createdAt: string;
  clientId?: string;
}

export interface QuestionStat {
  question: string;
  average: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface SurveyStats {
  totalCount: number;
  questionAverages: [number, number, number, number, number];
  overallAverage: number;
  interpretation: {
    level: string;
    enLevel: string;
    color: string;
    bgLight: string;
  };
  distribution: Record<number, number>[];
  recentFeedback: SurveyResponse[];
  responses: SurveyResponse[];
}

export const QUESTIONS = [
  'ความชัดเจนและประโยชน์ของเนื้อหาหลักสูตร',
  'ทักษะและความสามารถในการถ่ายทอดของวิทยากร',
  'การนำความรู้และเทคนิคไปประยุกต์ใช้ในการทำงานจริง',
  'ความเหมาะสมของระยะเวลาและสื่อ/เอกสารประกอบ',
  'ความพึงพอใจในภาพรวมของการอบรมครั้งนี้',
];

export const RATING_LEVELS = [
  { value: 1, label: 'น้อยที่สุด', desc: 'ควรปรับปรุงอย่างยิ่ง', emoji: '😞' },
  { value: 2, label: 'น้อย', desc: 'ควรพัฒนาเพิ่มเติม', emoji: '😐' },
  { value: 3, label: 'ปานกลาง', desc: 'พอใช้ได้ ตามเกณฑ์', emoji: '🙂' },
  { value: 4, label: 'มาก', desc: 'ดี ตรงตามคาดหวัง', emoji: '😊' },
  { value: 5, label: 'มากที่สุด', desc: 'ยอดเยี่ยม เกินคาด', emoji: '🤩' },
];

export function getInterpretation(score: number): {
  level: string;
  enLevel: string;
  color: string;
  bgLight: string;
  badgeClass: string;
} {
  if (score >= 4.51) {
    return {
      level: 'มากที่สุด',
      enLevel: 'Highest / Excellent',
      color: '#059669',
      bgLight: '#ecfdf5',
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }
  if (score >= 3.51) {
    return {
      level: 'มาก',
      enLevel: 'High / Good',
      color: '#2563eb',
      bgLight: '#eff6ff',
      badgeClass: 'text-blue-700 bg-blue-50 border-blue-200',
    };
  }
  if (score >= 2.51) {
    return {
      level: 'ปานกลาง',
      enLevel: 'Moderate / Fair',
      color: '#d97706',
      bgLight: '#fffbeb',
      badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }
  if (score >= 1.51) {
    return {
      level: 'น้อย',
      enLevel: 'Low / Poor',
      color: '#ea580c',
      bgLight: '#fff7ed',
      badgeClass: 'text-orange-700 bg-orange-50 border-orange-200',
    };
  }
  return {
    level: 'น้อยที่สุด',
    enLevel: 'Lowest',
    color: '#dc2626',
    bgLight: '#fef2f2',
    badgeClass: 'text-red-700 bg-red-50 border-red-200',
  };
}
