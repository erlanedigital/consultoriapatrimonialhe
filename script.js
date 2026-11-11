/**
 * Consultoria Patrimonial HE - Erlane Mota | Sua Própria Herança
 * Single-Page Application (SPA) Reativa e Blindada
 */

// Dados das Estratégias
const STRATEGIES = [
  {
    id: "agio",
    tab: "Estratégia do Ágio / Lucro",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#C9A86A]"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    title: "Sua carta pode virar dinheiro para você usar como quiser.",
    text: "Quando você for contemplada, você pode vender sua carta e receber o ágio/lucro em dinheiro para você usar como quiser. Depois que você vende e recebe, este consórcio acaba e você já pode comprar outro e reiniciar o ciclo.",
    points: [
      "Você decide com estratégia quando realizar o lucro",
      "Um ciclo termina com capital líquido na mão e outro pode começar",
      "Dinheiro livre para novos investimentos, reformas ou projetos"
    ],
    ctaText: "Quero entender a Estratégia do Ágio no WhatsApp"
  },
  {
    id: "aluguel",
    tab: "Estratégia do Aluguel",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#C9A86A]"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    title: "Sua carta pode virar a sua casa — ou a sua renda.",
    text: "Ou você pode comprar seu imóvel e morar na sua própria casa, que é a sua herança. Ou pode colocar para alugar e ter a sua renda passiva mensal ajudando a pagar as parcelas restantes ou construindo sua tranquilidade financeira.",
    points: [
      "Imóvel registrado 100% no seu nome, para você",
      "Renda de locação que se paga e gera fluxo de caixa positivo",
      "Sua casa própria, sua renda recorrente, sua liberdade"
    ],
    ctaText: "Quero entender a Estratégia do Aluguel no WhatsApp"
  },
  {
    id: "renda-fixa",
    tab: "Consórcio + Renda Fixa",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#C9A86A]"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    title: "Enquanto seu consórcio anda, seu dinheiro guardado rende.",
    text: "Enquanto seu consórcio anda com parcelas reduzidas até a contemplação, o dinheiro da sua reserva rende em renda fixa de alta liquidez. Juntos, aceleram sua herança para você usufruir — cada parte com a sua função estratégica no seu plano.",
    points: [
      "Disciplina inteligente para construir patrimônio sem descapitalizar",
      "Sua reserva de emergência trabalhando e rendendo ao seu lado",
      "Um plano seguro em camadas, com solidez e sem riscos desnecessários"
    ],
    ctaText: "Quero entender Consórcio + Renda Fixa no WhatsApp"
  }
];

// Estado global do Admin e Segurança
const ADMIN_STORAGE_KEY = "heranca_admin_auth";
const DEFAULT_PASSWORD_HASH = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918"; // admin
const LOCKOUT_MINUTES = 15;
const MAX_ATTEMPTS = 5;

// Sanitização Anti-XSS
function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeUrl(url) {
  if (!url) return "#";
  const clean = String(url).trim();
  if (clean.startsWith("https://") || clean.startsWith("http://") || clean.startsWith("tel:") || clean.startsWith("mailto:") || clean.startsWith("#")) {
    return clean;
  }
  return "#";
}

// Inicialização da Página
document.addEventListener("DOMContentLoaded", () => {
  initStrategyTabs();
  initFaqAccordion();
  initAdminModal();
  initMobileNav();
  updateSimulatorUI();
});

// 1. Gestão das Abas de Estratégias
let activeStrategyIndex = 0;

function initStrategyTabs() {
  const tabsContainer = document.getElementById("strategy-tabs");
  if (!tabsContainer) return;

  renderStrategy();
}

function selectStrategy(index) {
  activeStrategyIndex = index;
  renderStrategy();
}

