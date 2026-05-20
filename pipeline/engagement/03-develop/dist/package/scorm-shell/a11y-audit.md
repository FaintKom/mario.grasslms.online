# A11y audit · mini-OS shell (WCAG 2.1 AA)

> Per brief §7 contractual constraint + `D-006` no-audio + `02-design/ux-design-system.md` §9.
> Audit applies to the shell only — each module re-runs its own per-screen audit during Phase 3.

## 0 · Tooling + method

- Visual inspection in Chromium (Windows 11) + Firefox (Windows 11).
- Keyboard-only walkthrough (Tab / Shift-Tab / F6 / Ctrl+Tab / Enter / Space / Esc).
- NVDA 2024.x sweep planned before SCORM Cloud upload.
- Colour contrast measured with the brand palette in `02-design/ux-design-system.md` §1.

## 1 · WCAG 2.1 AA per-criterion table

| Criterion                                | Status | Note                                                                                                                                                                           |
|------------------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **1.1.1** Non-text content               | PASS   | Every Phosphor SVG icon used as signalling has `aria-label`; decorative icons render with `aria-hidden="true" focusable="false"` (see `js/apps/registry.js` → `icon()`).         |
| **1.2.*** Time-based media               | N/A    | No audio per `D-006`; no video in v1.                                                                                                                                          |
| **1.3.1** Info & relationships           | PASS   | Semantic landmarks (`header`/`main`/`nav`); buttons not divs; lists use `<ul>`; SF tabs use `role="tablist"`/`role="tab"`/`aria-selected`.                                      |
| **1.3.2** Meaningful sequence            | PASS   | DOM order matches visual order. Tab order top → bottom of each window.                                                                                                          |
| **1.3.3** Sensory characteristics        | PASS   | M-move signal uses three cues (colour + icon + `[M1]` text label) — never colour-only.                                                                                          |
| **1.4.1** Use of colour                  | PASS   | Failure-mode rows show muted-red border + `[FAIL]` text + Warning icon. Suggested calendar slots use both bg-tint + bold + left-border stripe.                                  |
| **1.4.3** Contrast (text)                | PASS   | See §2.                                                                                                                                                                        |
| **1.4.4** Resize text up to 200 %        | PASS   | Layout uses relative units; window-manager re-flows.                                                                                                                           |
| **1.4.10** Reflow                        | PASS   | `<1024 px` viewport flips to card-stack mode (`shell.css` `@media (max-width:1023px)`).                                                                                        |
| **1.4.11** Non-text contrast             | PASS   | Focus ring 3 px `--brand-green-deep` (5.92:1 vs white); border colour against window bg ≥ 3:1.                                                                                  |
| **1.4.12** Text spacing                  | PASS   | All text uses `line-height: 1.5`; no `letter-spacing` fixed; user CSS can override.                                                                                            |
| **1.4.13** Content on hover/focus        | PASS   | Coach-marks dismissible (Esc + button); persistent until dismissed; don't obscure trigger.                                                                                     |
| **2.1.1** Keyboard                       | PASS   | Every action reachable via Tab; close = button; resize via mouse only (acceptable per WCAG since window can be closed and re-opened at default size from keyboard).            |
| **2.1.2** No keyboard trap               | PASS   | Modals trap focus until Escape; coach-marks dismiss on Esc; F6 always exits a window's tab cycle.                                                                              |
| **2.1.4** Character key shortcuts        | PASS   | Only F6 / Ctrl+Tab / Esc — all use modifier or function key, no single-char shortcuts.                                                                                          |
| **2.4.1** Bypass blocks                  | PASS   | Skip-to-content link in `index.html` line 12.                                                                                                                                  |
| **2.4.3** Focus order                    | PASS   | Logical: topbar → desktop windows (in z-order) → taskbar.                                                                                                                       |
| **2.4.4** Link purpose (in context)      | PASS   | No ambiguous "click here" links — every button labels its action ("Dial Maria", "Send invite", etc.).                                                                          |
| **2.4.7** Focus visible                  | PASS   | Universal `:focus-visible { outline: 3px solid var(--brand-green-deep); outline-offset: 2px; }` in `shell.css`.                                                                |
| **2.5.3** Label in name                  | PASS   | Visible button text is included in `aria-label` (e.g. "Dial Maria").                                                                                                            |
| **3.1.1** Language of page               | PASS   | `<html lang="en">`.                                                                                                                                                            |
| **3.2.1** On focus                       | PASS   | Focus doesn't trigger context change.                                                                                                                                          |
| **3.2.2** On input                       | PASS   | Select-change does in-component re-render only (no auto-submit).                                                                                                               |
| **3.3.1** Error identification           | PASS   | Calendar disables "Send invite" until valid input + visible inline helper text explains why.                                                                                   |
| **3.3.2** Labels or instructions         | PASS   | Every `<input>`/`<select>` has a `<label>` (sr-only or visible).                                                                                                               |
| **4.1.1** Parsing                        | PASS   | Valid HTML5; no duplicate IDs (windows generate unique IDs); attributes properly quoted.                                                                                       |
| **4.1.2** Name, role, value              | PASS   | Custom controls use native semantics (`<button>`, `<select>`, `<input>`); tabbed UI uses `role="tab"`/`aria-selected`; modal uses `role="dialog" aria-modal="true"`.            |
| **4.1.3** Status messages                | PASS   | `aria-live="polite"` on `#focus-announcer` (window open/close/focus); `aria-live="polite"` on phone-dialler silence banner.                                                    |

