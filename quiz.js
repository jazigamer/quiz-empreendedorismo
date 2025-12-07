/* quiz.js
   Versão unificada: visual + lógica do quiz (sorteio automático 5/20+)
   Substitua o script inline do HTML por: <script src="quiz.js"></script>
*/

// ==================== BANCO DE PERGUNTAS (20) ====================
const QUESTION_POOL = [
  { question: "🚀 Qual é o principal objetivo do empreendedorismo no setor de tecnologia?", answers: ["Criar soluções inovadoras e gerar impacto", "Apenas ganhar seguidores", "Copiar empresas famosas"], correct: 0, explanation: "O empreendedor usa a tecnologia para inovar, resolver problemas e gerar impacto real." },
  { question: "🤖 Uma das vantagens de empreender com tecnologia é:", answers: ["Trabalhar apenas presencialmente", "Possibilidade de trabalhar de forma remota", "Ter poucos clientes"], correct: 1, explanation: "A tecnologia permite trabalhar de qualquer lugar." },
  { question: "💸 Qual é a principal forma de divulgação no empreendedorismo digital?", answers: ["Marketing digital", "Rádio antigo", "Cartaz impresso"], correct: 0, explanation: "Redes sociais, anúncios e sites são os principais meios." },
  { question: "🧠 O empreendedor precisa ser:", answers: ["Criativo, estratégico e persistente", "Medroso e dependente", "Apenas bom em matemática"], correct: 0, explanation: "O sucesso vem da mentalidade, não só de números." },
  { question: "⚡ Quanto pode ganhar um empreendedor iniciante em tecnologia?", answers: ["Até R$ 1.000", "R$ 3.000 a R$ 10.000", "Apenas salário mínimo"], correct: 1, explanation: "O lucro varia conforme o projeto e execução." },
  { question: "🏢 Qual instituição oferece curso técnico em Informática e Empreendedorismo?", answers: ["IFCE", "UFC", "UECE"], correct: 0, explanation: "O IFCE oferece formação técnica na área." },
  { question: "🎓 A duração média para formação em empreendedorismo tecnológico é:", answers: ["6 meses", "De 2 a 4 anos", "10 anos"], correct: 1, explanation: "Depende se for técnico, tecnológico ou superior." },
  { question: "🌎 O mercado de tecnologia está:", answers: ["Em queda", "Estagnado", "Em forte expansão"], correct: 2, explanation: "A inovação cresce em todo o mundo." },
  { question: "📱 Um empreendedor pode trabalhar:", answers: ["Somente em escritório", "Somente fora do Brasil", "De forma remota ou presencial"], correct: 2, explanation: "A tecnologia permite vários formatos de trabalho." },
  { question: "🧾 Uma das dificuldades do empreendedor é:", answers: ["Concorrência no mercado", "Ajuda financeira constante", "Pouca inovação"], correct: 0, explanation: "A concorrência exige atualização constante." },
  { question: "🏛️ Uma dificuldade comum no Brasil para empreendedores é:", answers: ["Falta de internet", "Burocracia e impostos", "Excesso de clientes"], correct: 1, explanation: "A burocracia é um grande desafio." },
  { question: "💡 Qual dessas áreas está em crescimento no empreendedorismo tech?", answers: ["Inteligência artificial", "Datilografia", "Fax"], correct: 0, explanation: "IA, apps e automação estão em alta." },
  { question: "📊 Uma habilidade essencial para empreender é:", answers: ["Gestão financeira", "Só jogar no celular", "Apenas decorar fórmulas"], correct: 0, explanation: "Saber administrar é essencial." },
  { question: "💻 Uma função do empreendedor tecnológico é:", answers: ["Criar soluções digitais", "Somente vender na rua", "Evitar inovação"], correct: 0, explanation: "Ele usa a tecnologia como ferramenta de negócio." },
  { question: "👥 Uma característica importante do empreendedor é:", answers: ["Trabalho em equipe", "Evitar pessoas", "Trabalhar sozinho sempre"], correct: 0, explanation: "Empreender também é saber liderar." },
  { question: "🚀 O Brasil é o ___ país com mais startups em crescimento?", answers: ["3º", "7º", "12º"], correct: 1, explanation: "O Brasil ocupa a 7ª posição mundial." },
  { question: "📍 O Ceará se destaca em tecnologia por causa:", answers: ["Porto Digital e Hub de Inovação", "Plantação rural", "Apenas comércio"], correct: 0, explanation: "Fortaleza é polo tecnológico." },
  { question: "🏫 A UFC e a UECE oferecem cursos de:", answers: ["Administração", "Pedagogia apenas", "Medicina apenas"], correct: 0, explanation: "Administração é uma base para empreender." },
  { question: "🔄 Inovar significa:", answers: ["Copiar tudo", "Melhorar e criar soluções", "Repetir o passado"], correct: 1, explanation: "Inovação é transformar ideias." },
  { question: "🌐 A internet permite ao empreendedor:", answers: ["Vender só no bairro", "Escalar o negócio", "Fechar cedo"], correct: 1, explanation: "Negócios digitais crescem rapidamente." }
];

