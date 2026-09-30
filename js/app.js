// Pizzeria Antiusabilious: app logic.
// Content lives in data.js. This file handles screens, validation and the order.

const SCREENS = ["orientation", "login", "size", "crust", "toppings", "sector", "payment", "confirmation"];
const SUMMARY_SCREENS = ["size", "sector", "payment"];  // show order sidebar (hidden on Toppings: VIOLATION #10)
const AD_RAIL_SCREENS = ["crust"];                                               // VIOLATION #7

let currentIndex = 0;

const order = {
  size: null,     // size id
  crust: null,    // crust id
  toppings: [],   // topping ids
  sector: null,   // sector number
  number: null,   // order number, set when placed
};

// ---------- Helpers ----------

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const screenEl = (name) => $(`[data-screen="${name}"]`);
const findById = (list, id) => list.find((item) => item.id === id);
const findSector = (number) => SECTORS.find((s) => s.number === Number(number));
const normalizeId = (value) => value.trim().toUpperCase();
const formatCredits = (amount) => `${amount.toFixed(2)} ${CURRENCY}`;

function foodSubtotal() {
  const size = findById(SIZES, order.size);
  if (!size) return 0;
  return order.toppings.reduce((sum, id) => sum + findById(TOPPINGS, id).price, size.price);
}

function orderTotal() {
  return foodSubtotal() * (1 + GRATUITY_RATE);
}

// ---------- Build inputs from data.js ----------

function buildInputs() {
  drawUncopyableText($("#orientation-id"), HENCHMAN_ID, { color: "#5a2206" }); // VIOLATION #2

  // VIOLATION #14: the order ticket (shown only on Orientation).
  const t = SESSION.ticket;
  $("#ticket").innerHTML = `
    <p class="ticket-head">🧾 Incoming order · Ticket #${t.number}</p>
    <p class="ticket-customer">Customer: ${t.customer} (henchman)</p>
    <dl class="ticket-lines">
      <dt>Size</dt><dd>${findById(SIZES, t.size).name}</dd>
      <dt>Crust</dt><dd>${findById(CRUSTS, t.crust).name}</dd>
      <dt>Toppings</dt><dd>${t.toppings.map((id) => findById(TOPPINGS, id).name).join(", ")}</dd>
      <dt>Deliver to</dt><dd>${findSector(t.sector).name}</dd>
    </dl>`;

  $("#size-options").innerHTML = SIZES.map((s) => `
    <label class="option">
      <input type="radio" name="size" value="${s.id}">
      <span>${s.name}</span>
      <span class="muted">${formatCredits(s.price)}</span>
    </label>`).join("");


  $("#topping-options").innerHTML = TOPPINGS.map((t) => `
    <label class="option">
      <input type="checkbox" name="topping" value="${t.id}">
      <span>${t.name}</span>
    </label>`).join("");

  $("#sector-map").innerHTML = SECTORS.map((s) => `
    <button type="button" class="sector-tile ${RESTRICTED_SECTORS.includes(s.number) ? "tile-restricted" : "tile-available"}" data-sector="${s.number}"
      style="grid-row:${s.row}; grid-column:${s.col}" aria-pressed="false">
      <span class="sector-number">${s.number}</span>
      <span>${s.name}</span>
    </button>`).join("");
}

// ---------- Order state ----------

function setSector(number) {
  order.sector = number ? Number(number) : null;
  $$(".sector-tile").forEach((tile) => {
    const selected = Number(tile.dataset.sector) === order.sector;
    tile.classList.toggle("selected", selected);
    tile.setAttribute("aria-pressed", selected);
  });
}

