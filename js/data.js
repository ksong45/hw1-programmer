// Pizzeria Antiusabilious: site content.
// Everything the user sees (options, names, codenames, error text) lives here.
// Edit this file to change content; app.js and the Handbook read from it.

const HENCHMAN_ID = "HNCH7Q2X9LAIR04";
const CURRENCY = "Evil Credits";

// Sizes. `rations` is for the reversed "Portion Allocation" slider later.
const SIZES = [
  { id: "small",  name: "Small",  rations: 3, price: 8 },
  { id: "medium", name: "Medium", rations: 2, price: 11 },
  { id: "large",  name: "Large",  rations: 1, price: 14 },
];

// Crusts. `codename` is what the free-text "Crust Classification" will expect.
const CRUSTS = [
  { id: "thin",    name: "Thin",        codename: "Thin Veneer" },
  { id: "regular", name: "Hand-tossed", codename: "Standard Slab" },
  { id: "deep",    name: "Deep dish",   codename: "Deep Abyss" },
  { id: "stuffed", name: "Stuffed",     codename: "Stuffed Dungeon" },
];

const TOPPING_PRICE = 1.5;

// Toppings. Decoys (similar codenames) are marked in comments.
const TOPPINGS = [
  { id: "pepperoni",   name: "Pepperoni",          codename: "Operation Red Disc" },
  { id: "beet",        name: "Beet slices",        codename: "Operation Red Dish" },   // decoy
  { id: "radish",      name: "Radish",             codename: "Operation Rad Disc" },   // decoy
  { id: "salami",      name: "Salami",             codename: "Operation Red Disk" },   // decoy
  { id: "sausage",     name: "Sausage",            codename: "Operation Pork Tube" },
  { id: "mushroom",    name: "Mushrooms",          codename: "Operation Fungal Uprising" },
  { id: "onion",       name: "Onions",             codename: "Operation Tear Gas" },
  { id: "redonion",    name: "Red onion",          codename: "Operation Purple Tear Gas" },
  { id: "greenpepper", name: "Green peppers",      codename: "Operation Green Siren" },
  { id: "bananapep",   name: "Banana peppers",     codename: "Operation Yellow Siren" },
  { id: "blackolive",  name: "Black olives",       codename: "Operation Dark Orbs" },
  { id: "greenolive",  name: "Green olives",       codename: "Operation Pale Orbs" },
  { id: "meatball",    name: "Meatballs",          codename: "Operation Brown Orbs" },
  { id: "bacon",       name: "Bacon",              codename: "Operation Crispy Strip" },
  { id: "ham",         name: "Ham",                codename: "Operation Pink Slab" },
  { id: "prosciutto",  name: "Prosciutto",         codename: "Operation Thin Veil" },
  { id: "pineapple",   name: "Pineapple",          codename: "Operation Tropical Treason" },
  { id: "jalapeno",    name: "Jalapeños",          codename: "Operation Green Flame" },
  { id: "spinach",     name: "Spinach",            codename: "Operation Leaf Pile" },
  { id: "arugula",     name: "Arugula",            codename: "Operation Bitter Leaf" },
  { id: "basil",       name: "Basil",              codename: "Operation Sweet Leaf" },
  { id: "tomato",      name: "Tomatoes",           codename: "Operation Red Sphere" },
  { id: "sundried",    name: "Sun-dried tomatoes", codename: "Operation Red Raisin" },
  { id: "extracheese", name: "Extra cheese",       codename: "Operation Molten Blanket" },
  { id: "feta",        name: "Feta",               codename: "Operation Crumble Protocol" },
  { id: "ricotta",     name: "Ricotta",            codename: "Operation White Cloud" },
  { id: "goatcheese",  name: "Goat cheese",        codename: "Operation Tangy Cloud" },
  { id: "parmesan",    name: "Parmesan",           codename: "Operation White Dust" },
  { id: "oregano",     name: "Oregano",            codename: "Operation Green Dust" },
  { id: "anchovy",     name: "Anchovies",          codename: "Operation Salty Swimmer" },
  { id: "shrimp",      name: "Shrimp",             codename: "Operation Curled Soldier" },
  { id: "chicken",     name: "Chicken",            codename: "Operation Fowl Play" },
  { id: "garlic",      name: "Garlic",             codename: "Operation Vampire Repellent" },
  { id: "artichoke",   name: "Artichoke",          codename: "Operation Armored Bud" },
  { id: "capers",      name: "Capers",             codename: "Operation Tiny Grenades" },
  { id: "corn",        name: "Corn",               codename: "Operation Golden Pellets" },
  { id: "eggplant",    name: "Eggplant",           codename: "Operation Violet Canoe" },
  { id: "zucchini",    name: "Zucchini",           codename: "Operation Green Canoe" },
  { id: "broccoli",    name: "Broccoli",           codename: "Operation Tiny Forest" },
  { id: "hothoney",    name: "Hot honey",          codename: "Operation Liquid Gold" },
  { id: "chiliflakes", name: "Chili flakes",       codename: "Operation Red Confetti" },
  { id: "bbq",         name: "BBQ drizzle",        codename: "Operation Brown Rain" },
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
};
