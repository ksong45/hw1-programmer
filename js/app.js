// Pizzeria Antiusabilious: core app logic.
// Screen-specific features (validation, error codes, etc.) get added below.

const HENCHMAN_ID = "HNCH7Q2X9LAIR04";

// Everything the user chooses lives here so it survives screen changes.
const order = {
  size: null,
  crust: null,
  toppings: [],
  sector: null,
};

function resetOrder() {
  order.size = null;
  order.crust = null;
  order.toppings = [];
  order.sector = null;
}

// Show one screen by its data-screen name, hide the rest.
function showScreen(name) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === name);
  });
  window.scrollTo(0, 0);
}

// Any element with data-go="screenName" navigates there when clicked.
document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-go]");
  if (!trigger) return;
  if (trigger.hasAttribute("data-reset")) resetOrder();
  showScreen(trigger.dataset.go);
});

// DEV SHORTCUT: open index.html?screen=toppings to jump straight to a screen
// while building. Delete this block before submitting.
const devScreen = new URLSearchParams(window.location.search).get("screen");
if (devScreen) showScreen(devScreen);
