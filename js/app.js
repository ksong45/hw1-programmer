// Pizzeria Antiusabilious: app logic.
// Content lives in data.js. This file handles screens, validation and the order.

const SCREENS = ["orientation", "login", "size", "crust", "toppings", "sector", "payment", "confirmation"];
const STEP_SCREENS = ["login", "size", "crust", "toppings", "sector", "payment"]; // counted in progress
const SUMMARY_SCREENS = ["size", "crust", "toppings", "sector", "payment"];      // show order sidebar

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

  $("#size-options").innerHTML = SIZES.map((s) => `
    <label class="option">
      <input type="radio" name="size" value="${s.id}">
      <span>${s.name}</span>
      <span class="muted">${formatCredits(s.price)}</span>
    </label>`).join("");

  $("#crust-select").innerHTML =
    `<option value="">Select a crust</option>` +
    CRUSTS.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");

  $("#topping-options").innerHTML = TOPPINGS.map((t) => `
    <label class="option">
      <input type="checkbox" name="topping" value="${t.id}">
      <span>${t.name}</span>
    </label>`).join("");

  $("#sector-map").innerHTML = SECTORS.map((s) => `
    <button type="button" class="sector-tile" data-sector="${s.number}"
      style="grid-row:${s.row}; grid-column:${s.col}" aria-pressed="false">
      <span class="sector-number">${s.number}</span>
      <span>${s.name}</span>
    </button>`).join("");

  $("#sector-select").innerHTML =
    `<option value="">Select a sector</option>` +
    SECTORS.map((s) => `<option value="${s.number}">Sector ${s.number}: ${s.name}</option>`).join("");
}

// ---------- Order state ----------

function setSector(number) {
  order.sector = number ? Number(number) : null;
  $("#sector-select").value = order.sector ?? "";
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
    ${includeTotal ? `<dt>Total paid</dt><dd>${formatCredits(orderTotal())}</dd>` : ""}`;
}

function renderSummary() {
  $("#summary-list").innerHTML = summaryHTML();
}

// Keep the order in sync as the user changes inputs.
document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.name === "size") order.size = el.value;
  if (el.id === "crust-select") order.crust = el.value || null;
  if (el.name === "topping") {
    order.toppings = $$('input[name="topping"]:checked').map((box) => box.value);
  }
  if (el.id === "sector-select") setSector(el.value);
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
  crust: () => (order.crust ? null : 3),
  toppings: () => (order.toppings.length ? null : 4),
  sector: () => (order.sector ? null : 5),
  payment: () => {
    if (!formulaMatchesCharges()) return 8;
    const loaded = parseNumber($("#payment-amount").value);
    if (Number.isNaN(loaded) || Math.abs(loaded - orderTotal()) > 0.011) return 9;
    if (normalizeId($("#payment-id").value) !== HENCHMAN_ID) return 6;
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

const onEnter = {
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
    $("#order-number").textContent = order.number;
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

  const step = STEP_SCREENS.indexOf(name);
  $("#progress").textContent = step >= 0 ? `Step ${step + 1} of ${STEP_SCREENS.length}` : "";

  $("#summary").hidden = !SUMMARY_SCREENS.includes(name);
  renderSummary();

  if (onEnter[name]) onEnter[name]();
  window.scrollTo(0, 0);
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

// Pressing Enter in a text field acts like the primary button.
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.matches("input[type='text']")) goNext();
});

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

// ---------- Start ----------

buildInputs();

// DEV SHORTCUT: index.html?screen=toppings jumps straight to a screen.
// Delete this block before submitting.
const devScreen = new URLSearchParams(window.location.search).get("screen");
showScreen(Math.max(0, SCREENS.indexOf(devScreen)));