// ==================== SORTEIO AUTOMÁTICO DE 5 QUESTÕES ====================
function sortearQuestoes(pool, quantidade) {
  const copia = [...pool];
  const sorteadas = [];
  while (sorteadas.length < quantidade && copia.length > 0) {
    const index = Math.floor(Math.random() * copia.length);
    sorteadas.push(copia.splice(index, 1)[0]);
  }
  return sorteadas;
}

// ==================== VARIÁVEIS DO QUIZ ====================
let MISSIONS = sortearQuestoes(QUESTION_POOL, 5);
let currentMissionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;
let canAnswer = true;
let autoContinue = true;
let matrixContext;

// ==================== ELEMENTOS DOM (assume HTML intacto) ====================
const elements = {
  questionText: document.getElementById('questionText'),
  answersContainer: document.getElementById('answersContainer'),
  currentMission: document.getElementById('currentMission'),
  totalMissions: document.getElementById('totalMissions'),
  scoreValue: document.getElementById('scoreValue'),
  timerValue: document.getElementById('timerValue'),
  timerFill: document.getElementById('timerFill'),
  resultsScreen: document.getElementById('resultsScreen'),
  loadingScreen: document.getElementById('loadingScreen'),
  cyberModal: document.getElementById('cyberModal'),
  modalIcon: document.getElementById('modalIcon'),
  modalTitle: document.getElementById('modalTitle'),
  modalMessage: document.getElementById('modalMessage'),
  victoryIcon: document.getElementById('victoryIcon'),
  finalScore: document.getElementById('finalScore'),
  resultMessage: document.getElementById('resultMessage'),
  prizeText: document.getElementById('prizeText'),
  matrixCanvas: document.getElementById('matrixCanvas'),
  particlesContainer: document.getElementById('particlesContainer')
};

// ==================== FUNÇÃO DO MODAL ====================
function showModal(isCorrect, explanation) {
  const modal = elements.cyberModal;
  const icon = elements.modalIcon;
  const title = elements.modalTitle;
  const message = elements.modalMessage;
  
  if (!modal || !icon || !title || !message) return;
  
  if (isCorrect) {
    icon.innerHTML = '<i class="fas fa-check-circle"></i>';
    title.textContent = 'CORRETO!';
    icon.style.color = '#00ff88';
  } else {
    icon.innerHTML = '<i class="fas fa-times-circle"></i>';
    title.textContent = 'INCORRETO';
    icon.style.color = '#ff0055';
  }
  
  message.textContent = explanation || "Continue para a próxima pergunta!";
  modal.classList.add('active');
}

// ==================== CONTINUE GAME ====================
function continueGame() {
  playSound('clickSound');
  
  const modal = document.getElementById('cyberModal');
  if (modal) modal.classList.remove('active');
  
  // Limpar seleções anteriores
  const buttons = document.querySelectorAll('.cyber-option');
  buttons.forEach(btn => {
    btn.classList.remove('correct', 'incorrect', 'disabled');
  });

  if (currentMissionIndex < MISSIONS.length - 1) {
    currentMissionIndex++;
    loadMission();
  } else {
    showResults();
  }
}

// ==================== INICIALIZAÇÃO COMPLETA (visual + quiz) ====================
function init() {
  console.log("🎮 QUIZ ULTRA - INICIALIZANDO...");
  preventZoom();
  setupMatrixEffect();
  createInitialParticles();
  setupAudio();

  // Garantir loading por 1.5-2.5s pra visual carregar
  setTimeout(() => {
    if (elements.loadingScreen) {
      elements.loadingScreen.style.opacity = '0';
      setTimeout(() => {
        elements.loadingScreen.style.display = 'none';
        startQuiz();
      }, 600);
    } else {
      startQuiz();
    }
  }, 1800);
}

