// Pizzeria Antiusabilious: site content.
// Everything the user sees (options, names, codenames, error text) lives here.
// Edit this file to change content; app.js and the Handbook read from it.

// The employee ID, gratuity, and order ticket are randomized per session
// in js/session.js (HENCHMAN_ID and GRATUITY_RATE are defined there).
const CURRENCY = "Evil Credits";

// Sizes. `rations` is for the reversed "Portion Allocation" slider later.
const SIZES = [
  // Messy prices: harder to carry in memory while scrolling (supports VIOLATION #3).
  { id: "small",  name: "Small",  rations: 3, price: 8.63 },
  { id: "medium", name: "Medium", rations: 2, price: 11.37 },
  { id: "large",  name: "Large",  rations: 1, price: 14.29 },
];

// Crusts. `codename` is what the free-text "Crust Classification" will expect.
const CRUSTS = [
  { id: "thin",    name: "Thin",        codename: "Thin Veneer" },
  { id: "regular", name: "Hand-tossed", codename: "Standard Slab" },
  { id: "deep",    name: "Deep dish",   codename: "Deep Abyss" },
  { id: "stuffed", name: "Stuffed",     codename: "Stuffed Dungeon" },
];

// Every order needs at least this many toppings (more prices to carry to payment).
const MIN_TOPPINGS = 4;

// Mandatory gratuity, shown only as a percentage (supports VIOLATION #3).
// One of these is picked at random each session.
const GRATUITY_OPTIONS = [12, 15, 17, 18, 20, 22];

