import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

export interface SurveyResponse {
  id: string;
  ratings: [number, number, number, number, number];
  feedback: string;
  createdAt: string;
  clientId?: string;
}

export const QUESTIONS = [
  'ความชัดเจนและประโยชน์ของเนื้อหาหลักสูตร',
  'ทักษะและความสามารถในการถ่ายทอดของวิทยากร',
  'การนำความรู้และเทคนิคไปประยุกต์ใช้ในการทำงานจริง',
  'ความเหมาะสมของระยะเวลาและสื่อ/เอกสารประกอบ',
  'ความพึงพอใจในภาพรวมของการอบรมครั้งนี้',
];

// Pre-seed some realistic data
const initialResponses: SurveyResponse[] = [
  {
    id: 'res-1',
    ratings: [5, 5, 5, 4, 5],
    feedback: 'วิทยากรอธิบายเข้าใจง่ายมาก มีตัวอย่างเคสจริงให้ดู ได้ไอเดียกลับไปใช้งานทันทีครับ',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    clientId: 'seed-1',
  },
  {
    id: 'res-2',
    ratings: [5, 4, 5, 5, 5],
    feedback: 'เนื้อหาเข้มข้นตรงประเด็น สไลด์สวยงาม อยากให้จัดหลักสูตรขั้นสูง (Advanced) ต่อเลยค่ะ',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    clientId: 'seed-2',
  },
  {
    id: 'res-3',
    ratings: [4, 5, 4, 4, 4],
    feedback: 'เวิร์กชอปสนุกดีครับ มีส่วนร่วมตลอดเวลา บรรยากาศเป็นกันเอง',
    createdAt: new Date(Date.now() - 3600000 * 1.1).toISOString(),
    clientId: 'seed-3',
  },
  {
    id: 'res-4',
    ratings: [5, 5, 4, 4, 5],
    feedback: 'ตอบคำถามละเอียดมาก แนะนำวิธีแก้ปัญหาที่พบเจอบ่อยได้ตรงจุด ขอบคุณทีมงานครับ',
    createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    clientId: 'seed-4',
  },
  {
    id: 'res-5',
    ratings: [4, 4, 5, 3, 4],
    feedback: 'อยากให้มีเวลาช่วง Workshop นานขึ้นอีกนิด เพราะเนื้อหามีประโยชน์มาก',
    createdAt: new Date(Date.now() - 3600000 * 0.4).toISOString(),
    clientId: 'seed-5',
  },
  {
    id: 'res-6',
    ratings: [5, 5, 5, 5, 5],
    feedback: 'ยอดเยี่ยมมากค่ะ อุปกรณ์และสถานที่พร้อม วิทยากรเตรียมตัวมาดีมาก ประทับใจมาก',
    createdAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
    clientId: 'seed-6',
  },
];

let responses: SurveyResponse[] = [...initialResponses];

// SSE clients pool
const sseClients = new Set<Response>();

