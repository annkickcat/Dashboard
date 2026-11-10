export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Prompt', sans-serif; }
  </style>
  <!-- Firebase App & Realtime Database SDK (Compat v10) -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen py-6 px-4">
  <div class="max-w-xl mx-auto">
    <!-- Header Card -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div class="flex items-center gap-3 mb-2">
        <span class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </span>
        <div>
          <h1 class="text-xl font-bold text-slate-900">แบบประเมินความพึงพอใจการอบรม</h1>
          <p class="text-xs text-slate-500">กรุณาให้คะแนนตามความรู้สึกจริง เพื่อการพัฒนาหลักสูตร</p>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>เกณฑ์คะแนน: 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)</span>
        <span>ไม่ต้องระบุชื่อผู้ตอบ</span>
      </div>
    </div>

    <!-- Already Submitted Screen (Hidden by default) -->
    <div id="submittedState" class="hidden bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">ขอบคุณสำหรับการประเมิน!</h2>
      <p class="text-sm text-slate-600 mb-6">ระบบได้รับความคิดเห็นของท่านเรียบร้อยแล้ว และผลจะแสดงขึ้นหน้าจอแดชบอร์ดทันที</p>
      <button onclick="resetSubmission()" class="text-xs text-blue-600 hover:text-blue-800 underline">
        กดที่นี่เพื่อทดสอบตอบใหม่อีกครั้ง (สำหรับทดสอบระบบ)
      </button>
    </div>

    <!-- Survey Form -->
    <form id="surveyForm" class="space-y-4">
      <!-- Question 1 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div class="flex items-start gap-2.5 mb-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
          <p class="text-sm font-semibold text-slate-900 leading-snug">ความชัดเจนและประโยชน์ของเนื้อหาหลักสูตร</p>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q1-options"></div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div class="flex items-start gap-2.5 mb-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
          <p class="text-sm font-semibold text-slate-900 leading-snug">ทักษะและความสามารถในการถ่ายทอดของวิทยากร</p>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q2-options"></div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div class="flex items-start gap-2.5 mb-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
          <p class="text-sm font-semibold text-slate-900 leading-snug">การนำความรู้และเทคนิคไปประยุกต์ใช้ในการทำงานจริง</p>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q3-options"></div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div class="flex items-start gap-2.5 mb-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
          <p class="text-sm font-semibold text-slate-900 leading-snug">ความเหมาะสมของระยะเวลาและสื่อ/เอกสารประกอบ</p>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q4-options"></div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div class="flex items-start gap-2.5 mb-3">
          <span class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
          <p class="text-sm font-semibold text-slate-900 leading-snug">ความพึงพอใจในภาพรวมของการอบรมครั้งนี้</p>
        </div>
        <div class="grid grid-cols-5 gap-2" id="q5-options"></div>
      </div>

      <!-- Feedback Area -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label for="feedback" class="block text-sm font-semibold text-slate-900 mb-1">
          ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุง <span class="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
        </label>
        <textarea id="feedback" rows="3" placeholder="เขียนความประทับใจ หรือสิ่งที่อยากให้พัฒนาเพิ่มเติม..."
          class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submitBtn"
        class="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
        <span>ส่งแบบประเมินความพึงพอใจ</span>
      </button>
    </form>
  </div>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const responsesRef = db.ref('training_evaluations');

    const STORAGE_KEY = 'eval_training_submitted';
    const ratingState = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };

    function renderRatingButtons(questionKey, containerId) {
      const container = document.getElementById(containerId);
      container.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rating-btn flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 transition-all text-xs font-medium border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700';
        btn.innerHTML = '<span class="text-base font-bold mb-0.5">' + i + '</span><span class="text-[10px] text-slate-400">' + (i === 1 ? 'น้อยสุด' : i === 5 ? 'มากสุด' : '') + '</span>';
        btn.onclick = () => {
          ratingState[questionKey] = i;
          updateButtonStyles(questionKey, containerId);
        };
        container.appendChild(btn);
      }
    }

    function updateButtonStyles(questionKey, containerId) {
      const container = document.getElementById(containerId);
      const buttons = container.querySelectorAll('button');
      buttons.forEach((btn, index) => {
        const value = index + 1;
        if (value === ratingState[questionKey]) {
          btn.className = 'rating-btn flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 transition-all text-xs font-medium border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02]';
          btn.querySelector('span:last-child').className = 'text-[10px] text-blue-100';
        } else {
          btn.className = 'rating-btn flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border-2 transition-all text-xs font-medium border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700';
          btn.querySelector('span:last-child').className = 'text-[10px] text-slate-400';
        }
      });
    }

    function checkSubmitted() {
      if (localStorage.getItem(STORAGE_KEY)) {
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('submittedState').classList.remove('hidden');
      }
    }

    function resetSubmission() {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }

    ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => renderRatingButtons(q, q + '-options'));
    checkSubmitted();

    document.getElementById('surveyForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      for (const q of ['q1', 'q2', 'q3', 'q4', 'q5']) {
        if (!ratingState[q]) {
          alert('กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อครับ');
          return;
        }
      }

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'กำลังส่งข้อมูล...';

      const payload = {
        ratings: [ratingState.q1, ratingState.q2, ratingState.q3, ratingState.q4, ratingState.q5],
        feedback: document.getElementById('feedback').value.trim(),
        createdAt: new Date().toISOString(),
        clientTimestamp: Date.now()
      };

      try {
        await responsesRef.push(payload);
        localStorage.setItem(STORAGE_KEY, 'true');
        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('submittedState').classList.remove('hidden');
      } catch (err) {
        console.error(err);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = 'ส่งแบบประเมินความพึงพอใจ';
      }
    });
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Disney Magical Dashboard (Live Projector)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <!-- QR Code CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .font-mono-num { font-family: 'JetBrains Mono', monospace; font-variant-numeric: tabular-nums; }
  </style>
  <!-- Firebase App & Realtime Database SDK (Compat v10) -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
