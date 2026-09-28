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

function orderTotal() {
  const size = findById(SIZES, order.size);
  if (!size) return 0;
  return size.price + order.toppings.length * TOPPING_PRICE;
}

// ---------- Build inputs from data.js ----------

function buildInputs() {
  $("#orientation-id").textContent = HENCHMAN_ID;

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

function summaryHTML() {
  const size = findById(SIZES, order.size);
  const crust = findById(CRUSTS, order.crust);
  const toppings = order.toppings.map((id) => findById(TOPPINGS, id).name);
  const sector = findSector(order.sector);
  return `
    <dt>Size</dt><dd>${size ? size.name : "—"}</dd>
    <dt>Crust</dt><dd>${crust ? crust.name : "—"}</dd>
    <dt>Toppings</dt><dd>${toppings.length ? toppings.join(", ") : "—"}</dd>
    <dt>Delivery</dt><dd>${sector ? `Sector ${sector.number}: ${sector.name}` : "—"}</dd>
    <dt>Total</dt><dd>${formatCredits(orderTotal())}</dd>`;
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
    $("#payment-total").textContent = formatCredits(orderTotal());
  },
  confirmation: () => {
    $("#order-number").textContent = order.number;
    $("#confirmation-summary").innerHTML = summaryHTML();
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

// ---------- Start ----------

buildInputs();

// DEV SHORTCUT: index.html?screen=toppings jumps straight to a screen.
// Delete this block before submitting.
const devScreen = new URLSearchParams(window.location.search).get("screen");
showScreen(Math.max(0, SCREENS.indexOf(devScreen)));