function broadcastUpdate() {
  const data = JSON.stringify(computeStats());
  for (const client of sseClients) {
    try {
      client.write(`data: ${data}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

export function getInterpretation(score: number): {
  level: string;
  enLevel: string;
  color: string;
  bgLight: string;
} {
  if (score >= 4.51) return { level: 'มากที่สุด', enLevel: 'Highest / Excellent', color: '#059669', bgLight: '#ecfdf5' };
  if (score >= 3.51) return { level: 'มาก', enLevel: 'High / Good', color: '#2563eb', bgLight: '#eff6ff' };
  if (score >= 2.51) return { level: 'ปานกลาง', enLevel: 'Moderate / Fair', color: '#d97706', bgLight: '#fffbeb' };
  if (score >= 1.51) return { level: 'น้อย', enLevel: 'Low / Poor', color: '#ea580c', bgLight: '#fff7ed' };
  return { level: 'น้อยที่สุด', enLevel: 'Lowest', color: '#dc2626', bgLight: '#fef2f2' };
}

function computeStats() {
  const total = responses.length;
  if (total === 0) {
    return {
      totalCount: 0,
      questionAverages: [0, 0, 0, 0, 0],
      overallAverage: 0,
      interpretation: { level: 'ยังไม่มีข้อมูล', enLevel: 'No Data Yet', color: '#64748b', bgLight: '#f8fafc' },
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
  }

  const qSums = [0, 0, 0, 0, 0];
  const dist: Record<number, number>[] = [
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  ];

  responses.forEach((res) => {
    res.ratings.forEach((val, idx) => {
      qSums[idx] += val;
      if (dist[idx][val] !== undefined) {
        dist[idx][val]++;
      }
    });
  });

  const questionAverages = qSums.map((sum) => Number((sum / total).toFixed(2)));
  const totalAvgSum = questionAverages.reduce((a, b) => a + b, 0);
  const overallAverage = Number((totalAvgSum / 5).toFixed(2));
  const interpretation = getInterpretation(overallAverage);

  const recentFeedback = responses
    .filter((r) => r.feedback && r.feedback.trim().length > 0)
    .slice(-15)
    .reverse();

  return {
    totalCount: total,
    questionAverages,
    overallAverage,
    interpretation,
    distribution: dist,
    recentFeedback,
    responses,
  };
}

// REST Endpoints
app.get('/api/responses', (_req: Request, res: Response) => {
  res.json({
    questions: QUESTIONS,
    ...computeStats(),
  });
});

app.post('/api/responses', (req: Request, res: Response) => {
  const { ratings, feedback, clientId } = req.body;

  if (!Array.isArray(ratings) || ratings.length !== 5) {
    res.status(400).json({ error: 'กรุณาประเมินให้ครบทั้ง 5 ข้อ' });
    return;
  }

  const validRatings = ratings.map(Number);
  const allValid = validRatings.every((r) => r >= 1 && r <= 5);
  if (!allValid) {
    res.status(400).json({ error: 'คะแนนการประเมินต้องอยู่ระหว่าง 1-5' });
    return;
  }

  const newEntry: SurveyResponse = {
    id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    ratings: validRatings as [number, number, number, number, number],
    feedback: (feedback || '').trim(),
    createdAt: new Date().toISOString(),
    clientId,
  };

  responses.push(newEntry);
  broadcastUpdate();

  res.status(201).json({
    success: true,
    message: 'บันทึกแบบประเมินเรียบร้อยแล้ว ขอบคุณสำหรับความเห็นครับ',
    responseId: newEntry.id,
  });
});

// Seed sample answers for testing/demo
app.post('/api/responses/sample', (_req: Request, res: Response) => {
  const sampleFeedbacks = [
    'วิทยากรมีความรู้จริง สามารถตอบคำถามได้ตรงประเด็นมาก',
    'อยากให้จัดเวลาเพิ่มอีก 1 วันสำหรับ Workshop เชิงลึก',
    'เอกสารคู่มือเข้าใจง่าย นำไปใช้สอนต่อในทีมได้เลย',
    'ชอบการยกตัวอย่าง Real-world Use Case ชัดเจนมาก',
    'อาหารว่างอร่อย และบรรยากาศการเรียนสนุกสนาน',
    'ระบบและเครื่องมือใช้งานง่ายมาก ประทับใจค่ะ',
    'ได้เรียนรู้แนวคิดใหม่ๆ ที่ไม่เคยรู้มาก่อนเลยครับ',
  ];

  const count = 3;
  for (let i = 0; i < count; i++) {
    // Generate realistic mostly positive ratings (4 or 5, occasionally 3)
    const genRating = () => {
      const rand = Math.random();
      if (rand < 0.6) return 5;
      if (rand < 0.9) return 4;
      return 3;
    };

    const newEntry: SurveyResponse = {
      id: 'res-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      ratings: [genRating(), genRating(), genRating(), genRating(), genRating()],
      feedback: Math.random() > 0.3 ? sampleFeedbacks[Math.floor(Math.random() * sampleFeedbacks.length)] : '',
      createdAt: new Date().toISOString(),
      clientId: 'sample-' + Date.now() + '-' + i,
    };
    responses.push(newEntry);
  }

  broadcastUpdate();
  res.json({ success: true, totalCount: responses.length });
});

// Reset all responses
app.post('/api/responses/reset', (req: Request, res: Response) => {
  const { restoreSamples } = req.body;
  if (restoreSamples) {
    responses = [...initialResponses];
  } else {
    responses = [];
  }
  broadcastUpdate();
  res.json({ success: true, count: responses.length });
});

// Server-Sent Events (SSE) for Real-time Dashboard push
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately on connect
  res.write(`data: ${JSON.stringify(computeStats())}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
