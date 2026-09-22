// FlowBank — Home Screen logic
// Handles balance state, transactions, and all button interactions.

(function () {
  "use strict";

  // ---------- State ----------
  let balance = 4285.5;
  let balanceHidden = false;
  let showingAll = false;

  const transactions = [
    { name: "Netflix", meta: "Entertainment · May 8", amount: -15.99, icon: "netflix" },
    { name: "John Smith", meta: "Money received · May 8", amount: 250.0, icon: "person" },
    { name: "Coffee Shop", meta: "Food & Drink · May 7", amount: -6.45, icon: "coffee" },
    { name: "Direct Deposit", meta: "Paycheck · May 7", amount: 1850.0, icon: "deposit" }
  ];

  const VISIBLE_COUNT = 4;

  // ---------- Elements ----------
  const balanceAmountEl = document.getElementById("balanceAmount");
  const toggleBalanceEl = document.getElementById("toggleBalance");
  const addMoneyBtn = document.getElementById("addMoneyBtn");
  const sendBtn = document.getElementById("sendBtn");
  const seeAllBtn = document.getElementById("seeAllBtn");
  const txListEl = document.getElementById("txList");
  const toastEl = document.getElementById("toast");
  const navItems = document.querySelectorAll(".nav-item");
  const quickActions = document.querySelectorAll(".quick-action");
  const pillBalanceEl = document.getElementById("pillBalance");
  const pillDollarBtn = document.getElementById("pillDollar");
  const pillClockBtn = document.getElementById("pillClock");
  const pillSegments = document.querySelectorAll(".pill-segment");

  // ---------- Icons ----------
  const icons = {
    netflix: { bg: "#141414", svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3v18M18 3v18M6 3l12 18M18 3 6 21" stroke="#e0483f" stroke-width="1.6" stroke-linecap="round"/></svg>' },
    person: { bg: "#3d6bf0", svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#fff" stroke-width="1.8"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>' },
    coffee: { bg: "#7a5a44", svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 9h13a3 3 0 0 1 0 6h-1" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><path d="M4 9v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M6 4c0 1.2 1 1.2 1 2.4S6 7.8 6 9M10 4c0 1.2 1 1.2 1 2.4S10 7.8 10 9" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>' },
    deposit: { bg: "#1fa971", svg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 10 12 4l8 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10v9h14v-9" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19v-5h4v5" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>' },
    send: { bg: "#3d6bf0", svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7Z" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
  };

  // ---------- Helpers ----------
  function formatMoney(value) {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    return sign + "$" + abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatMoneyShort(value) {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 1000) {
      return sign + "$" + (abs / 1000).toFixed(1) + "K";
    }
    return formatMoney(value);
  }

  function updateBalanceDisplay() {
    balanceAmountEl.textContent = formatMoney(balance);
    balanceAmountEl.classList.toggle("hidden", balanceHidden);
    if (pillBalanceEl) {
      pillBalanceEl.textContent = balanceHidden ? "••••" : formatMoneyShort(balance);
      pillBalanceEl.classList.toggle("hidden", false);
    }
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  function renderTransactions() {
    const list = showingAll ? transactions : transactions.slice(0, VISIBLE_COUNT);
    txListEl.innerHTML = list
      .map((tx) => {
        const icon = icons[tx.icon] || icons.send;
        const isPositive = tx.amount >= 0;
        return `
        <div class="tx-item">
          <div class="tx-icon" style="background:${icon.bg};">${icon.svg}</div>
          <div class="tx-info">
            <div class="tx-name">${tx.name}</div>
            <div class="tx-meta">${tx.meta}</div>
          </div>
          <div class="tx-amount ${isPositive ? "amt-pos" : "amt-neg"}">${isPositive ? "+" : ""}${formatMoney(tx.amount)}</div>
        </div>`;
      })
      .join("");
  }

  function addTransaction(tx) {
    transactions.unshift(tx);
    renderTransactions();
  }

  function todayLabel() {
    return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // ---------- Actions ----------
  function handleAddMoney() {
    const input = prompt("How much would you like to add?", "100");
    if (input === null) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    balance += amount;
    updateBalanceDisplay();
    addTransaction({
      name: "Added Money",
      meta: "Top up · " + todayLabel(),
      amount: amount,
      icon: "deposit"
    });
    showToast("Added " + formatMoney(amount));
  }

  function handleSend() {
    const recipient = prompt("Send money to:", "");
    if (recipient === null || recipient.trim() === "") return;
    const input = prompt("How much would you like to send to " + recipient + "?", "20");
    if (input === null) return;
    const amount = parseFloat(input);
    if (isNaN(amount) || amount <= 0) {
      showToast("Enter a valid amount");
      return;
    }
    if (amount > balance) {
      showToast("Insufficient balance");
      return;
    }
    balance -= amount;
    updateBalanceDisplay();
    addTransaction({
      name: recipient.trim(),
      meta: "Money sent · " + todayLabel(),
      amount: -amount,
      icon: "send"
    });
    showToast("Sent " + formatMoney(amount) + " to " + recipient.trim());
  }

  function handleToggleBalance() {
    balanceHidden = !balanceHidden;
    updateBalanceDisplay();
  }

  function handleQuickAction(action) {
    showToast(action + " — coming soon");
  }

  function handleNav(tab) {
    navItems.forEach((item) => item.classList.toggle("active", item.dataset.tab === tab));
    if (tab !== "Home") {
      showToast(tab + " — coming soon");
    }
  }

  function handleSeeAll() {
    showingAll = !showingAll;
    seeAllBtn.textContent = showingAll ? "Show less" : "See all";
    renderTransactions();
  }

  // ---------- Wire up events ----------
  addMoneyBtn.addEventListener("click", handleAddMoney);
  sendBtn.addEventListener("click", handleSend);
  toggleBalanceEl.addEventListener("click", handleToggleBalance);
  seeAllBtn.addEventListener("click", handleSeeAll);

  quickActions.forEach((btn) => {
    btn.addEventListener("click", () => handleQuickAction(btn.dataset.action));
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => handleNav(item.dataset.tab));
  });

  function setActivePillSegment(el) {
    pillSegments.forEach((seg) => seg.classList.toggle("active", seg === el));
  }

  if (pillBalanceEl) {
    pillBalanceEl.addEventListener("click", () => {
      setActivePillSegment(pillBalanceEl);
      handleToggleBalance();
    });
  }
  if (pillDollarBtn) {
    pillDollarBtn.addEventListener("click", () => {
      setActivePillSegment(pillDollarBtn);
      handleQuickAction("Pay");
    });
  }
  if (pillClockBtn) {
    pillClockBtn.addEventListener("click", () => {
      setActivePillSegment(pillClockBtn);
      handleNav("Activity");
      txListEl.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ---------- Init ----------
  updateBalanceDisplay();
  renderTransactions();

  // Optional: register service worker if one is added later (safe no-op if missing)
  if ("serviceWorker" in navigator) {
    // Intentionally left unregistered — add sw.js and uncomment to enable offline support.
    // navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