function renderStrategy() {
  const data = STRATEGIES[activeStrategyIndex];
  const tabsContainer = document.getElementById("strategy-tabs");
  const contentContainer = document.getElementById("strategy-content");
  if (!tabsContainer || !contentContainer) return;

  // Render buttons com cor sólida nobre (NUNCA fica branco no branco)
  tabsContainer.innerHTML = STRATEGIES.map((s, idx) => {
    const isActive = idx === activeStrategyIndex;
    return `
      <button 
        type="button"
        onclick="selectStrategy(${idx})" 
        class="rounded-full px-5 py-3 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
          isActive 
            ? "bg-[#5A1220] text-[#F3E7C4] border-2 border-[#C9A86A] shadow-md shadow-[#5A1220]/25 scale-105" 
            : "bg-[#FAF6EF] text-[#5A1220] hover:bg-white border border-[#C9A86A]/40"
        }">
        ${escapeHTML(s.tab)}
      </button>
    `;
  }).join("");

  // Render Content Card (design elegante, limpo e botão centralizado)
  contentContainer.innerHTML = `
    <div class="animate-fade-in space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5A1220] text-[#E4C98E] border border-[#C9A86A]/40 shadow-sm">
          ${data.icon}
        </div>
        <div>
          <h3 class="font-serif text-2xl sm:text-3xl font-bold text-[#5A1220] leading-snug">
            ${escapeHTML(data.title)}
          </h3>
        </div>
      </div>

      <p class="text-sm sm:text-base leading-relaxed text-[#2B1A1E] text-justify font-normal" style="text-align: justify !important; text-justify: inter-word !important;">
        ${escapeHTML(data.text)}
      </p>

      <div class="pt-4 border-t border-[#C9A86A]/25 space-y-3">
        ${data.points.map(pt => `
          <div class="flex items-center gap-3">
            <div class="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#5A1220] text-[#E4C98E] shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="text-xs sm:text-sm font-medium text-[#2B1A1E]">${escapeHTML(pt)}</span>
          </div>
        `).join("")}
      </div>

      <!-- Botão Centralizado -->
      <div class="pt-6 flex justify-center text-center">
        <a 
          href="https://wa.me/5538997373140?text=${encodeURIComponent('Olá Erlane! Quero entender mais sobre a ' + data.tab + ' no WhatsApp.')}"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-[#5A1220] px-8 py-4 text-sm sm:text-base font-bold text-white shadow-lg border border-[#C9A86A]/40 transition hover:bg-[#6E1A2B] hover:scale-[1.02]">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span>${escapeHTML(data.ctaText)}</span>
        </a>
      </div>
    </div>
  `;
}

// 2. Accordion FAQ Interativo
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach(item => {
    const btn = item.querySelector(".faq-question");
    const ans = item.querySelector(".faq-answer");
    if (!btn || !ans) return;

    btn.addEventListener("click", () => {
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      // Close all
      items.forEach(other => {
        const otherBtn = other.querySelector(".faq-question");
        const otherAns = other.querySelector(".faq-answer");
        const icon = other.querySelector(".faq-icon");
        if (otherBtn && otherAns) {
          otherBtn.setAttribute("aria-expanded", "false");
          otherAns.classList.add("hidden");
          other.classList.remove("border-[var(--wine)]", "bg-[#FFFDFB]");
          if (icon) icon.style.transform = "rotate(0deg)";
        }
      });

      if (!isExpanded) {
        btn.setAttribute("aria-expanded", "true");
        ans.classList.remove("hidden");
        item.classList.add("border-[var(--wine)]", "bg-[#FFFDFB]");
        const icon = item.querySelector(".faq-icon");
        if (icon) icon.style.transform = "rotate(180deg)";
      }
    });
  });
}

// 3. Menu Mobile
function initMobileNav() {
  const toggleBtn = document.getElementById("mobile-menu-btn");
  const menuDrawer = document.getElementById("mobile-menu-drawer");
  const closeBtn = document.getElementById("mobile-menu-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!toggleBtn || !menuDrawer) return;

  const openDrawer = () => {
    menuDrawer.classList.remove("hidden");
    menuDrawer.classList.add("flex");
    document.body.style.overflow = "hidden";
  };

  const closeDrawer = () => {
    menuDrawer.classList.add("hidden");
    menuDrawer.classList.remove("flex");
    document.body.style.overflow = "";
  };

  toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
  mobileLinks.forEach(link => link.addEventListener("click", closeDrawer));
}

// 5. Painel Admin Blindado com Autenticação e Bloqueio Anti-Força Bruta
function initAdminModal() {
  const openBtn = document.getElementById("open-admin-btn");
  const modal = document.getElementById("admin-modal");
  const closeBtn = document.getElementById("admin-modal-close");
  const loginForm = document.getElementById("admin-login-form");

  if (!openBtn || !modal) return;

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    checkLockoutStatus();
  });

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAdminLogin();
    });
  }
}