// includeTotal is false for the live sidebar (no totals before payment)
// and true for the confirmation screen.
function summaryHTML(includeTotal = false) {
  const size = findById(SIZES, order.size);
  const crust = findById(CRUSTS, order.crust);
  const toppings = order.toppings.map((id) => findById(TOPPINGS, id).name);
  const sector = findSector(order.sector);
  return `
    <dt>Size</dt><dd>${size ? size.name : "—"}</dd>
    <dt>Crust</dt><dd>${crust ? crust.name : "—"}</dd>
    <dt>Toppings</dt><dd>${toppings.length ? toppings.join(", ") : "—"}</dd>
    <dt>Delivery</dt><dd>${sector ? `Sector ${sector.number}: ${sector.name}` : "—"}</dd>
    ${includeTotal ? `<dt>Total charged</dt><dd>${formatCredits(orderTotal())}</dd>` : ""}`;
}

function renderSummary() {
  $("#summary-list").innerHTML = summaryHTML();
}

// Keep the order in sync as the user changes inputs.
document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.name === "size") order.size = el.value;
  if (el.name === "topping") {
    order.toppings = $$('input[name="topping"]:checked').map((box) => box.value);
  }
  renderSummary();
});

document.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-sector]");
  if (!tile) return;
  setSector(tile.dataset.sector);
  renderSummary();
});

// ---------- Validation ----------
// Each returns null if the screen is OK, or an error code from ERROR_CODES.

const validators = {
  login: () => (normalizeId($("#login-id").value) === HENCHMAN_ID ? null : 1),
  size: () => (order.size ? null : 2),
  // VIOLATION #6: the typed text must match a crust classification (case-insensitive).
  crust: () => {
    const typed = $("#crust-input").value.trim().replace(/\s+/g, " ").toLowerCase();
    const match = CRUSTS.find((c) => c.codename.toLowerCase() === typed);
    order.crust = match ? match.id : null;
    return match ? null : 3;
  },
  toppings: () => (order.toppings.length >= MIN_TOPPINGS ? null : 4),
  sector: () => {
    if (!order.sector) return 5;
    return RESTRICTED_SECTORS.includes(order.sector) ? 10 : null;
  },
  payment: () => {
    if (!formulaMatchesCharges()) return 8;
    const loaded = parseNumber($("#payment-amount").value);
    if (Number.isNaN(loaded) || Math.abs(loaded - orderTotal()) > 0.011) return 9;
    if (normalizeId($("#payment-id").value) !== HENCHMAN_ID) return 6;
    // VIOLATION #13 (Thinking: don't make users diagnose system problems):
    // checked LAST, after all the formula work, and the error never says which step is wrong.
    if (!orderMatchesTicket()) return 7;
    if (!order.size || !order.crust || !order.toppings.length || !order.sector) return 7;
    return null;
  },
};

function showError(screenName, code) {
  const box = $("[data-error]", screenEl(screenName));
  if (box) box.textContent = `Error ${code}: ${ERROR_CODES[code]}`;
}

function clearError(screenName) {
  const box = $("[data-error]", screenEl(screenName));
  if (box) box.textContent = "";
}

// ---------- Screen hooks (run when a screen is shown) ----------

// VIOLATION #11: thirds for the first three steps (33, 66, 99), then it creeps.
const PROGRESS_PERCENT = {
  login: 33,
  size: 66,
  crust: 99,
  toppings: 99.2,
  sector: 99.5,
  payment: 99.8,
};

// VIOLATION #9: reshuffle the toppings every time the screen is shown.
// (Checked state stays attached to each item.)
function shuffleToppings() {
  const box = $("#topping-options");
  const items = [...box.children];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  items.forEach((item) => box.appendChild(item));
}

const onEnter = {
  toppings: shuffleToppings,
  payment: () => {
    // Itemized charges (bottom of page). No subtotal, gratuity amount, or total.
    const size = findById(SIZES, order.size);
    const rows = [];
    if (size) rows.push([`${size.name} pizza`, size.price.toFixed(2)]);
    order.toppings.forEach((id) => {
      const t = findById(TOPPINGS, id);
      rows.push([t.name, t.price.toFixed(2)]);
    });
    rows.push([
      "Minion Hazard Gratuity (mandatory)",
      `${Math.round(GRATUITY_RATE * 100)}% of all items above`,
    ]);
    $("#payment-charges").innerHTML =
      `<thead><tr><th>Item</th><th>Evil Credits</th></tr></thead>` +
      `<tbody>${rows.map(([item, price]) =>
        `<tr><td>${item}</td><td>${price}</td></tr>`).join("")}</tbody>`;
    buildFormula();
    $("#charges-panel").open = false;
  },
  confirmation: () => {
    stopTimer();
    $("#order-number").textContent = "#" + SESSION.ticket.number;
    $("#order-customer").textContent = SESSION.ticket.customer;
    $("#confirmation-summary").innerHTML = summaryHTML(true);
  },
};

