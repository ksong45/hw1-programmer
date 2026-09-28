// Pizzeria Antiusabilious: site content.
// Everything the user sees (options, names, codenames, error text) lives here.
// Edit this file to change content; app.js and the Handbook read from it.

// VIOLATION #2: 16 random characters with no meaningful chunks.
// (Avoids O/0 and I/1 so it's hard to memorize, not ambiguous.)
const HENCHMAN_ID = "K7QX2M9WZ4TR8BVJ";
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

// Mandatory gratuity, shown only as a percentage (supports VIOLATION #3).
const GRATUITY_RATE = 0.18;

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

// Error codes. Messages are clear for now; make them cryptic later.
const ERROR_CODES = {
  1: "That Henchman ID doesn't match. Check the ID shown on the welcome screen.",
  2: "Choose a size to continue.",
  3: "Choose a crust to continue.",
  4: "Choose at least one topping to continue.",
  5: "Choose a delivery sector to continue.",
  6: "The Henchman ID you entered doesn't match the one you logged in with.",
  7: "Your order is missing a size, crust, topping, or delivery sector.",
  8: "The numbers in the transfer formula don't match your itemized charges and gratuity.",
  9: "Press ENTER on the transfer formula to load your amount before paying.",
};