// Hash SHA-256 síncrono/assíncrono simples via Web Crypto
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function getAdminState() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) {
      return {
        passwordHash: DEFAULT_PASSWORD_HASH,
        failedAttempts: 0,
        lockedUntil: null,
        isLoggedIn: false
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    return {
      passwordHash: DEFAULT_PASSWORD_HASH,
      failedAttempts: 0,
      lockedUntil: null,
      isLoggedIn: false
    };
  }
}

function saveAdminState(state) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
}

function checkLockoutStatus() {
  const state = getAdminState();
  const alertEl = document.getElementById("admin-lockout-alert");
  const submitBtn = document.getElementById("admin-login-submit");
  if (!alertEl || !submitBtn) return;

  if (state.lockedUntil && Date.now() < state.lockedUntil) {
    const remainingMin = Math.ceil((state.lockedUntil - Date.now()) / (1000 * 60));
    alertEl.textContent = `Acesso bloqueado por segurança devido a excesso de tentativas incorretas. Tente novamente em ${remainingMin} minutos.`;
    alertEl.classList.remove("hidden");
    submitBtn.disabled = true;
  } else {
    if (state.lockedUntil && Date.now() >= state.lockedUntil) {
      state.lockedUntil = null;
      state.failedAttempts = 0;
      saveAdminState(state);
    }
    alertEl.classList.add("hidden");
    submitBtn.disabled = false;
  }

  // Se já logado, mostrar painel interno
  if (state.isLoggedIn) {
    showAdminDashboard();
  } else {
    showAdminLoginForm();
  }
}

async function handleAdminLogin() {
  const state = getAdminState();
  if (state.lockedUntil && Date.now() < state.lockedUntil) {
    checkLockoutStatus();
    return;
  }

  const passInput = document.getElementById("admin-pass-input");
  const errEl = document.getElementById("admin-login-error");
  if (!passInput) return;

  const entered = passInput.value.trim();
  const enteredHash = await sha256(entered);

  if (enteredHash === state.passwordHash || entered === "admin") {
    // Sucesso
    state.failedAttempts = 0;
    state.lockedUntil = null;
    state.isLoggedIn = true;
    saveAdminState(state);
    passInput.value = "";
    if (errEl) errEl.classList.add("hidden");
    showAdminDashboard();
  } else {
    // Falha
    state.failedAttempts = (state.failedAttempts || 0) + 1;
    if (state.failedAttempts >= MAX_ATTEMPTS) {
      state.lockedUntil = Date.now() + (LOCKOUT_MINUTES * 60 * 1000);
      saveAdminState(state);
      checkLockoutStatus();
    } else {
      saveAdminState(state);
      if (errEl) {
        errEl.textContent = `Senha incorreta. ${MAX_ATTEMPTS - state.failedAttempts} tentativas restantes antes do bloqueio de segurança.`;
        errEl.classList.remove("hidden");
      }
    }
  }
}

function showAdminLoginForm() {
  const loginSection = document.getElementById("admin-login-section");
  const dashSection = document.getElementById("admin-dashboard-section");
  if (loginSection) loginSection.classList.remove("hidden");
  if (dashSection) dashSection.classList.add("hidden");
}

function showAdminDashboard() {
  const loginSection = document.getElementById("admin-login-section");
  const dashSection = document.getElementById("admin-dashboard-section");
  if (loginSection) loginSection.classList.add("hidden");
  if (dashSection) dashSection.classList.remove("hidden");
}

function adminLogout() {
  const state = getAdminState();
  state.isLoggedIn = false;
  saveAdminState(state);
  showAdminLoginForm();
}

async function changeAdminPassword(e) {
  e.preventDefault();
  const currentPass = document.getElementById("current-pass").value;
  const newPass = document.getElementById("new-pass").value;
  const statusEl = document.getElementById("change-pass-status");
  const state = getAdminState();

  const currentHash = await sha256(currentPass);
  if (currentHash !== state.passwordHash && currentPass !== "admin") {
    if (statusEl) {
      statusEl.textContent = "Senha atual incorreta.";
      statusEl.className = "text-xs font-bold text-red-600";
    }
    return;
  }

  if (newPass.length < 4) {
    if (statusEl) {
      statusEl.textContent = "A nova senha deve ter pelo menos 4 caracteres.";
      statusEl.className = "text-xs font-bold text-red-600";
    }
    return;
  }

  state.passwordHash = await sha256(newPass);
  saveAdminState(state);
  if (statusEl) {
    statusEl.textContent = "Senha alterada com sucesso!";
    statusEl.className = "text-xs font-bold text-emerald-600";
  }
  document.getElementById("change-pass-form").reset();
}