// ---------- Navigation ----------

function showScreen(index) {
  currentIndex = index;
  const name = SCREENS[index];

  $$(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });

  // VIOLATION #11: percentage only (no step count), fixed misleading values.
  const percent = name === "confirmation" ? 100 : PROGRESS_PERCENT[name];
  $("#progress-wrap").hidden = percent === undefined;
  if (percent !== undefined) {
    $("#progress").textContent = `${percent}% complete`;
    $("#progress-fill").style.width = percent + "%";
  }

  $("#summary").hidden = !SUMMARY_SCREENS.includes(name);
  $("#ad-rail").hidden = !AD_RAIL_SCREENS.includes(name);
  renderSummary();

  if (onEnter[name]) onEnter[name]();
  openChat(name); // VIOLATION #12
  window.scrollTo(0, 0);
}

// ---------- Dr. A's chat (VIOLATION #12) ----------
// Opens the first time each step is shown; must be closed (✕ or Esc) to continue.
const chatSeen = new Set();

function openChat(screenName) {
  const message = CHAT_MESSAGES[screenName];
  if (!message || chatSeen.has(screenName)) return;
  chatSeen.add(screenName);
  $("#chat-message").textContent = message;
  $("#chat-overlay").hidden = false;
  $("#chat-close").focus();
}

function closeChat() {
  $("#chat-overlay").hidden = true;
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#chat-close")) closeChat();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !$("#chat-overlay").hidden) closeChat();
});

// VIOLATION #13: does the entered order match the ticket exactly?
function orderMatchesTicket() {
  const t = SESSION.ticket;
  return order.size === t.size &&
    order.crust === t.crust &&
    order.sector === t.sector &&
    order.toppings.length === t.toppings.length &&
    t.toppings.every((id) => order.toppings.includes(id));
}

function placeOrder() {
  order.number = "LC-" + Math.floor(1000 + Math.random() * 9000);
}

function goNext() {
  const name = SCREENS[currentIndex];
  const validate = validators[name];
  const errorCode = validate ? validate() : null;
  if (errorCode) {
    showError(name, errorCode);
    return;
  }
  clearError(name);
  if (name === "payment") placeOrder();
  showScreen(currentIndex + 1);
}

function goBack() {
  if (currentIndex > 0) showScreen(currentIndex - 1);
}

function restart() {
  clearSession();
  window.location.href = window.location.pathname;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "next") goNext();
  if (action === "back") goBack();
  if (action === "restart") restart();
});

// Note: pressing Enter in a field intentionally does NOT advance the page.
// Users must click the forward button. (Enter in the payment formula still
// loads the amount; see the Evil Transfer Formula section.)

// VIOLATION #2: block pasting into the ID fields so the ID must be recalled.
["#login-id", "#payment-id"].forEach((selector) => {
  ["paste", "drop"].forEach((type) => {
    $(selector).addEventListener(type, (event) => event.preventDefault());
  });
});

// ---------- Evil Transfer Formula (payment screen) ----------
// One blank box per charge, plus a gratuity-percentage box. ENTER computes the
// result and loads it into the read-only amount field (supports VIOLATION #3).

const parseNumber = (value) => parseFloat(String(value).replace(/[^0-9.]/g, ""));

function expectedCharges() {
  const size = findById(SIZES, order.size);
  const prices = size ? [size.price] : [];
  order.toppings.forEach((id) => prices.push(findById(TOPPINGS, id).price));
  return prices;
}