</head>
<body class="bg-gradient-to-b from-[#070a1e] via-[#0d1238] to-[#090d28] text-slate-100 min-h-screen p-6 lg:p-8">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Top Header: Disney Magical Edition -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-400/20">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 text-slate-950 flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/20">
            👑
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Disney Magical Evaluation Dashboard
            </h1>
            <p class="text-xs md:text-sm text-slate-300">✨ ผลการประเมินความพึงพอใจการอบรมแดนมหัศจรรย์ (กราฟวงกลม &amp; อัปเดตเรียลไทม์)</p>
          </div>
        </div>
      </div>
      <!-- Actions: Fullscreen & CSV Download -->
      <div class="flex items-center gap-3">
        <button onclick="toggleFullscreen()" class="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-amber-200 text-xs font-medium border border-amber-400/30 flex items-center gap-1.5 transition-colors">
          <span>✨ เต็มจอ (Projector)</span>
        </button>
        <button onclick="downloadCSV()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all">
          <span>ดาวน์โหลด CSV</span>
        </button>
      </div>
    </header>

    <!-- Top KPI Row -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Total Responses -->
      <div class="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-5 shadow-xl">
        <p class="text-xs text-amber-200/90 font-semibold mb-1">จำนวนผู้ประเมินทั้งหมด</p>
        <div class="flex items-baseline gap-2">
          <span id="totalRespondents" class="text-4xl sm:text-5xl font-extrabold text-white font-mono-num">0</span>
          <span class="text-xs text-amber-200/80">คน</span>
        </div>
        <p class="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          ซิงก์ผลลัพธ์สดทันที
        </p>
      </div>

      <!-- Overall Average with Disney Badge -->
      <div class="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-5 shadow-xl md:col-span-2">
        <div class="flex items-center justify-between">
          <p class="text-xs text-amber-200/90 font-semibold mb-1">คะแนนความพึงพอใจเฉลี่ยรวม (เต็ม 5.00)</p>
          <span id="levelBadge" class="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
            กำลังโหลด...
          </span>
        </div>
        <div class="flex items-baseline gap-3 mt-1">
          <span id="overallScore" class="text-4xl md:text-5xl font-extrabold font-mono-num bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">0.00</span>
          <span class="text-sm font-semibold text-slate-400">/ 5.00</span>
          <span id="interpretationText" class="text-xs text-amber-300 font-semibold ml-2"></span>
        </div>
        <div class="w-full bg-slate-800/80 h-3 rounded-full mt-3 overflow-hidden border border-amber-400/20">
          <div id="overallProgress" class="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-700 shadow-sm" style="width: 0%"></div>
        </div>
      </div>

      <!-- QR Code Attendee Join Card with Disney Gold Frame -->
      <div class="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/70 border border-amber-400/40 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
        <div id="qrcode" class="bg-white p-2 rounded-xl shrink-0 shadow-md"></div>
        <div>
          <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">สแกนร่วมประเมิน</p>
          <p class="text-[11px] text-slate-300 mt-1">ใช้มือถือส่องกล้อง QR Code เพื่อเปิดแบบสอบถาม</p>
        </div>
      </div>
    </div>

    <!-- 5 Questions Circular Donut Gauges (กราฟวงกลมรายข้อ) -->
    <div class="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-6 shadow-xl">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="text-lg font-bold text-white flex items-center gap-2">
            <span>👑 ผลคะแนนเฉลี่ยรายข้อรูปแบบกราฟวงกลม (Circular Gauges)</span>
          </h2>
          <p class="text-xs text-slate-300">แสดงผลคะแนน 1.00 ถึง 5.00 ในรูปแบบวงกลมเรเดียล</p>
        </div>
        <div class="text-xs text-amber-300 font-mono-num font-semibold">
          เกณฑ์: 4.51-5.00 มากที่สุด ✨
        </div>
      </div>

      <!-- Circular Gauges Grid -->
      <div id="circularContainer" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <!-- Injected via JS -->
      </div>
    </div>

    <!-- Recent Suggestions Feed -->
    <div class="bg-slate-900/75 backdrop-blur-md border border-amber-400/25 rounded-2xl p-6 shadow-xl flex flex-col">
      <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <span>✨ เสียงสะท้อนจากผู้เข้าร่วมอบรม</span>
        </h2>
        <span id="feedbackCount" class="text-xs text-amber-300 font-mono-num">0 รายการ</span>
      </div>
      <div id="feedbackList" class="space-y-3 overflow-y-auto max-h-[360px] pr-1">
        <p class="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะเข้ามา</p>
      </div>
    </div>
  </div>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const responsesRef = db.ref('training_evaluations');

    const QUESTIONS = [
      'ความชัดเจนและประโยชน์ของเนื้อหาหลักสูตร',
      'ทักษะและความสามารถในการถ่ายทอดของวิทยากร',
      'การนำความรู้และเทคนิคไปประยุกต์ใช้ในการทำงานจริง',
      'ความเหมาะสมของระยะเวลาและสื่อ/เอกสารประกอบ',
      'ความพึงพอใจในภาพรวมของการอบรมครั้งนี้'
    ];

    const THEME_COLORS = ['#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#fde047'];

    let cachedResponses = [];

    const surveyUrl = window.location.href.replace(/dashboard\\.html.*/, 'index.html');
    new QRCode(document.getElementById("qrcode"), {
      text: surveyUrl,
      width: 80,
      height: 80,
      colorDark : "#0f172a",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.M
    });

    function getInterpretation(score) {
      if (score >= 4.51) return { level: 'มากที่สุด ✨', color: '#fbbf24', badge: 'bg-amber-400/20 text-amber-300 border-amber-400/40' };
      if (score >= 3.51) return { level: 'มาก ⭐', color: '#34d399', badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40' };
      if (score >= 2.51) return { level: 'ปานกลาง', color: '#60a5fa', badge: 'bg-blue-400/20 text-blue-300 border-blue-400/40' };
      if (score >= 1.51) return { level: 'น้อย', color: '#f59e0b', badge: 'bg-orange-400/20 text-orange-300 border-orange-400/40' };
      return { level: 'น้อยที่สุด', color: '#f87171', badge: 'bg-rose-400/20 text-rose-300 border-rose-400/40' };
    }

    responsesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      cachedResponses = [];
      if (data) {
        Object.keys(data).forEach(key => {
          cachedResponses.push({ id: key, ...data[key] });
        });
      }
      renderDashboard();
    });

    function renderDashboard() {
      const total = cachedResponses.length;
      document.getElementById('totalRespondents').innerText = total;

      if (total === 0) {
        document.getElementById('overallScore').innerText = '0.00';
        document.getElementById('levelBadge').innerText = 'รอข้อมูลการประเมิน';
        document.getElementById('overallProgress').style.width = '0%';
        renderCircularGauges([0,0,0,0,0]);
        document.getElementById('feedbackList').innerHTML = '<p class="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะเข้ามา</p>';
        return;
      }

      const qSums = [0, 0, 0, 0, 0];
      cachedResponses.forEach(res => {
        if (res.ratings) {
          res.ratings.forEach((val, i) => {
            qSums[i] += Number(val) || 0;
          });
        }
      });

      const qAverages = qSums.map(sum => (sum / total));
      const overallAvg = qAverages.reduce((a, b) => a + b, 0) / 5;
      const interp = getInterpretation(overallAvg);

      document.getElementById('overallScore').innerText = overallAvg.toFixed(2);
      document.getElementById('levelBadge').className = 'text-xs font-bold px-3 py-1 rounded-full border ' + interp.badge;
      document.getElementById('levelBadge').innerText = interp.level;
      document.getElementById('interpretationText').innerText = 'ระดับ: ' + interp.level;
      document.getElementById('overallProgress').style.width = ((overallAvg / 5) * 100) + '%';

      renderCircularGauges(qAverages);
      renderFeedbacks();
    }

    // สร้างกราฟวงกลม SVG สำหรับแต่ละข้อ
    function renderCircularGauges(averages) {
      const container = document.getElementById('circularContainer');
      container.innerHTML = '';
      const radius = 50;
      const circ = 2 * Math.PI * radius;

      QUESTIONS.forEach((qText, idx) => {
        const avg = averages[idx] || 0;
        const pct = Math.min(100, (avg / 5) * 100);
        const offset = circ - (pct / 100) * circ;
        const color = THEME_COLORS[idx % THEME_COLORS.length];
        const interp = getInterpretation(avg);

        const card = document.createElement('div');
        card.className = 'bg-slate-950/60 rounded-2xl p-4 border border-amber-400/20 flex flex-col items-center text-center shadow-lg';
        card.innerHTML = \`
          <div class="flex items-center gap-1.5 mb-2">
            <span class="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
              \${idx + 1}
            </span>
            <span class="text-xs font-semibold text-amber-200">ข้อที่ \${idx + 1}</span>
          </div>

          <div class="relative w-32 h-32 my-1 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="\${radius}" stroke="#1e293b" stroke-width="8" fill="transparent" />
              <circle cx="60" cy="60" r="\${radius}" stroke="\${color}" stroke-width="8" stroke-dasharray="\${circ}" stroke-dashoffset="\${offset}" stroke-linecap="round" fill="transparent" class="transition-all duration-700" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-2xl font-extrabold font-mono-num text-white">\${avg.toFixed(2)}</span>
              <span class="text-[10px] text-slate-400">/ 5.00</span>
              <span class="text-[10px] text-amber-300 font-mono-num">(\${Math.round(pct)}%)</span>
            </div>
          </div>

          <span class="mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border \${interp.badge}">
            \${interp.level}
          </span>
          <p class="mt-2 text-xs font-medium text-slate-200 line-clamp-2 leading-snug">
            \${qText}
          </p>
        \`;
        container.appendChild(card);
      });
    }

    function renderFeedbacks() {
      const list = document.getElementById('feedbackList');
      const feedbacks = cachedResponses
        .filter(r => r.feedback && r.feedback.trim().length > 0)
        .reverse();

      document.getElementById('feedbackCount').innerText = feedbacks.length + ' รายการ';

      if (feedbacks.length === 0) {
        list.innerHTML = '<p class="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะข้อความเข้ามา</p>';
        return;
      }

      list.innerHTML = '';
      feedbacks.forEach(item => {
        const card = document.createElement('div');
        card.className = 'p-3.5 bg-slate-950/80 rounded-xl border border-amber-400/20 text-xs space-y-1.5';
        card.innerHTML = \`
          <p class="text-slate-200 leading-relaxed">"\${item.feedback}"</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span class="text-amber-300 font-semibold">คะแนนเฉลี่ย: \${(item.ratings.reduce((a,b)=>a+b,0)/5).toFixed(1)}/5</span>
            <span>\${new Date(item.createdAt || Date.now()).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} น.</span>
          </div>
        \`;
        list.appendChild(card);
      });
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    function downloadCSV() {
      if (cachedResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }

      let csvContent = "\\uFEFF"; // UTF-8 BOM for Thai Excel
      csvContent += "ลำดับ,วันเวลาที่ประเมิน,ข้อ 1 เนื้อหา,ข้อ 2 วิทยากร,ข้อ 3 การนำไปใช้,ข้อ 4 เวลาและสื่อ,ข้อ 5 ภาพรวม,คะแนนเฉลี่ย,ข้อเสนอแนะ\\r\\n";

      cachedResponses.forEach((res, idx) => {
        const r = res.ratings || [0,0,0,0,0];
        const avg = (r.reduce((a,b)=>a+b,0)/5).toFixed(2);
        const fb = (res.feedback || '').replace(/"/g, '""');
        const dateStr = new Date(res.createdAt || Date.now()).toLocaleString('th-TH');
        csvContent += \`\${idx + 1},"\${dateStr}",\${r[0]},\${r[1]},\${r[2]},\${r[3]},\${r[4]},\${avg},"\${fb}"\\r\\n\`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", \`disney_training_evaluation_\${new Date().toISOString().slice(0,10)}.csv\`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  </script>
</body>
</html>`;

export const FIREBASE_DEPLOY_GUIDE_MD = `# คู่มือการติดตั้ง Firebase Realtime Database และ Deploy ทีละขั้นตอน (ฟรี 100%)

ระบบนี้ถูกออกแบบมาให้เป็น **Serverless 100%** โดยใช้ **Firebase Realtime Database (Spark Plan ฟรี)** รองรับผู้เข้าอบรมหลักร้อย-หลักพันคนพร้อมกันได้สบายโดยไม่มีค่าใช้จ่าย

---

## ขั้นตอนที่ 1: สร้าง Firebase Project (ฟรี)
1. เข้าไปที่เว็บไซต์ [https://console.firebase.google.com](https://console.firebase.google.com) และล็อกอินด้วย Google Account
2. คลิกปุ่ม **"Add project"** (เพิ่มโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น \`disney-training-survey\` แล้วกด **Continue**
4. หน้า Google Analytics สามารถเปิดหรือปิดก็ได้ แล้วกด **Create project**
5. รอสักครู่จนสร้างเสร็จ แล้วกด **Continue** เข้าสู่หน้า Console

---

## ขั้นตอนที่ 2: สร้างและตั้งค่า Realtime Database
1. ที่เมนูด้านซ้าย เลือก **Build** > **Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. เลือกตำแหน่งฐานข้อมูล แนะนำเลือก **Singapore (asia-southeast1)** เพื่อความเร็วสูงสุดในไทย แล้วกด **Next**
4. ในขั้นตอน Security Rules ให้เลือก **"Start in test mode"** แล้วกด **Enable**
5. ไปที่แท็บ **Rules** ด้านบน ปรับกฎให้ปลอดภัยดังนี้:
\`\`\`json
{
  "rules": {
    "training_evaluations": {
      ".read": true,
      ".write": true
    }
  }
}
\`\`\`
6. กดปุ่ม **"Publish"** เพื่อบันทึกกฎ

---

## ขั้นตอนที่ 3: รับรหัสเชื่อมต่อ (firebaseConfig)
1. ที่หน้าหลักของโปรเจกต์ คลิกไอคอนรูป **เว็บ (</>)** เพื่อลงทะเบียน Web App
2. ตั้งชื่อ App เช่น \`Disney Survey App\` แล้วคลิก **Register app**
3. คัดลอกโค้ดส่วน \`const firebaseConfig = { ... };\`
4. นำไปวางแทนที่ตัวแปร \`firebaseConfig\` ในทั้ง 2 ไฟล์:
   - ไฟล์ **\`index.html\`** (หน้าตอบของผู้เข้าอบรม)
   - ไฟล์ **\`dashboard.html\`** (หน้าแดชบอร์ดฉายโปรเจกเตอร์)

---

## ขั้นตอนที่ 4: การนำไป Deploy ใช้งานจริง (เลือกวิธีที่สะดวก)

### วิธีที่ A: Deploy ผ่าน GitHub Pages (ง่ายและเร็วที่สุด - ฟรีตลอดชีพ)
1. สร้าง New Repository บน GitHub (Public)
2. อัปโหลดไฟล์ \`index.html\` และ \`dashboard.html\` ขึ้นไป
3. ไปที่แท็บ **Settings** > **Pages**
4. ในส่วน Branch เลือก \`main\` และโฟลเดอร์ \`/(root)\` แล้วกด **Save**
5. คุณจะได้ URL ทันที เช่น \`https://username.github.io/repo-name/index.html\`
6. สามารถนำ URL หน้า \`index.html\` ไปเปิดสร้าง QR Code ฉายขึ้นจอได้เลย!

### วิธีที่ B: Deploy ผ่าน Firebase Hosting (เป็นทางการและเร็วมาก)
1. ติดตั้ง Firebase CLI ในคอมพิวเตอร์ของคุณ (ถ้ายังไม่มี):
   \`npm install -g firebase-tools\`
2. ล็อกอิน Firebase:
   \`firebase login\`
3. ในโฟลเดอร์ที่มีไฟล์ \`index.html\` และ \`dashboard.html\` รันคำสั่ง:
   \`firebase init hosting\`
   - เลือก Existing Project ที่สร้างไว้
   - ตั้ง Public Directory เป็น \`.\` (จุด)
   - ไม่ต้องตั้งเป็น Single-page app (ตอบ No)
4. อัปโหลดขึ้นอินเทอร์เน็ตทันทีด้วยคำสั่ง:
   \`firebase deploy\`
5. คุณจะได้โดเมนฟรี เช่น \`https://your-project.web.app\` พร้อมใช้งานทันที

---

## สรุปจุดเด่นของระบบแดชบอร์ดดิสนีย์ (Disney Magical Edition)
- 👑 **กราฟวงกลมเรเดียล (Circular Gauges)**: แสดงผลคะแนนเฉลี่ยรายข้อ 1.00 ถึง 5.00 แบบวงกลมชัดเจน
- 🏰 **ธีมดิสนีย์แดนมหัศจรรย์**: โทนสี Midnight Navy, Fairytale Gold และ Stardust Twinkle
- 🥧 **กราฟโดนัทจำแนกดาว**: แสดงสัดส่วนผู้ให้คะแนน 1-5 ดาวอย่างสวยงาม
- 📱 **QR Code ฝังบนจอ**: ผู้เข้าอบรมส่องกล้องสแกนได้ทันทีจากที่นั่ง
- 💾 **ไฟล์ CSV ภาษาไทย 100%**: รองรับ UTF-8 BOM เปิดใน Excel ภาษาไทยไม่เพี้ยน
`;
