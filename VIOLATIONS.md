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

---

## Backlog (candidates, not yet decided)

### Orientation
- ID inside an ad-styled right-rail box: Attention 2, banner blindness *(tried as a fake ad, then removed; available to reuse)*
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
- Free-text "crust classification": Memory 2, see and choose is easier than recall and type
- Jargon crust names: Reading, avoid uncommon and unfamiliar vocabulary
- Red text on saturated blue: Perception 1, separate strong opponent colors
- "Most popular" badge on the wrong crust: Thinking, provide unbiased data

### Toppings *(too many for one screen; pick about 5)*
- 42 items: Thinking, choice overload (supporting concept)
- Every codename starts with "Operation ...": Reading, avoid redundant or repetitive text
- Decoys listed before the real one: Thinking, satisficing and good-enough processing (supporting concept)
- Checkbox closer to the wrong label: Perception 2, proximity
- Fake "End of Arsenal" with Pepperoni below it: Perception 2, illusion of completeness
- Selected state is a faint pastel: Perception 1, distinguish colors by saturation and brightness
- Arm/Disarm mode with a color-only dot: Memory 1, caution using interaction modes
- Order reshuffles on every visit: Memory 1, changing ordering of information
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
- No progress indicator: Thinking, prominently indicate system status and progress
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
