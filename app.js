const STORAGE_KEY = "smartcard-ai-state-v1";

const defaultState = {
  profile: {
    name: "Alex Kumar",
    role: "Student Founder",
    phone: "+91 98765 43210",
    email: "alex@example.com",
    website: "https://example.com",
    location: "Bhubaneswar, India",
    bio: "I build useful AI tools and smart finance workflows."
  },
  goalAmount: 15000,
  transactions: [
    { id: crypto.randomUUID(), description: "Freelance project", amount: 5000, type: "income", category: "Work", date: today() },
    { id: crypto.randomUUID(), description: "Course subscription", amount: 900, type: "expense", category: "Learning", date: today() },
    { id: crypto.randomUUID(), description: "Food and travel", amount: 1200, type: "expense", category: "Daily", date: today() }
  ],
  cache: {}
};

let state = loadState();

const fields = ["name", "role", "phone", "email", "website", "location", "bio"];
const profileForm = document.querySelector("#profileForm");
const transactionForm = document.querySelector("#transactionForm");
const askAiButton = document.querySelector("#askAi");
const downloadVcardButton = document.querySelector("#downloadVcard");

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(defaultState);
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currency(value) {
  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function buildVCard(profile) {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    `TITLE:${profile.role}`,
    `TEL:${profile.phone}`,
    `EMAIL:${profile.email}`,
    `URL:${profile.website}`,
    `ADR:;;${profile.location}`,
    `NOTE:${profile.bio}`,
    "END:VCARD"
  ].join("\n");
}

function qrUrl(profile) {
  const data = encodeURIComponent(buildVCard(profile));
  return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${data}`;
}

function syncForm() {
  fields.forEach((field) => {
    document.querySelector(`#${field}`).value = state.profile[field] || "";
  });
  document.querySelector("#goalAmount").value = state.goalAmount;
}

function renderProfile() {
  const profile = state.profile;
  document.querySelector("#previewName").textContent = profile.name || "Your Name";
  document.querySelector("#previewRole").textContent = profile.role || "Role or business";
  document.querySelector("#cardName").textContent = profile.name;
  document.querySelector("#cardRole").textContent = profile.role;
  document.querySelector("#cardBio").textContent = profile.bio;
  document.querySelector("#cardPhone").textContent = profile.phone;
  document.querySelector("#cardEmail").textContent = profile.email;
  document.querySelector("#cardWebsite").textContent = profile.website;
  document.querySelector("#cardLocation").textContent = profile.location;
  document.querySelector("#qrImage").src = qrUrl(profile);
}

function totals() {
  return state.transactions.reduce(
    (sum, item) => {
      if (item.type === "income") sum.income += Number(item.amount);
      if (item.type === "expense") sum.expense += Number(item.amount);
      return sum;
    },
    { income: 0, expense: 0 }
  );
}

