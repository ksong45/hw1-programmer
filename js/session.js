// Per-session randomization: every new session gets a new employee ID,
// gratuity percentage, and order ticket, so nothing can be memorized across
// attempts. Stored in localStorage so a refresh and the Handbook see the same
// values. A session ends when an order is logged ("Log next order" starts a
// new one) or after 3 hours.

const SESSION_KEY = "lairSession";
const SESSION_MAX_AGE = 3 * 60 * 60 * 1000;

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickDistinct(list, count) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

// VIOLATION #2: 16 random characters, no meaningful chunks.
// Excludes O/0 and I/1 so it's hard to memorize, not ambiguous.
function randomEmployeeId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 16; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function newSession() {
  return {
    id: randomEmployeeId(),
    gratuity: randomItem(GRATUITY_OPTIONS),
    ticket: {
      number: String(1000 + Math.floor(Math.random() * 9000)),
      customer: randomItem(CUSTOMER_NAMES),
      size: randomItem(SIZES).id,
      crust: randomItem(CRUSTS).id,
      toppings: pickDistinct(TOPPINGS, MIN_TOPPINGS).map((t) => t.id),
      sector: randomItem(SECTORS).number,
    },
    start: Date.now(),
    done: false,
  };
}

function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) { /* storage unavailable */ }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* storage unavailable */ }
}

function loadSession() {
  try {
    const saved = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (saved && saved.ticket && !saved.done && Date.now() - saved.start < SESSION_MAX_AGE) return saved;
  } catch (e) { /* fall through to a new session */ }
  const fresh = newSession();
  saveSession(fresh);
  return fresh;
}

const SESSION = loadSession();
const HENCHMAN_ID = SESSION.id;                 // the employee ID
const GRATUITY_RATE = SESSION.gratuity / 100;   // e.g. 0.17
