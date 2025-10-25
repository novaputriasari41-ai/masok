// ===== Tahun Otomatis =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== SIMULASI CTPS 20 DETIK =====
const simBtn = document.getElementById("simBtn");
const simProgress = document.getElementById("simProgress");
const simTime = document.getElementById("simTime");

if (simBtn) {
  simBtn.addEventListener("click", () => {
    let waktu = 20;
    simBtn.disabled = true;
    simProgress.style.width = "0%";
    simTime.textContent = waktu + "s";

    const interval = setInterval(() => {
      waktu--;
      simTime.textContent = waktu + "s";
      simProgress.style.width = ((20 - waktu) / 20) * 100 + "%";

      if (waktu <= 0) {
        clearInterval(interval);
        simBtn.disabled = false;
        simTime.textContent = "Selesai ✅";
        setTimeout(() => {
          simTime.textContent = "20s";
          simProgress.style.width = "0%";
        }, 2000);
      }
    }, 1000);
  });
}


// ===== Mode Gelap =====
document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.body.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('ctps-theme', next);
});

// ===== Navigasi =====
document.getElementById("openQuizBtn").addEventListener("click", () => {
  document.getElementById("home").classList.remove("active");
  document.getElementById("quiz").classList.add("active");
});

// ===== KUIS =====
const qEl = document.getElementById('question'),
  optEl = document.getElementById('options'),
  startBtn = document.getElementById('startQuizBtn'),
  restartBtn = document.getElementById('restartQuizBtn'),
  timer = document.getElementById('timerNum'),
  chartEl = document.getElementById('scoreChart');

const quiz = [
  { q: "Apa kepanjangan dari CTPS?", opts: ["Cuci Tangan Pakai Sabun", "Cuci Tubuh Pakai Sabun", "Cuci Tangan Pagi Siang", "Cuci Tangan Pakai Sikat"], a: 0 },
  { q: "Tujuan utama dari CTPS adalah untuk…", opts: ["Mengharumkan tangan", "Menghilangkan kotoran dan kuman penyebab penyakit", "Membuat tangan lembut", "Menyegarkan tubuh"], a: 1 },
  { q: "Menurut WHO, berapa lama waktu ideal mencuci tangan?", opts: ["5 detik", "10 detik", "20 detik", "1 menit"], a: 2 },
  { q: "CTPS termasuk perilaku hidup bersih di lingkungan…", opts: ["Rumah", "Sekolah", "Masyarakat", "Semua benar"], a: 3 },
  { q: "CTPS dapat mencegah penyakit berikut, kecuali…", opts: ["Diare", "Tifus", "Flu", "Sakit mata karena kurang tidur"], a: 3 }
];

let cur = 0, score = 0, quizTimer = null, time = 5;
let scoreHistory = JSON.parse(localStorage.getItem("ctpsScores")) || [];

function renderQuiz() {
  chartEl.style.display = "none";
  if (cur >= quiz.length) {
    showResult();
    return;
  }
  const q = quiz[cur];
  qEl.textContent = q.q;
  optEl.innerHTML = "";
  q.opts.forEach((o, i) => {
    const b = document.createElement('button');
    b.textContent = o;
    b.onclick = () => ans(i, b);
    optEl.appendChild(b);
  });
  clearInterval(quizTimer);
  time = 5;
  timer.textContent = time;
  quizTimer = setInterval(() => {
    time--;
    timer.textContent = time;
    if (time <= 0) {
      clearInterval(quizTimer);
      cur++;
      renderQuiz();
    }
  }, 1000);
}

function ans(i, b) {
  clearInterval(quizTimer);
  const cor = quiz[cur].a;
  const all = optEl.querySelectorAll('button');
  all.forEach(btn => btn.disabled = true);
  if (i === cor) { b.classList.add('correct'); score++; } 
  else { b.classList.add('wrong'); all[cor].classList.add('correct'); }
  cur++;
  setTimeout(renderQuiz, 600);
}

function showResult() {
  qEl.textContent = `✅ Kuis selesai! Skor kamu ${score}/${quiz.length}`;
  optEl.innerHTML = "";
  startBtn.style.display = "none";
  restartBtn.style.display = "inline";
  
  // simpan skor ke localStorage
  scoreHistory.push(score);
  localStorage.setItem("ctpsScores", JSON.stringify(scoreHistory));

  // tampilkan grafik
  showChart();
}

function showChart() {
  chartEl.style.display = "block";
  const avg = scoreHistory.reduce((a,b)=>a+b,0)/scoreHistory.length;
  const ctx = chartEl.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Skor Kamu", "Rata-rata Semua Pemain"],
      datasets: [{
        data: [score, avg],
        backgroundColor: ["#089981", "#1ed5a4"]
      }]
    },
    options: {
      scales: { y: { beginAtZero: true, max: quiz.length } },
      plugins: { legend: { display: false } },
      animation: { duration: 800 }
    }
  });
}

startBtn.onclick = () => { cur = 0; score = 0; renderQuiz(); };
restartBtn.onclick = () => { cur = 0; score = 0; renderQuiz(); };

// ===== Navigasi Antar Menu =====
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");

  function showSection(id) {
    sections.forEach(sec => {
      if (sec.id === id) {
        sec.classList.add("active");
        sec.classList.remove("hidden");
      } else {
        sec.classList.remove("active");
        sec.classList.add("hidden");
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = link.dataset.section;
      showSection(target);
      if (window.innerWidth <= 780) navLinks.classList.remove("show");
    });
  });

  document.getElementById("openQuizBtn").addEventListener("click", () => {
    showSection("quiz");
  });

  showSection("home");
});