// Toppings. Each has its own messy price (supports VIOLATION #3).
// Decoys (similar codenames) are marked in comments.
const TOPPINGS = [
  { id: "pepperoni",   name: "Pepperoni",          codename: "Operation Red Disc", price: 1.83 },
  { id: "beet",        name: "Beet slices",        codename: "Operation Red Dish", price: 0.97 },   // decoy
  { id: "radish",      name: "Radish",             codename: "Operation Rad Disc", price: 1.12 },   // decoy
  { id: "salami",      name: "Salami",             codename: "Operation Red Disk", price: 1.91 },   // decoy
  { id: "sausage",     name: "Sausage",            codename: "Operation Pork Tube", price: 2.06 },
  { id: "mushroom",    name: "Mushrooms",          codename: "Operation Fungal Uprising", price: 1.27 },
  { id: "onion",       name: "Onions",             codename: "Operation Tear Gas", price: 0.89 },
  { id: "redonion",    name: "Red onion",          codename: "Operation Purple Tear Gas", price: 1.04 },
  { id: "greenpepper", name: "Green peppers",      codename: "Operation Green Siren", price: 1.18 },
  { id: "bananapep",   name: "Banana peppers",     codename: "Operation Yellow Siren", price: 0.93 },
  { id: "blackolive",  name: "Black olives",       codename: "Operation Dark Orbs", price: 1.36 },
  { id: "greenolive",  name: "Green olives",       codename: "Operation Pale Orbs", price: 1.29 },
  { id: "meatball",    name: "Meatballs",          codename: "Operation Brown Orbs", price: 2.17 },
  { id: "bacon",       name: "Bacon",              codename: "Operation Crispy Strip", price: 2.24 },
  { id: "ham",         name: "Ham",                codename: "Operation Pink Slab", price: 1.73 },
  { id: "prosciutto",  name: "Prosciutto",         codename: "Operation Thin Veil", price: 2.41 },
  { id: "pineapple",   name: "Pineapple",          codename: "Operation Tropical Treason", price: 1.47 },
  { id: "jalapeno",    name: "Jalapeños",          codename: "Operation Green Flame", price: 1.09 },
  { id: "spinach",     name: "Spinach",            codename: "Operation Leaf Pile", price: 1.21 },
  { id: "arugula",     name: "Arugula",            codename: "Operation Bitter Leaf", price: 1.38 },
  { id: "basil",       name: "Basil",              codename: "Operation Sweet Leaf", price: 0.91 },
  { id: "tomato",      name: "Tomatoes",           codename: "Operation Red Sphere", price: 1.14 },
  { id: "sundried",    name: "Sun-dried tomatoes", codename: "Operation Red Raisin", price: 1.62 },
  { id: "extracheese", name: "Extra cheese",       codename: "Operation Molten Blanket", price: 1.96 },
  { id: "feta",        name: "Feta",               codename: "Operation Crumble Protocol", price: 1.53 },
  { id: "ricotta",     name: "Ricotta",            codename: "Operation White Cloud", price: 1.77 },
  { id: "goatcheese",  name: "Goat cheese",        codename: "Operation Tangy Cloud", price: 1.88 },
  { id: "parmesan",    name: "Parmesan",           codename: "Operation White Dust", price: 1.06 },
  { id: "oregano",     name: "Oregano",            codename: "Operation Green Dust", price: 0.87 },
  { id: "anchovy",     name: "Anchovies",          codename: "Operation Salty Swimmer", price: 2.33 },
  { id: "shrimp",      name: "Shrimp",             codename: "Operation Curled Soldier", price: 2.47 },
  { id: "chicken",     name: "Chicken",            codename: "Operation Fowl Play", price: 1.94 },
  { id: "garlic",      name: "Garlic",             codename: "Operation Vampire Repellent", price: 1.02 },
  { id: "artichoke",   name: "Artichoke",          codename: "Operation Armored Bud", price: 1.69 },
  { id: "capers",      name: "Capers",             codename: "Operation Tiny Grenades", price: 1.41 },
  { id: "corn",        name: "Corn",               codename: "Operation Golden Pellets", price: 0.99 },
  { id: "eggplant",    name: "Eggplant",           codename: "Operation Violet Canoe", price: 1.16 },
  { id: "zucchini",    name: "Zucchini",           codename: "Operation Green Canoe", price: 1.23 },
  { id: "broccoli",    name: "Broccoli",           codename: "Operation Tiny Forest", price: 1.31 },
  { id: "hothoney",    name: "Hot honey",          codename: "Operation Liquid Gold", price: 1.58 },
  { id: "chiliflakes", name: "Chili flakes",       codename: "Operation Red Confetti", price: 0.94 },
  { id: "bbq",         name: "BBQ drizzle",        codename: "Operation Brown Rain", price: 1.11 },

  // VIOLATION #8 (choice overload): 42 more toppings, including
  // near-duplicates of pepperoni, for 84 total.
  { id: "turkeypep", name: "Turkey pepperoni", codename: "Operation Pale Disc", price: 1.79 },
  { id: "spicypep", name: "Spicy pepperoni", codename: "Operation Hot Disc", price: 1.88 },
  { id: "cuppep", name: "Cup-and-char pepperoni", codename: "Operation Curled Disc", price: 2.02 },
  { id: "minipep", name: "Mini pepperoni", codename: "Operation Tiny Disc", price: 1.67 },
  { id: "groundbeef", name: "Ground beef", codename: "Operation Crumbled Cow", price: 2.13 },
  { id: "steak", name: "Steak strips", codename: "Operation Seared Ribbon", price: 2.58 },
  { id: "pulledpork", name: "Pulled pork", codename: "Operation Shredded Oink", price: 2.29 },
  { id: "hotdog", name: "Hot dog slices", codename: "Operation Ballpark Coins", price: 1.44 },
  { id: "crab", name: "Crab", codename: "Operation Sideways Walker", price: 2.71 },
  { id: "clams", name: "Clams", codename: "Operation Clamshell Protocol", price: 2.36 },
  { id: "tuna", name: "Tuna", codename: "Operation Canned Ocean", price: 1.97 },
  { id: "salmon", name: "Smoked salmon", codename: "Operation Pink River", price: 2.64 },
  { id: "egg", name: "Egg", codename: "Operation Sunny Dome", price: 1.19 },
  { id: "potato", name: "Potato", codename: "Operation Starch Vault", price: 1.07 },
  { id: "sweetpotato", name: "Sweet potato", codename: "Operation Orange Vault", price: 1.26 },
  { id: "carrot", name: "Carrots", codename: "Operation Orange Stick", price: 0.96 },
  { id: "peas", name: "Peas", codename: "Operation Green Pellets", price: 0.88 },
  { id: "cauliflower", name: "Cauliflower", codename: "Operation Pale Forest", price: 1.33 },
  { id: "brussels", name: "Brussels sprouts", codename: "Operation Tiny Cabbage", price: 1.49 },
  { id: "pumpkin", name: "Pumpkin", codename: "Operation Harvest Moon", price: 1.57 },
  { id: "cherrytomato", name: "Cherry tomatoes", codename: "Operation Red Marbles", price: 1.39 },
  { id: "roastedpepper", name: "Roasted red peppers", codename: "Operation Red Siren", price: 1.46 },
  { id: "poblano", name: "Poblano", codename: "Operation Dark Flame", price: 1.28 },
  { id: "habanero", name: "Habanero", codename: "Operation Orange Flame", price: 1.52 },
  { id: "kimchi", name: "Kimchi", codename: "Operation Fermented Fury", price: 1.84 },
  { id: "sauerkraut", name: "Sauerkraut", codename: "Operation Sour Shred", price: 1.13 },
  { id: "pear", name: "Pear", codename: "Operation Gold Teardrop", price: 1.37 },
  { id: "apple", name: "Apple", codename: "Operation Crisp Orb", price: 1.22 },
  { id: "figs", name: "Figs", codename: "Operation Purple Pouch", price: 1.93 },
  { id: "mango", name: "Mango", codename: "Operation Tropical Mutiny", price: 1.61 },
  { id: "bluecheese", name: "Blue cheese", codename: "Operation Moldy Cloud", price: 1.78 },
  { id: "cheddar", name: "Cheddar", codename: "Operation Orange Blanket", price: 1.34 },
  { id: "provolone", name: "Provolone", codename: "Operation Smoky Blanket", price: 1.42 },
  { id: "gouda", name: "Gouda", codename: "Operation Dutch Blanket", price: 1.59 },
  { id: "vegancheese", name: "Vegan cheese", codename: "Operation Imposter Blanket", price: 1.71 },
  { id: "tofu", name: "Tofu", codename: "Operation White Brick", price: 1.17 },
  { id: "pesto", name: "Pesto drizzle", codename: "Operation Green Rain", price: 1.54 },
  { id: "ranch", name: "Ranch drizzle", codename: "Operation White Rain", price: 1.08 },
  { id: "truffle", name: "Truffle oil", codename: "Operation Earth Tears", price: 2.49 },
  { id: "pickles", name: "Pickles", codename: "Operation Brine Coins", price: 0.92 },
  { id: "walnuts", name: "Walnuts", codename: "Operation Brain Pebbles", price: 1.66 },
  { id: "laseronion", name: "Laser-seared onions", codename: "Operation Burnt Tear Gas", price: 1.31 },
];

