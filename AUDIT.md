# Security, Performance & Stability Audit

**Repo:** `remote-falcon-viewer-page-js`
**Date:** 2026-05-08
**Scope:** All six scripts served from this repo (`makeItSnow.js`, `christmasCountdown.js`, `halloweenCountdown.js`, `thanksgivingCountdown.js`, `customCountdown.js`, `dynamicMenu.js`) plus `scripts.json` and `README.md` guidance.

## Threat / runtime model

These files are static JavaScript served via CDN and injected into customer-authored "viewer pages" for Remote Falcon. Important properties of that runtime:

- Customers control the surrounding HTML/CSS, so scripts must be defensive about missing/duplicate IDs, mis-typed attributes, etc.
- Multiple scripts from this repo can be loaded on the same page simultaneously (e.g., a user can enable Christmas + Halloween + Make It Snow). Scripts therefore share a single global namespace.
- Scripts execute on light-show viewer pages that often run on phones/TVs and stay open for hours — battery and CPU matter.
- Rules in [README.md:24](README.md#L24) forbid arguments, so scripts must be self-configuring (DOM IDs and `data-*`).

The combination "shared globals + multi-script enable + long-lived pages" is what most of the findings below revolve around.

## Severity legend
- **High** — currently broken or actively exploitable.
- **Medium** — degrades behaviour in plausible real-world conditions.
- **Low** — hygiene / hardening / minor polish.

---

## Findings

### S1 (High, Stability) — All three holiday countdowns share the global function name `countdown`, so enabling more than one breaks all but the last
- **Files:** [christmasCountdown.js:1](christmasCountdown.js#L1), [halloweenCountdown.js:1](halloweenCountdown.js#L1), [thanksgivingCountdown.js:1](thanksgivingCountdown.js#L1)
- **Symptom:** Each script declares `function countdown()` at top level and recursively reschedules itself via `setTimeout(countdown, 1000)`. Because all three resolve `countdown` against the global namespace, the last script loaded wins:
  1. Christmas loads → `countdown` = christmas's. First tick runs and schedules christmas.
  2. Halloween loads → reassigns global `countdown` = halloween's. First tick runs and schedules halloween.
  3. The previously-scheduled christmas timer fires → runs christmas body once → calls `setTimeout(countdown, 1000)` which now resolves to **halloween's** function → christmas updates stop after a single tick.
  Result: only the final script's countdown ticks; the others appear "frozen" on the values they had at page load.
- **Why it matters:** A user who enables both Halloween and Thanksgiving will see one of the two pinned to its initial value. They will likely report it as a Remote Falcon bug.
- **Fix:** Wrap each script in an IIFE and rename internals; the public surface (DOM IDs) stays the same.
  ```js
  (function () {
    function tick() { /* … */ setTimeout(tick, 1000); }
    tick();
  })();
  ```
  Apply the same wrapping to `customCountdown.js` for consistency, and rename `getThanksgiving` (currently also a stray global).
- **Effort:** ~10 min per file.

### S2 (High, Stability) — Holiday-day display is wrong: countdown jumps to "next year" at 00:00 on the day-of
- **Files:** [christmasCountdown.js:7-9](christmasCountdown.js#L7-L9), [halloweenCountdown.js:7-9](halloweenCountdown.js#L7-L9), [thanksgivingCountdown.js:9-11](thanksgivingCountdown.js#L9-L11)
- **Symptom:** `evenDate` is set to **midnight** at the start of the holiday (e.g., Dec 25 00:00:00). The "rollover to next year" check is `if (now > evenDate)`, so at 12:00:01 AM on Dec 25 the condition becomes true and the countdown immediately reads ~365 days. The visitor on Christmas / Halloween / Thanksgiving Day sees "365 days to Christmas" all day.
- **Why it matters:** Halloween light shows in particular run *on* Halloween night. Visiting the page that night to find a 365-day countdown is exactly the wrong UX.
- **Fix options (pick one per script):**
  1. Compare against end-of-day: `if (now > new Date(year, 11, 26))` (and equivalents). Countdown shows `0d 00:00:00` throughout the holiday, which is acceptable.
  2. Detect `remTime <= 0` and render a celebratory message (e.g., "Merry Christmas!"). More work but better UX.
- **Effort:** ~5 min per file for option 1; ~15 min for option 2.

### S3 (Medium, Stability) — `dynamicMenu.js` throws if the menu has no `.active` item or no `.rf_menu__border`
- **File:** [dynamicMenu.js:7-8,38](dynamicMenu.js#L7-L8)
- **Symptom:** The script guards `if (rf_menu)` but then unconditionally calls `offsetMenuBorder(activeItem, menuBorder)` on lines 38 and 44. If a customer forgets to mark a default tab `.active` or omits the `.rf_menu__border` element (both are easy mistakes given the long HTML in the README), `getBoundingClientRect()` / `.style` is invoked on `null` and the page's console fills with errors. Remaining scripts on the page may run, but the menu will be unusable and may break event handlers further down the page if loaded in the same `<script>` tag as other code.
- **Fix:**
  ```js
  if (!activeItem || !menuBorder) return;
  ```
  before calling `offsetMenuBorder`, plus a similar guard inside `clickItem` and the resize handler.
- **Effort:** ~5 min.

### S4 (Medium, Stability) — Scripts are not idempotent; double-injection multiplies timers and listeners
- **Files:** all six (most notably [christmasCountdown.js:41](christmasCountdown.js#L41), [dynamicMenu.js:43](dynamicMenu.js#L43), [makeItSnow.js:2-3](makeItSnow.js#L2-L3))
- **Symptom:** Only `makeItSnow.js` checks for an existing instance (`document.getElementById("embedim--snow")`). The countdown scripts and `dynamicMenu.js` will happily start a second self-perpetuating `setTimeout` chain and stack a second `resize` listener if the script tag appears twice — which is easy to do accidentally when copy-pasting from multiple Remote Falcon settings panels, in template-driven pages, or in any future SPA-style hosting.
- **Fix:** Set a sentinel on `window` (or a data-attribute on `document.documentElement`) at the top of each script and bail if it is already set:
  ```js
  if (window.__rfChristmasCountdown) return;
  window.__rfChristmasCountdown = true;
  ```
- **Effort:** ~2 min per file.

### S5 (Medium, Stability) — Implicit global `i` in `makeItSnow.js`
- **File:** [makeItSnow.js:22](makeItSnow.js#L22) — `for (i = 1; i < 200; i++)`
- **Symptom:** `i` is not declared, so it leaks onto `window`. Harmless on its own, but on a page where another script has its own outer `i` (very common in older snippets), this loop stomps it.
- **Fix:** `for (let i = 1; i < 200; i++)`. Also worth wrapping the file in `'use strict';` inside an IIFE to fail loudly on similar mistakes in the future.
- **Effort:** trivial.

### S6 (Medium, Performance) — `makeItSnow.js` injects 200 unique `@keyframes` rules and animates 200 elements continuously
- **File:** [makeItSnow.js:22-60](makeItSnow.js#L22-L60)
- **Symptom:** Each snowflake gets its own per-element keyframe (`fall-1` … `fall-199`). That is 200 distinct rules in CSSOM, plus 200 always-running compositor animations. On low-end Android / Fire TV / Apple TV browsers this is a measurable battery and frame-time hit, and scrolling the page during the animation can stutter.
- **Fix options:**
  1. Drop snowflake count to ~80–100 (visual difference is small).
  2. Share a small number (~5) of keyframes and assign them randomly via `nth-child`/class — the visual variety is preserved without 200 unique rules.
  3. Pause the animation when `document.visibilityState === 'hidden'` (set `animation-play-state: paused`).
- **Effort:** ~30 min for option 2.

### S7 (Medium, Performance) — Resize handler in `dynamicMenu.js` is not throttled
- **File:** [dynamicMenu.js:43-46](dynamicMenu.js#L43-L46)
- **Symptom:** `resize` fires up to ~60×/s during a window drag or mobile rotation. Each call performs a synchronous layout read (`getBoundingClientRect`) followed by a write to `transform` — classic layout thrash trigger on lower-powered devices.
- **Fix:** Wrap in `requestAnimationFrame` with a "scheduled" flag:
  ```js
  let raf = 0;
  window.addEventListener("resize", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; offsetMenuBorder(activeItem, menuBorder); });
  });
  ```
- **Effort:** ~5 min.

### S8 (Low, Performance) — Countdown scripts re-query the DOM 8× per second and run while the tab is hidden
- **Files:** all four countdown scripts
- **Symptom:** Each tick performs four `querySelector` lookups for the existence check and four more for the assignment — twice the necessary work. Browsers throttle `setTimeout` to ~1 Hz in background tabs, so the tab-visibility cost is small, but the script will still run for hours on a TV display that never goes idle.
- **Fix:** Cache element references once at startup; bail early if all four are missing. Optionally pause via `document.addEventListener('visibilitychange', …)`.
- **Effort:** ~10 min per file.

### S9 (Low, Security) — README's CSS snippet pulls `font-awesome` from cdnjs without SRI
- **File:** [README.md:551](README.md#L551)
- **Symptom:** The "Dynamic Menu" instructions ask users to copy `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/…/all.min.css">` into their page `<head>`. There is no `integrity=` / `crossorigin=` hint. If cdnjs (or the path) is ever compromised, every viewer page following the docs is in scope.
- **Fix:** Add a Subresource Integrity hash to the documented snippet, e.g. (FontAwesome 6.6.0):
  ```html
  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-…"
        crossorigin="anonymous"
        referrerpolicy="no-referrer">
  ```
- **Effort:** ~5 min.

### S10 (Low, Security) — No SRI / version pinning guidance for the scripts in this repo themselves
- **Files:** none in-repo; this is operational guidance owed to integrators.
- **Symptom:** Whoever embeds these scripts into a viewer page (Remote Falcon backend or the user) presumably uses a `<script src="https://…/makeItSnow.js">`. If that URL is unpinned (latest from `main`) and unprotected by SRI, a compromise of the CDN distribution layer reaches every customer.
- **Fix proposal:**
  1. Tag releases (`v1.0.0`, …) and serve scripts behind versioned paths.
  2. Document SRI hashes alongside each version in the README so integrators can opt in.
  3. Where the Remote Falcon platform is the embedder, have the platform compute and embed SRI automatically.
- **Effort:** ~half-day for tagging + scripted hash generation; ongoing when adding scripts.

### S11 (Low, Security) — `data-target` value flows into `new Date(...)` with no validation message on bad input
- **File:** [customCountdown.js:30-36](customCountdown.js#L30-L36)
- **Symptom:** Not a security vulnerability — `Date` is not a script-execution sink — but the script silently `return`s on bad input, so end users misconfiguring `data-target` get a blank countdown with no console hint.
- **Fix:** `console.warn("[remote-falcon] custom-countdown: invalid data-target", targetValue)` before the early return. Same for the missing-container case.
- **Effort:** trivial.

### S12 (Low, Hygiene) — No CI/lint gate; broken JS could ship to prod
- **Files:** repo-wide (no `package.json`, no workflow files in `.github/`)
- **Symptom:** The README rule "Test Locally" is the only check standing between a typo and every customer page. Given the scripts are tiny and dependency-free, a one-shot lint/parse step in GitHub Actions would catch syntax errors and undeclared globals (S5) at PR time.
- **Fix:**
  - Add a minimal `.github/workflows/lint.yml` that installs `eslint` (or just `node --check` for syntax) and runs over every `*.js` file listed in `scripts.json`.
  - Optionally a Prettier check for consistency.
- **Effort:** ~30 min.

### S13 (Low, Stability) — `dynamicMenu.js` has stray leading whitespace and a missing wrapper
- **File:** [dynamicMenu.js:1-2](dynamicMenu.js#L1-L2)
- **Symptom:** Three indented lines at file start, no IIFE, and `"use strict";` at the top of an unwrapped script means the directive applies to the whole file — fine — but the top-level `const`s are still in script scope. Wrapping in an IIFE makes the file robust to inadvertent concatenation in the future.
- **Fix:** Wrap the body in `(function () { 'use strict'; … })();` and remove the indentation.
- **Effort:** trivial.

### S14 (Low, Stability) — `document.body` may be null if scripts are loaded synchronously in `<head>`
- **Files:** [makeItSnow.js:68](makeItSnow.js#L68), [dynamicMenu.js:2](dynamicMenu.js#L2)
- **Symptom:** Both scripts dereference `document.body` at parse time. If a customer drops the script tag in `<head>` without `defer`, `document.body` is `null` and the script throws.
- **Fix:** Either document a hard requirement in README ("place script tags before `</body>` or use `defer`"), or guard with `if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();`.
- **Effort:** ~5 min per file.

---

## Cross-cutting recommendations

1. **Adopt a per-script IIFE template** (addresses S1, S4, S5, S13 simultaneously):
   ```js
   (function () {
     'use strict';
     if (window.__rfFooBar) return;
     window.__rfFooBar = true;
     // …script body…
   })();
   ```
   Applying it across the repo is a small, low-risk PR.

2. **Add `node --check` to CI** as the cheapest possible safety net; upgrade to ESLint later (S12).

3. **Tag releases and publish SRI hashes** so the Remote Falcon platform (and any customer who self-embeds) can pin versions (S9, S10).

4. **Document loading guidance** in the README: place tags before `</body>` or use `defer`/`async`. Today's instructions don't say (S14).

5. **Optional but cheap: a `pause-on-hidden` helper** shared by the holiday scripts and snow, so animations stop when the tab is hidden. Modest battery win on always-on TV displays.

---

## Suggested execution order

1. **Same-day PR — high impact, low risk:** S1 (IIFE + rename), S2 (end-of-day comparison), S3 (null guards), S5 (`let i`), S13 (whitespace). This eliminates the only currently-broken behaviour.
2. **Next PR — hardening:** S4 (idempotency sentinels), S7 (rAF resize), S8 (cache + visibility), S11 (warn on bad input), S14 (DOM-ready guard).
3. **Infra PR:** S12 (CI lint), S9 (SRI in README), S10 (release tagging + SRI publishing).
4. **Polish:** S6 (snow optimization) once the above land.

No findings require coordinated rollout or backwards-compatibility shims — every change is a self-contained edit to a single file.
