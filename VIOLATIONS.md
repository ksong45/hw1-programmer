# HW1 Violations Tracker

Source of truth for every usability violation on the site.
**Change log** = built. **Backlog** = candidates from lectures, decided screen by screen before building.
Rule: each idea gets exactly ONE lecture home (no double-counting).

Benchmark task: order a **medium, thin-crust pepperoni pizza** delivered to the **Break Room**.

---

## Change log (built)

| # | Screen | Lecture | Guideline / concept | Status |
|---|---|---|---|---|
| 1 | Orientation | Reading | Avoid text on noisy background | Built |
| 2 | Orientation → Login, Payment | Perception 2 | Enhance the user's ability to scan long numbers (chunking) | Built |
| 3 | Payment | Memory 1 | Present all info needed for a task on a single screen | Built |
| 4 | All screens | Perception 2 | Be consistent (place controls in consistent locations) | Built |
| 5 | All screens | Attention 2 | Automatic processing / Stroop effect (counterintuitive colors) | Built |
| 6 | Crust | Memory 2 | See and choose is easier than recall and type | Built |
| 7 | Crust | Attention 2 | Banner blindness | Built |
| 8 | Toppings | Thinking (Decision Making) | Choice overload | Built |
| 9 | Toppings | Memory 1 | Changing the ordering of information (consistency / power law of learning) | Built |
| 10 | Toppings | Perception 1 | Distinguish colors by saturation and brightness, as well as hue | Built |
| 11 | All screens (header) | Thinking (Problem Solving) | Prominently indicate system status and progress (setting expectations) | Built |
| 12 | Login → Payment | Attention 1 | Multitasking = serial task switching (interruptions) | Built |

### #1: Pizza background behind warm text (Reading, avoid text on noisy background)
- **What changed:** The Orientation screen sits on a busy CSS pizza pattern (pepperoni, olives, basil, cheese). Heading and body text are red, brown, and orange, the same palette as the pattern.
- **Files:** `css/style.css` (`.screen-orientation.active`), `index.html` (class on the Orientation section).
- **Draft write-up:** The lecture recommends plain, light backgrounds with no patterns. Here the text competes with a high-detail pattern in the same hues, which disrupts automatic, feature-driven reading and slows comprehension of the screen that explains the task.
- **Screenshot:** Orientation, full screen.

### #2: Long, unchunked, uncopyable Henchman ID (Perception 2, chunking long numbers)
- **What changed:** The ID became `K7QX2M9WZ4TR8BVJ`: 16 random characters with no spaces, dashes, or meaningful chunks. (The old ID contained "HNCH" and "LAIR," which were memorable.)
- **Supporting mechanism (not a separate violation):** The ID is drawn on a `<canvas>`, so it can't be selected or copied, and paste is blocked in the login and payment ID fields. This makes the memory cost unavoidable instead of a copy-paste shortcut.
- **Files:** `js/data.js` (`HENCHMAN_ID`), `js/render-id.js` (new), `js/app.js` (canvas draw and paste blocking), `index.html`, `handbook.html`.
- **Draft write-up:** The structure guidelines say to chunk long numbers so people can scan and hold them. This ID is one unbroken 16-character string of unrelated characters, well beyond the 4±1 chunks people can hold (Memory 1), and it's needed twice, at login and at payment.
- **Screenshot:** Orientation ID line plus Login field.
- **Recovery path (keeps task completable):** Handbook → "Forgotten Henchman ID."