// ==================== PREVENIR ZOOM ====================
function preventZoom() {
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('touchmove', e => {
    if (e.scale !== 1) e.preventDefault();
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', e => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, false);
}

// ==================== MATRIX BACKGROUND (cópia do seu original) ====================
function setupMatrixEffect() {
  const canvas = elements.matrixCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  matrixContext = ctx;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const charArray = chars.split("");
  const fontSize = Math.max(16, window.innerWidth / 40);
  const columns = Math.floor(canvas.width / fontSize) || 1;
  const drops = Array(columns).fill(0).map(() => Math.random() * canvas.height);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px 'Courier New', monospace`;
    ctx.textAlign = 'center';

    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      const x = i * fontSize;
      const y = drops[i];
      const gradient = ctx.createLinearGradient(0, y, 0, y + fontSize);
      gradient.addColorStop(0, '#00ff41');
      gradient.addColorStop(0.5, '#00f7ff');
      gradient.addColorStop(1, '#9d4edd');
      ctx.fillStyle = gradient;
      ctx.fillText(char, x + fontSize / 2, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += fontSize * 0.5;
    }
  }

  setInterval(draw, 50);
}

// ==================== PARTICLES (cópia do seu original) ====================
function createInitialParticles() {
  if (!elements.particlesContainer) return;
  elements.particlesContainer.innerHTML = '';
  for (let i = 0; i < 50; i++) createBackgroundParticle();
  setInterval(() => { if (Math.random() > 0.7) createBackgroundParticle(); }, 100);
}

function createBackgroundParticle() {
  if (!elements.particlesContainer) return;
  const particle = document.createElement('div');
  particle.style.position = 'fixed';
  particle.style.width = `${Math.random() * 5 + 2}px`;
  particle.style.height = particle.style.width;
  particle.style.backgroundColor = getRandomNeonColor();
  particle.style.borderRadius = '50%';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = '-10px';
  particle.style.zIndex = '1';
  particle.style.pointerEvents = 'none';
  particle.style.boxShadow = `0 0 20px ${particle.style.backgroundColor}`;
  elements.particlesContainer.appendChild(particle);

  const duration = Math.random() * 4000 + 3000;
  particle.animate([
    { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
    { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
  ], { duration, easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)' });

  setTimeout(() => particle.remove(), duration);
}

// ==================== ÁUDIO ====================
function setupAudio() {
  const audioElements = ['clickSound', 'correctSound', 'wrongSound', 'timeSound', 'winSound'];
  audioElements.forEach(id => {
    const audio = document.getElementById(id);
    if (audio) audio.load();
  });
}

function playSound(soundId) {
  try {
    const audio = document.getElementById(soundId);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => {});
    }
  } catch (e) {}
}

// ==================== LÓGICA DO QUIZ ====================
function startQuiz() {
  // Garantir que MISSIONS tenha 5 selecionadas
  if (!MISSIONS || !Array.isArray(MISSIONS) || MISSIONS.length === 0) {
    MISSIONS = sortearQuestoes(QUESTION_POOL, 5);
  }
  elements.totalMissions.textContent = MISSIONS.length.toString().padStart(2, '0');
  currentMissionIndex = 0;
  score = 0;
  loadMission();
  createWelcomeEffects();
}

function loadMission() {
  canAnswer = true;
  const mission = MISSIONS[currentMissionIndex];
  if (!mission) return showResults();

  elements.questionText.textContent = mission.question;
  elements.currentMission.textContent = (currentMissionIndex + 1).toString().padStart(2, '0');
  elements.scoreValue.textContent = score.toString().padStart(3, '0');
  elements.answersContainer.innerHTML = '';
  elements.answersContainer.scrollTop = 0;

  mission.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.className = 'cyber-option';
    button.innerHTML = `<div class="option-badge">${String.fromCharCode(65 + index)}</div><span>${answer}</span>`;
    button.onclick = () => checkAnswer(index);
    elements.answersContainer.appendChild(button);
  });

  startTimer();
  animateQuestionEntrance();
}

function checkAnswer(selectedIndex) {
  if (!canAnswer) return;
  canAnswer = false;
  clearInterval(timerInterval);

  const mission = MISSIONS[currentMissionIndex];
  const buttons = document.querySelectorAll('.cyber-option');

  buttons.forEach((btn, index) => {
    btn.classList.add('disabled');
    if (index === mission.correct) {
      btn.classList.add('correct');
    } else if (index === selectedIndex) {
      btn.classList.add('incorrect');
    }
  });

  const isCorrect = selectedIndex === mission.correct;

  if (isCorrect) {
    score += 100;
    playSound('correctSound');
    createScoreParticles();
  } else {
    playSound('wrongSound');
  }

  elements.scoreValue.textContent = score.toString().padStart(3, '0');
  
  // ✅ CORREÇÃO: Usar showModal que está definida
  showModal(isCorrect, mission.explanation);
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (!elements.timerValue) return;
  elements.timerValue.textContent = timeLeft;
  if (elements.timerFill) elements.timerFill.style.width = `${(timeLeft / 30) * 100}%`;

  if (timeLeft <= 10) {
    elements.timerValue.style.color = '#ff0055';
    elements.timerValue.style.animation = 'timer-pulse 0.3s infinite alternate';
    if (timeLeft <= 5) {
      playSound('timeSound');
      createWarningEffects();
    }
  } else if (timeLeft <= 20) {
    elements.timerValue.style.color = '#ffd700';
    elements.timerValue.style.animation = 'timer-pulse 0.5s infinite alternate';
  } else {
    elements.timerValue.style.color = '#00ff88';
    elements.timerValue.style.animation = 'timer-pulse 1s infinite alternate';
  }
}

function timeUp() {
  if (!canAnswer) return;
  canAnswer = false;

  const mission = MISSIONS[currentMissionIndex];
  const buttons = document.querySelectorAll('.cyber-option');

  buttons.forEach((btn, index) => {
    btn.classList.add('disabled');
    if (index === mission.correct) btn.classList.add('correct');
  });

  showModal(false, "⏰ Tempo esgotado! " + mission.explanation);
}

// ==================== SHOW RESULTS ====================
function showResults() {
  if (elements.resultsScreen) elements.resultsScreen.style.display = 'flex';
  playSound('winSound');
  const maxScore = MISSIONS.length * 100;
  elements.finalScore.textContent = `${score}/${maxScore}`;

  // Lógica dos prêmios
  let prizeText = "";
  let prizeIcon = "";
  let confettiCount = 0;
  
  if (score === maxScore) { // 500 pontos
    elements.victoryIcon.textContent = '👑'; 
    elements.resultMessage.textContent = "PERFEITO! VOCÊ É UMA LENDA ABSOLUTA! 👑"; 
    prizeText = "🎁 PRÊMIO: BIS + PIRULITO";
    prizeIcon = "🍫🍭";
    confettiCount = 100;
  }
  else if (score >= 300) { // 300+ pontos
    elements.victoryIcon.textContent = '🏆'; 
    elements.resultMessage.textContent = "IMPRESSIONANTE! VOCÊ ARRASOU! 💪"; 
    prizeText = "🎁 PRÊMIO: BIS";
    prizeIcon = "🍫";
    confettiCount = 80;
  }
  else if (score >= 200) { // 200-299 pontos
    elements.victoryIcon.textContent = '🥈'; 
    elements.resultMessage.textContent = "MUITO BOM! VOCÊ TEM POTENCIAL! ⚡"; 
    prizeText = "🎁 PARABÉNS!";
    prizeIcon = "⭐";
    confettiCount = 30;
  }
  else { // Menos de 200 pontos
    elements.victoryIcon.textContent = '🎯'; 
    elements.resultMessage.textContent = "CONTINUE TREINANDO! O FUTURO É SEU! 💡"; 
    prizeText = "🎁 EXPERIÊNCIA";
    prizeIcon = "📚";
    confettiCount = 15;
  }
  
  // Criar confetti se houver
  if (confettiCount > 0) {
    createConfettiBurst(confettiCount);
  }
  
  // Atualizar elemento de prêmio
  if (elements.prizeText) {
    elements.prizeText.innerHTML = `
      <div class="prize-display">
        <div class="prize-icon">${prizeIcon}</div>
        <div class="prize-name">${prizeText}</div>
      </div>
    `;
  }
  
  // Atualizar botão com ícone giratório
  setTimeout(() => {
    const restartBtn = document.querySelector('.restart-btn');
    if (restartBtn) {
      restartBtn.innerHTML = '<i class="fas fa-sync-alt"></i> NOVA MISSÃO';
      
      // Adicionar animação ao ícone
      const icon = restartBtn.querySelector('i');
      if (icon) {
        icon.style.animation = 'spin 1.5s linear infinite';
      }
    }
  }, 100);
}

function restartQuiz() {
  playSound('clickSound');
  score = 0;
  currentMissionIndex = 0;
  MISSIONS = sortearQuestoes(QUESTION_POOL, 5);
  if (elements.resultsScreen) elements.resultsScreen.style.display = 'none';
  if (elements.cyberModal) elements.cyberModal.classList.remove('active');
  createInitialParticles();
  startQuiz();
}

// ==================== EFEITOS VISUAIS / PARTICLES / CONFETTI ====================
function animateQuestionEntrance() {
  if (elements.questionText) {
    elements.questionText.style.animation = 'none';
    setTimeout(() => { elements.questionText.style.animation = 'title-glitch 0.8s ease-out'; }, 10);
  }
}

function createWelcomeEffects() {
  setTimeout(() => {
    createExplosionParticles(30, '#00f7ff', 50, 50);
    playSound('clickSound');
  }, 300);
}

function createExplosionParticles(count, color, x, y) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = `${Math.random() * 12 + 6}px`;
      particle.style.height = particle.style.width;
      particle.style.backgroundColor = color || getRandomNeonColor();
      particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      particle.style.left = `${x || 50}%`;
      particle.style.top = `${y || 50}%`;
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.zIndex = '100';
      particle.style.pointerEvents = 'none';
      particle.style.boxShadow = `0 0 30px ${particle.style.backgroundColor}`;
      document.body.appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 100;
      particle.animate([{ transform: 'translate(-50%, -50%) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`, opacity: 0 }], { duration: 1000, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });

      setTimeout(() => particle.remove(), 1000);
    }, i * 30);
  }
}