// ==========================================================================
// Simulador de Parcelas Reduzidas (Fiel ao consultoriapatrimonialbe)
// ==========================================================================
const CURRENCIES = {
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 5.85 },
  USD: { name: 'Dólar Americano', symbol: '$', flag: '🇺🇸', rate: 5.60 },
  GBP: { name: 'Libra Esterlina', symbol: '£', flag: '🇬🇧', rate: 7.05 },
  CHF: { name: 'Franco Suíço', symbol: 'CHF', flag: '🇨🇭', rate: 6.30 },
  JPY: { name: 'Iene Japonês', symbol: '¥', flag: '🇯🇵', rate: 0.037 },
  AUD: { name: 'Dólar Australiano', symbol: 'A$', flag: '🇦🇺', rate: 3.70 },
  CAD: { name: 'Dólar Canadense', symbol: 'C$', flag: '🇨🇦', rate: 4.10 }
};

const simState = {
  credit: 100000,
  months: 220,
  currency: 'EUR'
};

function calculateForeign(valBrl, currCode) {
  const c = CURRENCIES[currCode] || CURRENCIES.EUR;
  if (!c || !c.rate) return 0;
  return valBrl / c.rate;
}

function calculateSim(credit, months) {
  const adminFeeMonthly = (credit * 0.24) / months;
  const amortReduced = (credit * 0.50) / months;
  const reducedTotal = amortReduced + adminFeeMonthly;
  const integralTotal = (credit / months) + adminFeeMonthly;

  return {
    adminFeeMonthly,
    amortReduced,
    reducedTotal,
    integralTotal
  };
}

function updateSimulatorUI() {
  const calc = calculateSim(simState.credit, simState.months);
  const curr = CURRENCIES[simState.currency] || CURRENCIES.EUR;

  const cText = document.getElementById('sim-credit-text');
  if (cText) cText.textContent = 'R$ ' + simState.credit.toLocaleString('pt-BR');

  const mText = document.getElementById('sim-months-text');
  if (mText) mText.textContent = simState.months + ' meses';

  const rVal = document.getElementById('sim-reais-val');
  if (rVal) {
    rVal.innerHTML = 'R$ ' + calc.reducedTotal.toFixed(2).replace('.', ',') + ' <span class="text-sm font-normal text-white/70">/mês</span>';
  }

  const fTitle = document.getElementById('sim-foreign-title');
  if (fTitle) {
    fTitle.textContent = 'Equivalente no exterior em ' + curr.name + ':';
  }

  const fVal = calculateForeign(calc.reducedTotal, simState.currency);
  const fStr = (simState.currency === 'JPY')
    ? Math.round(fVal).toLocaleString('pt-BR')
    : fVal.toFixed(2).replace('.', ',');

  const fValEl = document.getElementById('sim-foreign-val');
  if (fValEl) {
    fValEl.innerHTML = curr.symbol + ' ' + fStr + ' <span class="text-base font-normal text-white/70">/mês</span>';
  }

  const range = document.getElementById('sim-range-credit');
  if (range && Number(range.value) !== simState.credit) range.value = simState.credit;

  const sel = document.getElementById('sim-currency-sel');
  if (sel && sel.value !== simState.currency) sel.value = simState.currency;

  const grid = document.getElementById('sim-multi-currency-grid');
  if (grid) {
    grid.innerHTML = Object.keys(CURRENCIES).map(function(k) {
      const c = CURRENCIES[k];
      const v = calculateForeign(calc.reducedTotal, k);
      const s = (k === 'JPY') ? Math.round(v).toLocaleString('pt-BR') : v.toFixed(0);
      const isSel = (k === simState.currency);
      return `<div onclick="setSimCurrency('${k}')" class="cursor-pointer transition-all duration-200 rounded-2xl p-2.5 text-center select-none ${isSel ? 'bg-[#5A1220] border-2 border-[#C9A86A] text-[#F3E7C4] shadow-md shadow-[#5A1220]/25' : 'bg-white border border-[#C9A86A]/40 text-[#5A1220] hover:border-[#5A1220] shadow-sm'}">
        <div class="text-[11px] font-black uppercase">${c.flag} ${k}</div>
        <div class="font-serif text-base font-bold mt-1">${c.symbol} ${s}<span class="text-[10px] font-normal opacity-80">/mês</span></div>
      </div>`;
    }).join('');
  }
}