// Delivery sectors. row/col place each one on the lair map (3x3 grid).
// For now numbering follows the grid; scramble row/col later for the mapping violation.
const SECTORS = [
  { number: 1, name: "Throne Room",     row: 1, col: 1 },
  { number: 2, name: "Minion Barracks", row: 1, col: 2 },
  { number: 3, name: "Laser Lab",       row: 1, col: 3 },
  { number: 4, name: "Break Room",      row: 2, col: 1 },
  { number: 5, name: "Shark Tank",      row: 2, col: 2 },
  { number: 6, name: "Server Dungeon",  row: 2, col: 3 },
  { number: 7, name: "Evil HR",         row: 3, col: 1 },
  { number: 8, name: "Launch Bay",      row: 3, col: 2 },
  { number: 9, name: "Gift Shop",       row: 3, col: 3 },
];

// VIOLATION #15: this sector is autofilled ("customer's last order").
const PRESELECTED_SECTOR = 7;
// VIOLATION #16: restricted sectors, shown only by a red (vs. green) tint.
const RESTRICTED_SECTORS = [3, 5, 8];

// Random customer names for the order ticket.
const CUSTOMER_NAMES = ["Gary", "Brenda", "Klaus", "Dolores", "Mack", "Priya", "Otto", "Vera", "Stan", "Lulu"];

// Error codes. Messages are clear for now; make them cryptic later.
const ERROR_CODES = {
  1: "That employee ID doesn't match. Check the ID shown on your shift briefing.",
  2: "Choose a size to continue.",
  3: "That crust classification was not recognized.",
  4: "Select at least 4 toppings to continue.",
  5: "Select a delivery sector to continue.",
  6: "The employee ID you entered doesn't match the one you logged in with.",
  7: "REQUISITION MISMATCH.",
  8: "The numbers in the transfer formula don't match your itemized charges and gratuity.",
  9: "Press ENTER on the transfer formula to load the amount before charging.",
  10: "That sector is restricted.",
};


// VIOLATION #12 (Attention 1: multitasking / task switching).
// Dr. A (your boss) interrupts the first time each step is shown. Several messages contain
// numbers and codes that compete with the ID and prices in working memory.
const CHAT_MESSAGES = {
  login: "Morning, new hire. Your locker combo is 4-8-2-1. Don't lose it.",
  size: "Quick poll for the break room: rate today's lighting from 1 to 10. I'll wait.",
  crust: "Shark feeding moved to 11:40, 13:15, and 16:05. Cover it if you're free.",
  toppings: "HR says Form 7Q-22B is overdue. Also, table 12 wants extra napkins.",
  sector: "The Launch Bay is closed until 18:30. The Gift Shop has 20% off capes.",
  payment: "Reminder: your employee ID is NOT your locker combo (4-8-2-1). Stop mixing them up.",
};