function createScoreParticles() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const particle = document.createElement('div');
      particle.style.position = 'fixed';
      particle.style.width = '12px';
      particle.style.height = '12px';
      particle.style.backgroundColor = '#ffd700';
      particle.style.borderRadius = '50%';
      particle.style.left = '90%';
      particle.style.top = '60px';
      particle.style.zIndex = '100';
      particle.style.pointerEvents = 'none';
      particle.style.boxShadow = '0 0 25px gold';
      document.body.appendChild(particle);
      particle.animate([{ transform: 'translate(0, 0) scale(1)', opacity: 1 }, { transform: 'translate(0, -120px) scale(0)', opacity: 0 }], { duration: 800, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
      setTimeout(() => particle.remove(), 800);
    }, i * 100);
  }
}

function createWarningEffects() {
  for (let i = 0; i < 3; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.backgroundColor = '#ff0055';
    particle.style.borderRadius = '50%';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.zIndex = '100';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = '0 0 20px #ff0055';
    document.body.appendChild(particle);
    particle.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }], { duration: 400, easing: 'ease-out' });
    setTimeout(() => particle.remove(), 400);
  }
}

function createConfettiBurst(count) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = `${Math.random() * 15 + 8}px`;
      confetti.style.height = '8px';
      confetti.style.backgroundColor = getRandomNeonColor();
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-20px';
      confetti.style.zIndex = '100';
      confetti.style.pointerEvents = 'none';
      confetti.style.borderRadius = '4px';
      confetti.style.transform = `rotate(${Math.random() * 45}deg)`;
      document.body.appendChild(confetti);
      confetti.animate([{ transform: `translateY(0) rotate(${Math.random() * 45}deg)`, opacity: 1 }, { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }], { duration: Math.random() * 3000 + 1500, easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)' });
      setTimeout(() => confetti.remove(), 4500);
    }, i * 40);
  }
}

// ==================== UTILITÁRIOS ====================
function getRandomNeonColor() {
  const colors = ['#00f7ff', '#ff00ff', '#00ff88', '#ffd700', '#9d4edd', '#00ff41'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== EXPORTA FUNÇÕES GLOBAIS ====================
window.continueGame = continueGame;
window.restartQuiz = restartQuiz;
window.showModal = showModal; // ✅ AGORA ESTÁ DEFINIDA

// ==================== EVENTOS INICIAIS E RESIZE ====================
function updateViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
window.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);
updateViewportHeight();

// prevenir context menu e atalhos devtools (se quiser manter)
window.addEventListener('contextmenu', e => e.preventDefault());
window.addEventListener('keydown', e => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) e.preventDefault();
});

// ==================== START ====================
document.addEventListener('DOMContentLoaded', init);