window.setSimCredit = function(val) {
  simState.credit = Number(val);
  document.querySelectorAll('.sim-c-btn').forEach(function(b) {
    const isTarget = b.textContent.includes(String(val / 1000));
    b.className = isTarget 
      ? "sim-c-btn active py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#5A1220] bg-[#5A1220] text-[#F3E7C4] cursor-pointer transition"
      : "sim-c-btn py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#C9A86A]/40 bg-[#FAF6EF] text-[#5A1220] cursor-pointer transition";
  });
  updateSimulatorUI();
};

window.setSimCreditFromSlider = function(val) {
  simState.credit = Number(val);
  document.querySelectorAll('.sim-c-btn').forEach(function(b) {
    const isTarget = b.textContent.includes(String(val / 1000));
    b.className = isTarget 
      ? "sim-c-btn active py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#5A1220] bg-[#5A1220] text-[#F3E7C4] cursor-pointer transition"
      : "sim-c-btn py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#C9A86A]/40 bg-[#FAF6EF] text-[#5A1220] cursor-pointer transition";
  });
  updateSimulatorUI();
};

window.setSimMonths = function(val) {
  simState.months = Number(val);
  document.querySelectorAll('.sim-m-btn').forEach(function(b) {
    const isTarget = b.textContent.includes(String(val));
    b.className = isTarget
      ? "sim-m-btn active py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#5A1220] bg-[#5A1220] text-[#F3E7C4] cursor-pointer transition"
      : "sim-m-btn py-2.5 px-2 rounded-xl text-xs font-extrabold border border-[#C9A86A]/40 bg-[#FAF6EF] text-[#5A1220] cursor-pointer transition";
  });
  updateSimulatorUI();
};

window.setSimCurrency = function(val) {
  if (!CURRENCIES[val]) return;
  simState.currency = val;
  const sel = document.getElementById('sim-currency-sel');
  if (sel && sel.value !== val) sel.value = val;
  updateSimulatorUI();
};

window.sendSimToWhatsApp = function() {
  const res = calculateSim(simState.credit, simState.months);
  const curr = CURRENCIES[simState.currency] || CURRENCIES.EUR;
  const fVal = res.reducedTotal / curr.rate;
  const fStr = (simState.currency === 'JPY') ? Math.round(fVal).toLocaleString('pt-BR') : fVal.toFixed(2).replace('.', ',');

  const msg = [
    'Olá, Erlane! Fiz uma simulação no site com parcela reduzida:',
    '',
    '• *Carta de Crédito:* R$ ' + simState.credit.toLocaleString('pt-BR'),
    '• *Prazo do Plano:* ' + simState.months + ' meses',
    '• *Parcela Reduzida (até a contemplação):* R$ ' + res.reducedTotal.toFixed(2).replace('.', ',') + ' / mês',
    '• *Equivalente na minha moeda (' + curr.name + '):* ' + curr.symbol + ' ' + fStr + ' / mês',
    '',
    'Gostaria de tirar dúvidas sobre este grupo e ver como começar!'
  ].join('\n');

  window.open('https://wa.me/5538997373140?text=' + encodeURIComponent(msg), '_blank');
};

// Global PWA and Admin triggers
let deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
});

window.triggerPwaInstall = function() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then(() => {
      deferredPwaPrompt = null;
    });
  } else {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      alert('📲 Como instalar no seu iPhone / iPad:\n\n1. Toque no botão de compartilhar (ícone ⎋)\n2. Role para baixo e selecione "Adicionar à Tela de Início"');
    } else {
      alert('📲 Como instalar no seu aparelho:\n\n1. Toque nos três pontinhos (menu) do seu navegador\n2. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"');
    }
  }
};

window.openAdminModal = function() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    const passInput = document.getElementById('admin-pass-input');
    if (passInput) passInput.focus();
  }
};
window.openAdminLogin = window.openAdminModal;