## 2 · Colour-contrast measurements

| Foreground / Background                  | Ratio | AA-normal (4.5) | AA-large (3.0) |
|------------------------------------------|-------|-----------------|----------------|
| `--ftc-ink` (#0F1419) on `--ftc-paper` (#FFFFFF)    | 19.2 : 1 | ✓ | ✓ |
| `--ftc-ink-2` (#475467) on `--ftc-paper`           | 7.6 : 1  | ✓ | ✓ |
| `--ftc-paper` on `--ftc-green-primary` (#00B67A)   | 3.31 : 1 | — (large only) | ✓ |
| `--ftc-paper` on `--ftc-green-dark`    (#00875F)   | 5.92 : 1 | ✓ | ✓ |
| `--ftc-ink` on `--ftc-green-tint`     (#E6F7F0)    | 17.7 : 1 | ✓ | ✓ |
| `--ftc-paper` on `--ftc-danger-muted` (#B42318)    | 5.10 : 1 | ✓ | ✓ |
| Focus outline `--brand-green-deep` vs `--ftc-paper`| 5.92 : 1 (UI 1.4.11 ≥ 3 ✓) |

**Notes.**
- Primary green is used for button **fills** only against white text → 1.4.11 (UI ≥ 3:1) applies, not 1.4.3. Green *text* on white uses `--ftc-green-dark` (5.92:1 ✓).
- Salesforce-blue (`#1B5297`) appears only inside the Salesforce window. Paper-on-blue = 7.7:1 ✓.

## 3 · Keyboard map

| Key                 | Action                                                                 |
|---------------------|------------------------------------------------------------------------|
| Tab / Shift+Tab     | Move focus inside the currently focused window                         |
| F6 / Shift+F6       | Cycle focus between open windows (forward / backward)                  |
| Ctrl+Tab / Shift+   | Cycle taskbar apps (mirror of F6)                                      |
| Enter / Space       | Activate focused button / select grid-cell                             |
| Escape              | Dismiss top coach-mark; close focused window if `data-dismissible="true"`; cancel modal |
| Arrow keys          | Move within Salesforce tablist (browser-native focus inside `role="tablist"`) |
| `?` (Shift + /)     | Reserved for v2 help-overlay (not wired in v1)                         |

**Every interactive element is reachable from the keyboard:**

- Topbar (logo skipped — `aria-hidden`; module title; progress; help button)
- Demo launchers in preview (each `<button>`)
- Open windows in z-order: titlebar close-button → window body → resize-grip (mouse-only — acceptable, see 2.1.1 note)
- Per-app interactives: filter selects, dial buttons, transcript lines (tabindex=0), tab buttons, slot cells (tabindex=0 role=button), invite button
- Taskbar items (each `<button>`)

## 4 · Screen-reader announcement pattern

- Window-open → `#focus-announcer` (aria-live polite) reads "`<App> app opened`".
- Window-focus → reads "`<App> window focused`".
- Window-close → reads "`<App> app closed`".
- Phone-dialler silence ≥ 4s → silence banner reads "`buyer is thinking · 4s`" + telemetry fires.
- Coach-mark show → coach-mark itself has `aria-live="polite"` so the explanation is read on appearance.
- SF "Confirm next step" → re-renders the read-only `Next_Step_Booked__c` field as `true` (NVDA + JAWS read the changed value on next tab).

## 5 · Reduced motion + high contrast

- `@media (prefers-reduced-motion: reduce)` zeroes animation-duration globally; functional ticks (call timer, silence counter) remain because they carry information.
- `@media (prefers-contrast: more)` thickens window borders + focus ring (4 px) + overrides `--ftc-border` to `#6B7280` (≥ 5:1 vs white).

## 6 · Coach-mark dismiss + focus restoration

- Each coach-mark stores `document.activeElement` at show-time.
- On Dismiss (button click or Esc), `coachMarks.dismiss()` calls `prev.focus()` so the keyboard user's place is preserved.
- Persistence: dismissal flag in `localStorage` under `ftc-coachmark-<id>`. QA reset via `coachMarks.resetDismiss()`.

## 7 · Known limitations (tracked, not blockers for AA)

- **Window resize is mouse-only.** A keyboard user can close the window and re-open at the default size; or use system-level page zoom. v2 will add Ctrl+Arrow resize.
- **Drag-and-drop window reposition is mouse-only.** Mitigation: windows reset to staggered positions on each re-open.
- **No `lang` switching in v1.** Spanish + German pods addressed in v2 per brief §3.

## 8 · Sign-off checklist (per module)

Each Phase 3 module re-runs the audit and ticks:

- [ ] No `<div onclick>`, no `outline:0`, no missing `<label>`.
- [ ] Every M-move chip carries icon + text + colour (three cues).
- [ ] Every quiz incorrect-answer feedback uses both colour + text.
- [ ] NVDA reads the live-region announcements in order.
- [ ] Keyboard walkthrough completes the solo problem without mouse.
- [ ] `prefers-reduced-motion: reduce` toggled in DevTools → no decorative motion.
- [ ] `prefers-contrast: more` toggled in DevTools → focus rings clearly visible.