function buildFormula() {
  const count = expectedCharges().length;
  const boxes = Array.from({ length: count }, (_, i) =>
    `<input class="formula-box" data-item type="text" inputmode="decimal"
      autocomplete="off" aria-label="Charge ${i + 1}">`).join('<span class="formula-op">+</span>');
  $("#formula-row").innerHTML =
    `<span class="formula-op">(</span>${boxes}<span class="formula-op">)</span>` +
    `<span class="formula-op">× ( 1 +</span>` +
    `<input class="formula-box" id="formula-gratuity" type="text" inputmode="decimal"
      autocomplete="off" aria-label="Gratuity percent">` +
    `<span class="formula-op">÷ 100 )</span>`;
  $("#payment-amount").value = "";
}

function formulaValues() {
  return {
    items: $$("[data-item]").map((box) => parseNumber(box.value)),
    gratuity: parseNumber($("#formula-gratuity").value),
  };
}

function loadFormula() {
  const { items, gratuity } = formulaValues();
  if (items.some(Number.isNaN) || Number.isNaN(gratuity)) {
    $("#payment-amount").value = "";
    return;
  }
  const result = items.reduce((a, b) => a + b, 0) * (1 + gratuity / 100);
  $("#payment-amount").value = result.toFixed(2);
}

// The formula passes only if the boxes hold exactly the listed prices (any order)
// and the gratuity is the listed percentage.
function formulaMatchesCharges() {
  const { items, gratuity } = formulaValues();
  const expected = expectedCharges().slice().sort((a, b) => a - b);
  const typed = items.slice().sort((a, b) => a - b);
  const itemsOk = typed.length === expected.length &&
    typed.every((value, i) => Math.abs(value - expected[i]) < 0.005);
  return itemsOk && Math.abs(gratuity - GRATUITY_RATE * 100) < 0.005;
}

document.addEventListener("click", (event) => {
  if (event.target.closest("#formula-load")) loadFormula();
});

// Enter inside a formula box runs the formula (instead of submitting the page).
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches(".formula-box")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    loadFormula();
  }
}, true);

// No pasting into formula boxes: prices must be carried in memory (VIOLATION #3).
document.addEventListener("paste", (event) => {
  if (event.target.matches(".formula-box")) event.preventDefault();
});
document.addEventListener("drop", (event) => {
  if (event.target.matches(".formula-box")) event.preventDefault();
});

// Auto-collapsing charges (supports VIOLATION #3): the itemized list closes
// itself whenever it scrolls out of view, so every trip back down to read a
// price means opening it again.
const chargesPanel = $("#charges-panel");
new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting && chargesPanel.open) chargesPanel.open = false;
  });
}).observe(chargesPanel);

// ---------- Task timer (instructor request; not a violation) ----------
// Starts when the session starts (site first opened) and keeps running through
// refreshes. Stops on the confirmation screen, which shows the final time.
// "Log next order" starts a new session and a new timer.

const timerStart = SESSION.start;

function formatClock(ms) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = String(total % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatLong(ms) {
  const total = Math.floor(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return minutes ? `${minutes} min ${seconds} s` : `${seconds} s`;
}

function renderTimer() {
  $("#task-timer").textContent = "⏱ " + formatClock(Date.now() - timerStart);
}

const timerInterval = setInterval(renderTimer, 1000);
renderTimer();

function stopTimer() {
  clearInterval(timerInterval);
  const elapsed = Date.now() - timerStart;
  $("#task-timer").textContent = "⏱ " + formatClock(elapsed) + " · finished";
  $("#final-time").textContent = `⏱ Your time: ${formatLong(elapsed)}`;
  SESSION.done = true;
  saveSession(SESSION);
}

// ---------- Start ----------

buildInputs();
setSector(PRESELECTED_SECTOR); // VIOLATION #15: autofilled from the "last order"

// DEV SHORTCUT: index.html?screen=toppings jumps straight to a screen.
// Delete this block before submitting.
const devScreen = new URLSearchParams(window.location.search).get("screen");
showScreen(Math.max(0, SCREENS.indexOf(devScreen)));