function renderMoney() {
  const total = totals();
  const savings = total.income - total.expense;
  const progress = Math.max(0, Math.min(100, Math.round((savings / state.goalAmount) * 100)));

  document.querySelector("#incomeStat").textContent = currency(total.income);
  document.querySelector("#expenseStat").textContent = currency(total.expense);
  document.querySelector("#savingStat").textContent = currency(savings);
  document.querySelector("#goalStat").textContent = `${progress}%`;
  document.querySelector("#progressBar").style.width = `${progress}%`;

  const list = document.querySelector("#transactionList");
  list.innerHTML = "";
  state.transactions.slice().reverse().forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        <strong>${escapeHtml(item.description)}</strong><br>
        <small>${escapeHtml(item.category)} - ${item.date}</small>
      </span>
      <strong class="${item.type}">${item.type === "income" ? "+" : "-"}${currency(item.amount)}</strong>
    `;
    list.appendChild(li);
  });

  drawChart(total);
}

function drawChart(total) {
  const canvas = document.querySelector("#moneyChart");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const max = Math.max(total.income, total.expense, state.goalAmount, 1);
  const bars = [
    { label: "Income", value: total.income, color: "#1f7a5c" },
    { label: "Expense", value: total.expense, color: "#c95f4d" },
    { label: "Goal", value: state.goalAmount, color: "#b88419" }
  ];

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdfb";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#607175";
  ctx.font = "18px system-ui";
  ctx.fillText("Monthly overview", 28, 38);

  bars.forEach((bar, index) => {
    const barWidth = 136;
    const x = 70 + index * 210;
    const available = 220;
    const barHeight = Math.max(8, (bar.value / max) * available);
    const y = 292 - barHeight;
    ctx.fillStyle = bar.color;
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.fillStyle = "#172124";
    ctx.font = "16px system-ui";
    ctx.fillText(bar.label, x, 326);
    ctx.fillStyle = "#607175";
    ctx.fillText(currency(bar.value), x, y - 12);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildKnowledgeBase() {
  const total = totals();
  const savings = total.income - total.expense;
  const progress = Math.max(0, Math.min(100, Math.round((savings / state.goalAmount) * 100)));
  const topExpense = state.transactions
    .filter((item) => item.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0];

  return [
    {
      id: "profile",
      title: "Profile",
      text: `${state.profile.name} is a ${state.profile.role}. Contact: ${state.profile.email}, ${state.profile.phone}. Bio: ${state.profile.bio}`
    },
    {
      id: "money-summary",
      title: "Money summary",
      text: `Income is ${currency(total.income)}, expenses are ${currency(total.expense)}, savings are ${currency(savings)}, and monthly goal is ${currency(state.goalAmount)}. Goal progress is ${progress} percent.`
    },
    {
      id: "expense-focus",
      title: "Expense focus",
      text: topExpense
        ? `Largest expense is ${topExpense.description} in ${topExpense.category} for ${currency(topExpense.amount)}.`
        : "No expenses have been added yet."
    },
    {
      id: "accuracy-policy",
      title: "Accuracy policy",
      text: "Answers should use saved profile and transaction data first, calculate totals deterministically, and avoid claiming information that is not present."
    }
  ];
}

function tokenize(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) || [];
}

function retrieve(question) {
  const queryTokens = new Set(tokenize(question));
  return buildKnowledgeBase()
    .map((doc) => {
      const score = tokenize(`${doc.title} ${doc.text}`).reduce((sum, token) => sum + (queryTokens.has(token) ? 1 : 0), 0);
      return { ...doc, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function answerQuestion(question) {
  const cacheKey = question.trim().toLowerCase();
  if (state.cache[cacheKey]) return state.cache[cacheKey];

  const docs = retrieve(question);
  const total = totals();
  const savings = total.income - total.expense;
  const progress = Math.max(0, Math.min(100, Math.round((savings / state.goalAmount) * 100)));
  const lower = question.toLowerCase();

  let answer;
  if (lower.includes("saving") || lower.includes("goal") || lower.includes("progress")) {
    const gap = Math.max(0, state.goalAmount - savings);
    answer = `You have saved ${currency(savings)} against a ${currency(state.goalAmount)} goal, so progress is ${progress}%. To improve this month, reduce the biggest flexible expense first, keep income entries updated, and try to close the remaining ${currency(gap)} gap before adding new discretionary spending.`;
  } else if (lower.includes("qr") || lower.includes("card") || lower.includes("contact")) {
    answer = `Your QR contains your vCard details: name, role, phone, email, website, location, and bio. Update the profile form, then share the generated QR or download the vCard for phones and contact apps.`;
  } else if (lower.includes("expense") || lower.includes("spend")) {
    answer = `Your current expenses are ${currency(total.expense)}. Review the transaction list, compare categories, and cap any non-essential category before adding more purchases.`;
  } else {
    answer = `Based on your saved data, income is ${currency(total.income)}, expenses are ${currency(total.expense)}, savings are ${currency(savings)}, and your business card is ready for QR sharing. Ask about savings, expenses, progress, or card details for a more specific answer.`;
  }

  const result = { answer, docs };
  state.cache[cacheKey] = result;
  saveState();
  return result;
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  fields.forEach((field) => {
    state.profile[field] = document.querySelector(`#${field}`).value.trim();
  });
  state.cache = {};
  saveState();
  renderProfile();
});

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const amount = Number(document.querySelector("#txAmount").value);
  if (!amount || amount < 1) return;

  state.goalAmount = Number(document.querySelector("#goalAmount").value) || state.goalAmount;
  state.transactions.push({
    id: crypto.randomUUID(),
    description: document.querySelector("#txDescription").value.trim() || "Transaction",
    amount,
    type: document.querySelector("#txType").value,
    category: document.querySelector("#txCategory").value.trim() || "General",
    date: today()
  });
  state.cache = {};
  saveState();
  renderMoney();
});

askAiButton.addEventListener("click", () => {
  const question = document.querySelector("#aiQuestion").value;
  const result = answerQuestion(question);
  document.querySelector("#aiAnswer").textContent = result.answer;
  const sources = document.querySelector("#aiSources");
  sources.innerHTML = "";
  result.docs.forEach((doc) => {
    const item = document.createElement("li");
    item.textContent = `${doc.title}: ${doc.text}`;
    sources.appendChild(item);
  });
});

downloadVcardButton.addEventListener("click", () => {
  const blob = new Blob([buildVCard(state.profile)], { type: "text/vcard" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.profile.name.replace(/\s+/g, "-").toLowerCase()}-contact.vcf`;
  link.click();
  URL.revokeObjectURL(url);
});

syncForm();
renderProfile();
renderMoney();