### #3: Charges far from the transfer formula (Memory 1, present all info needed for a task on a single screen)
- **What changed:** The payment screen is ordered so the pieces of the task can never be seen together. At the top: the Evil Transfer Formula, the read-only amount field, the ID field, and the Pay button. In the middle: a long "Evil Credit Transfer Terms & Conditions" block (at least 140% of the screen height). At the bottom: the itemized charges.
- **Supporting mechanisms (not separate violations):**
  - **Evil Transfer Formula™:** one blank box per charge plus a gratuity-percentage box, as in `( [ ] + [ ] ) × ( 1 + [ ] ÷ 100 )`. ENTER (or pressing Enter in any box) computes the result and loads it into the amount field.
  - **Transcription is enforced:** payment only succeeds if the boxes contain exactly the listed prices (any order) and 18 for the gratuity. A phone-calculated total in one box fails (Error 8). Forgetting ENTER fails (Error 9).
  - **Paste is blocked** in the formula boxes, so prices must be carried in memory rather than copied.
  - **Messy prices** (Medium 11.37, Pepperoni 1.83; every topping has its own price) and a gratuity stated only as "18% of all items above." No subtotal or total is ever shown before confirmation.
  - **The amount field is read-only;** the only way to fill it is the formula.
  - **Auto-collapsing charges:** the itemized list sits in a collapsed "Show itemized charges" panel. It snaps shut whenever it scrolls out of view, so every trip back down to read a price means opening it again.
- **Files:** `index.html` (payment layout, formula markup, `.transfer-terms`, `#charges-panel`), `js/app.js` (`buildFormula`, `loadFormula`, `formulaMatchesCharges`, paste blocking, payment validator, charges table, auto-collapse observer), `js/data.js` (messy prices, `GRATUITY_RATE`, error codes 8 and 9), `css/style.css` (formula, terms, read-only field).
- **Draft write-up:** The memory guidelines say to present all the information a task needs on a single screen, so users don't have to hold it in working memory. Here, every price must be read at the bottom of the page (after reopening the collapsed charges panel, which closes itself whenever the user scrolls away), carried up past a wall of terms, and typed into the formula at the top, one scroll trip per charge. The prices are deliberately awkward (11.37, 1.83) and pasting is disabled, so each trip loads short-term memory with a number that's easy to garble. Users are also recalling the 16-character Henchman ID on the same screen.
- **Benchmark answer (cheatsheet):** boxes `11.37` and `1.83` (either order), gratuity `18`, press ENTER → amount **15.58**.
- **Screenshot:** Top (formula) and bottom (charges), or one zoomed-out full-page capture with an arrow showing the distance.

### #4: Next button moves and changes name on every screen (Perception 2, be consistent)
- **What changed:** The forward button is in a different place, with a different label, on every screen:

  | Screen | Location | Label |
  |---|---|---|
  | Login | Top right, above the ID field | Proceed |
  | Size | Bottom left (Back moved to bottom right) | Advance |
  | Crust | Inline, beside the crust control | Obey |
  | Toppings | Top, above the 42-item list | Comply |
  | Sector | Centered under the map, before the sector list | Submit to Dr. A |
  | Payment | Top, beside Back (required by #3) | Transfer |

  Buttons stay normal-sized and fully visible: they're harder to *find*, never hard to *click*.
- **Files:** `index.html` (each screen's `.actions` placement and labels), `css/style.css` (`.actions-top-right`, `.actions-split`, `.actions-top`, `.actions-center`, `.inline-control`).
- **Draft write-up:** The perception design guidelines say to place information and controls in consistent locations so users can rely on experience instead of searching. Here, every screen resets the user's expectations: after learning that Next is at the top right, they find it at the bottom left, then inline, then above a long list they've just scrolled past. The ever-changing labels ("Proceed," "Advance," "Obey," "Comply") also stop users from recognizing the button by name, so each screen requires a fresh visual search.
- **Screenshot:** A grid of 4 to 6 screens with the Next button circled on each.

### #5: Red forward buttons, green Back buttons (Attention 2, automatic processing / Stroop effect)
- **What changed:** Every forward button (Start order, Proceed, Advance, Obey, Comply, Submit to Dr. A, Transfer) is red. Every Back button is green.
- **Files:** `css/style.css` (`.btn.primary`, `.btn.back`), `index.html` (`class="btn back"` on Back buttons).
- **Draft write-up:** Color meanings like green = go and red = stop are processed automatically, without conscious attention, the same mechanism the Stroop effect demonstrates. Here, the color and the meaning conflict: the button that moves users forward carries the "stop" color, and the one that takes them backward carries the "go" color. Users must override their automatic response on every screen, and those who act on it go backward.
- **Screenshot:** Any screen with both buttons visible (Size shows both clearly).

### #6: Free-text crust classification (Memory 2, see and choose is easier than recall and type)
- **What changed:** The crust dropdown was replaced by a text field labeled "State your crust classification." There's no list, hint, or autocomplete. Only the four exact classifications are accepted (case and extra spaces are ignored): Thin Veneer, Standard Slab, Deep Abyss, Stuffed Dungeon. Typing a normal name like "thin" gives Error 3.
- **Files:** `index.html` (crust screen input), `js/app.js` (crust validator; removed the dropdown builder and change handler), `js/data.js` (error 3 text).
- **Draft write-up:** Recognition (choosing from visible options) is far easier than recall (producing an answer from memory). The original dropdown let users recognize "Thin." Now they must recall an exact, unfamiliar term they've never been shown, so the task goes from a one-second choice to a search for the valid answers.
- **Screenshot:** Crust screen with an empty field and Error 3 after typing "thin."
- **Where the answers are:** the right-rail "HOT CRUST DEALS" ad (see #7) and the Handbook's crust table.

### #7: Crust answers disguised as an ad among other ads (Attention 2, banner blindness)
- **What changed:** On the Crust screen, the right rail (normally the order summary) shows three ad-styled boxes: "Shark Tank Timeshares," "🔥 HOT CRUST DEALS 🔥," and "Laser Lab is HIRING." The middle ad lists the four valid crust classifications as if they were promotions. A leaderboard-style "MINION MONTHLY" ad sits above the heading to reinforce that this page has ads.
- **Files:** `index.html` (`.leaderboard-ad`, `#ad-rail`), `js/app.js` (`AD_RAIL_SCREENS`; the summary is hidden on Crust), `css/style.css` (ad styles).
- **Draft write-up:** Users learn to ignore elements that appear where ads usually go (the right rail, the top of the page) or that look like ads. Here the only on-screen source of the answer is styled and placed exactly like an ad, surrounded by real-looking decoy ads. Users stare at an empty text field, go hunting in the Handbook, and miss that the answer was beside them the whole time.
- **Screenshot:** Full Crust screen; circle the crust ad and point to the empty field.

### #8: 84 unorganized toppings (Thinking, choice overload)
- **What changed:** The list grew from 42 to 84 toppings, including near-duplicates of the target (Turkey, Spicy, Mini, and Cup-and-char pepperoni). They're shown as a wrapping jumble of pills with no categories, headings, search, or filters.
- **Files:** `js/data.js` (42 new toppings with prices and codenames), `css/style.css` (`.topping-grid` pill layout), `index.html` (comment).
- **Draft write-up:** The jam study showed that people facing many options struggle to decide (choice overload), and the lecture shows filters as the fix: they support non-compensatory strategies by letting users narrow down to what matters. This screen offers 84 options with no way to narrow them, plus several pepperoni variants that look like acceptable matches, so users satisficing on "pepperoni" can easily grab the wrong one.
- **Screenshot:** Full toppings list (zoomed out), with the four pepperoni variants circled.

### #9: Toppings reshuffle on every visit (Memory 1, changing the ordering of information)
- **What changed:** Every time the Toppings screen is shown (including coming back from Sector), the 84 items are put in a new random order. Checked items stay checked.
- **Files:** `js/app.js` (`shuffleToppings`, run from `onEnter.toppings`).
- **Draft write-up:** The long-term memory lecture shows how unexpected changes to the ordering of information break the benefits of practice (the power law of learning). Here, any location a user learns ("Pepperoni was in the middle, near Artichoke") is wiped out on the next visit, so returning to fix or check a topping means scanning 84 items from scratch.
- **Screenshot:** Two screenshots of the same screen on two visits, with Pepperoni circled in different places.

### #10: Selected toppings are barely visible (Perception 1, distinguish colors by saturation and brightness)
- **What changed:** Checkboxes are tiny and pale, and a checked topping changes only from white to a faint cream (`#fbf8f3`) with an almost identical border. The order summary is hidden on the Toppings screen, so there's no other way to see what's selected.
- **Files:** `css/style.css` (VIOLATION #10 block), `js/app.js` (Toppings removed from `SUMMARY_SCREENS`).
- **Draft write-up:** The color guidelines say to distinguish states by saturation and brightness, not just subtle hue, because pale colors on small patches are the hardest to tell apart. Here the selected and unselected states are both near-white, on a small patch, with almost no contrast. Users can't confirm they picked Pepperoni, and those who click again to "make sure" uncheck it.
- **Screenshot:** A zoomed crop with Pepperoni checked beside unchecked items; label which one is selected.

### #11: Honest step count, misleading progress bar (Thinking, prominently indicate system status and progress)
- **What changed:** The header shows an accurate "Step X of 6" next to a progress bar and percentage that misrepresent the remaining work: 12% at step 1, 31% at step 2, then **99%** from step 3 onward, creeping to 99.2%, 99.5%, and 99.8%. The values are fixed, so every user sees the same thing.
- **Files:** `index.html` (header `.progress-wrap`), `js/app.js` (`PROGRESS_PERCENT`, `showScreen`), `css/style.css` (progress styles).
- **Draft write-up:** The problem-solving guidelines say to prominently indicate status and progress, and the decision-making lecture shows how setting expectations helps users estimate interaction cost. This bar technically shows progress but sets the wrong expectation: at 99% "complete," users believe they're one click from done while four screens, including the longest (payment), remain. The mismatch between "Step 3 of 6" and "99%" also makes users doubt which indicator to trust.
- **Screenshot:** The header at step 3 (99%) and at step 6 (99.8%).

### #12: Dr. A's chat interrupts every step (Attention 1, multitasking / serial task switching)
- **What changed:** The first time each step (Login through Payment) is shown, a chat window from "Dr. Antiusabilious" opens over a dimmed screen and blocks the page until it's closed with ✕ (or Esc). Each step has its own message, and several contain numbers and codes: locker combo 4-8-2-1, shark feeding times, Form 7Q-22B, "closed until 18:30."
- **Guardrails (keeps it within the rubric):** deterministic (same message, once per step, no timers or randomness); the ✕ is normal-sized, visible, and automatically focused; Esc also closes it. It never reappears when revisiting a step.
- **Files:** `index.html` (`#chat-overlay`), `js/data.js` (`CHAT_MESSAGES`), `js/app.js` (`openChat`, `closeChat`, called from `showScreen`), `css/style.css` (chat styles).
- **Draft write-up:** The attention lecture shows that multitasking is really serial task switching: every switch costs time, raises errors, and can cause users to miss things. Here, each new step starts with a forced switch to an unrelated conversation, then a switch back, where the user must reorient to a screen they haven't read yet. The messages also load working memory with irrelevant numbers at exactly the moments users are holding the Henchman ID or prices, so the interruption costs more than the click to dismiss it.
- **Screenshot:** Login with the chat open (the locker combo competes with the ID); optionally Payment's message, which references both.

---

## Backlog (candidates, not yet decided)

### Orientation
- Long "ordering procedure" shown once, never again: Memory 1, make instructions accessible during a task *(deferred)*
- Centered or right-aligned text: Reading, avoid centered or right-aligned text *(deferred; could go on another screen)*
- Confusable characters in the ID (O/0, I/1): Perception 2, bottom-up perception *(optional)*

### Login
- ID requested with no cue or hint: Memory 2, make authentication information easy to recall
- Login wall before any menu: Thinking, signup walls (supporting concept)
- Instructions in hard word order: Reading, word order matters for comprehension

### Size
- Sizes given only as diameters in mixed units (cm, inch radius, feet): Thinking, let users use perception rather than calculations *(strong candidate; would replace the slider ideas)*
- Slider for a three-option choice: Perception 2, use data-specific controls
- Reversed slider (left = bigger): Attention 2, breaking familiarity
- "Rations" with no pizza visuals: Memory 2, use pictures to convey function
- Only one size's price visible at a time: Thinking, provide all options
- Price grouped in the wrong size's box: Perception 2, common region *(conflicts with the slider idea)*

### Crust
- Jargon crust names: Reading, avoid uncommon and unfamiliar vocabulary
- Red text on saturated blue: Perception 1, separate strong opponent colors
- "Most popular" badge on the wrong crust: Thinking, provide unbiased data

### Toppings *(too many for one screen; pick about 5)*
- Every codename starts with "Operation ...": Reading, avoid redundant or repetitive text
- Decoys listed before the real one: Thinking, satisficing and good-enough processing (supporting concept)
- Checkbox closer to the wrong label: Perception 2, proximity
- Fake "End of Arsenal" with Pepperoni below it: Perception 2, illusion of completeness
- Arm/Disarm mode with a color-only dot: Memory 1, caution using interaction modes
- "View dossier" instead of thumbnails: Memory 2, use thumbnail images
- Pointless confirm dialog on each topping: Perception 1, dialog boxes (pairs with habituation at Payment)
- Deep drill-down menu: Memory 1, provide navigation aids to hierarchies *(conflicts with the flat list)*
- Search that clears the query: Memory 1, clearly present search results *(optional)*
- Second memory item ("Requisition Authorization Code") shown here, needed at Payment: Memory 1, working memory and dual-task

### Sector
- Red/green-only availability: Perception 1, avoid color-blind color pairs
- Legend far from the map: Perception 1, presentation of colors (separation)
- Silently preselected Sector 7: Thinking, check assertions and assumptions
- Delivery times out of chronological order: Attention 2, temporal order of options
- Sector numbers not in spatial order: *needs a lecture home*

### Payment
- System knows the prices but makes users do the arithmetic: Thinking (Decision Support), don't make people calculate *(tried with a calculator, then removed; available to reuse)*
- Error codes looked up in the Handbook: Thinking, don't make users diagnose system problems
- Double-negative checkbox: Attention 2, options with conflicting messages
- Look-alike dialog where OK = abandon: Perception 2, habituation
- Inconsistent currency formats: Attention 2, culture and localization *(backup)*
- Noisy background: Reading *(used on Orientation, #1)*

### Confirmation
- "REQUISITION TERMINATED" in red: Perception 2, avoid ambiguity

### Cross-cutting
- Same heading on every screen: Memory 2, use visual cues to let users recognize where they are
- Decoy buttons styled like Next: Perception 2, similarity
- Reversed arrows on buttons: Attention 2, inconsistent use of symbols
- No Back button: Attention 2, removing familiar features
- Destructive Cancel with no confirmation: Perception 1, dialog boxes *(merge with the Toppings dialogs)*
- Errors appear far from the button: Perception 1, put messages where users are looking
- Errors are plain gray text with no icon: Perception 1, mark errors with color and an error symbol
- Continuously animated banner: Perception 1, wiggle or blink conservatively
- Next is gray, decoys are bold: Attention 1, stimulus salience
- Flat visual hierarchy: Perception 2, create a clear visual hierarchy
- Handbook link with a vague label: Attention 1, information scent
- Handbook link blends into the background: Perception 2, figure and ground
- Handbook in the same tab, progress saved: Attention 1, multitasking / task switching
- Logo or cart in unconventional spots: Memory 1, Jakob's law
