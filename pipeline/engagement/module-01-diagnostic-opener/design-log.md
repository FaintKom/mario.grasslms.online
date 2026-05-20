# Module 1 · Design log

> Decisions, sources, and trade-offs for the M1 Diagnostic Opener build.
> Audience: Phase 4 reviewer (K.M. + A.S.) + Phase 5 SCORM-Cloud QA pass.
> Inputs: brief §§5/7/9/10.1/10.4/11/12.1/12.3/18 · storyboard
> `02-design/module-storyboards/M1-diagnostic-opener.md` · UX system
> `02-design/ux-design-system.md` · shell `03-develop/scorm-shell/`.

## 1 · Packaging note (manifest dependency)

`imsmanifest.xml` declares two resources: `RES-M1` (this module) and `RES-SHELL`
(referenced relatively at `../scorm-shell/`). SCORM 1.2 LMSes resolve resource
paths inside the zip, so the **packaging script must copy `/scorm-shell/` into
the zip as a sibling of the module folder** before upload. The
`scripts/package.sh` referenced in the shell `README.md` §8 already does this;
this module ships with no override.

Local-preview path: serve `03-develop/` over `python -m http.server` and open
`/module-01-diagnostic-opener/index.html`. Shell-relative `../scorm-shell/`
resolves correctly because the two folders are siblings on disk.

## 2 · §10.1 quote sources used (verbatim → on-screen text)

| Storyboard slot | Verbatim source (brief) | Where it lands |
|---|---|---|
| State-outcome quote | §10.1 M.G.: *"5 seconds feels like an hour but it's where the deal happens."* | `module.js` · `eventStateOutcome()` · blockquote |
| Worked-example opener (rep line) | §10.1 M.G.: *"I noticed you've opened a second location in the last 6 months — who's approving expense reports across both stores now?"* | `data/transcripts.json` · `GC-01` lines[1] |
| Worked-example buyer reply | §10.1 M.G. (*"her bookkeeper was overwhelmed"*) re-voiced as Maria's first-person line | `data/transcripts.json` · `GC-01` lines[2] |
| Trigger-scenario rep line | §10.4 P.B.: *"hi, this is P. calling from FinTechCard, do you have a moment to talk about your corporate spending?"* | `data/transcripts.json` · `GC-19` lines[0] |
| Key-takeaway card | §10.1 M.G.: *"Ask one good question and then shut up for 5 seconds. Five seconds feels like an hour but it's where the deal happens."* (compressed to ≤ 30 words) | `module.js` · `eventRetention()` · `.m1-takeaway` |

All initials anonymised (M.G., P.B.) per brief §7 GDPR constraint. Buyer
first-names follow §12 archetype labels (Maria, Emma). No PII present.

## 3 · GC-01 selection rationale

Six top-decile calls in §11 carry an M1 tag (GC-01..08). GC-01 chosen because:

1. **Maria archetype match.** §12.1 Maria's "second-location" signal is the
   exact signal M.G. cites in §10.1. The worked example aligns one SME
   verbatim + one ICP archetype on the same canonical move — minimising
   cognitive load (Sweller 2011) by removing the buyer-pattern-match step the
   rep has not yet been trained on.
2. **Mid-length call (8:42).** Short enough to reference inside the 10-min
   module without disrupting pacing; long enough to plant the M2 + M3 seed
   for Modules 2 and 3.
3. **Clean M1+M2+M3 chain.** All three keystone moves present and successful,
   so the worked-example screen can foreshadow Module 2 (M2-preview line at
   `[0:38]`) without breaking the M1-only training focus.

GC-19 (P.B. hangup) selected as contrast for the trigger scenario because it
fires inside 8 seconds — matches the "third hang-up this morning" §10.4 voice.

## 4 · Distractor sourcing (completion problem + quiz)

Each distractor cites a specific §11 Gong row or §10.4 P.B. anti-pattern:

| Item | Distractor | Source | Why it's wrong |
|---|---|---|---|
| Completion · A | "Do you have a moment to talk about your corporate spending?" | §11 GC-19 / §10.4 P.B. opener | No signal, no diagnostic — hung up at 0:08 |
| Completion · C | "Our card is cheaper than your bank's…" | §11 GC-20 / §10.4 P.B. fees-argument | Pitches features, no diagnostic — hung up at 0:24 |
| Completion · D | "We help SMB owners get real-time visibility…" | §11 GC-17 mid-band pitch-launch | Pitches benefits, no signal — hung up at 0:22 |
| Quiz Q1 · A/C/D | Same triad as completion problem | Same | Reinforces pattern recognition |
| Quiz Q2 · A | "Congratulations on the Series B…" (long compliment) | Anti-pattern of LO-M1.2 (≤ 15 words) | Length + missing who-Q |
| Quiz Q2 · C | "We help fast-growing SaaS teams…" | §11 GC-17 pitch-launch | Same anti-pattern transferred to Tom archetype |
| Quiz Q2 · D | "Are you using Brex?" | §10.2 L.D. anti-pattern (closed-ended) | No signal; sets up M2 with nothing to acknowledge |
| Quiz Q3 · A/B/D | "Rephrase / fill / 'still there?'" | §10.4 P.B. silence-intolerance reflex | All three break the 5-s threshold |

Every distractor's feedback string names the GC-XX or §10.x source verbatim,
so the rep learns not just the keyed answer but *why each wrong answer fails*
(Mayer 2014 ch. 12 · feedback-with-explanation).

## 5 · Accessibility (WCAG 2.1 AA) notes

| Check | Implementation |
|---|---|
| Keyboard reach | Every interactive element is a `<button>` or `<textarea>` with native focus; `tabindex` not overridden |
| Focus visible | `.m1-btn`, `.m1-choice`, `.m1-signal`, `.m1-rubric__score button`, `.m1-draft` all set a 3 px green outline at ≥ 3:1 contrast via `:focus-visible` |
| Modal semantics | `role="dialog" aria-modal="true" aria-labelledby="m1-modal-title"` on every overlay; first focusable element receives focus on render via `queueMicrotask` |
| Live regions | `#m1-stage[aria-live="polite"]` for stage updates; `.m1-silence[aria-live="polite"]` for countdown |
| ARIA radio groups | Completion + quiz choice lists use `role="radiogroup"` + `role="radio"` + `aria-checked` |
| 3-cue signalling | M1 transcript line: (1) green chip background + 3 px left border, (2) `👁` glyph, (3) `[M1]` text label with `aria-label="M1 diagnostic move"` |
| Reduced motion | All keyframe animations gated by `@media (prefers-reduced-motion: reduce) { ... animation: none }` |
| Colour contrast | Primary green `#00b67a` on white = 4.55:1 (AA pass) per UX system §1 |
| Skip link | `.skip-link` jumps to `#desktop` (inherited from shell) |
| No-audio compensation | Silence threshold communicated via text (`[silence 0:04]`), visual ring countdown, and `aria-live` announcement (3-cue redundancy per `D-006`) |
| Language attribute | `<html lang="en">` on `index.html` |

Outstanding pre-launch: NVDA + JAWS sweep on SCORM-Cloud preview build
(scheduled in Phase 5 sprint 5.1 per `scorm-shell/a11y-audit.md`).

## 6 · Dry-run timing estimate vs ≤ 10-min budget

| Segment | Storyboard target | Built duration (estimate) | Notes |
|---|---|---|---|
| Gain attention | 0:00–0:30 | ~25 s | One paragraph + 3-line transcript + 1 button click |
| State outcome | 0:30–1:00 | ~25 s | Single quote modal |
| Recall prior | 1:00–1:30 | ~25 s | 2-bullet list |
| Worked example | 1:30–3:00 | ~1:15 | 4-turn transcript + silence line + callout · ~ 95 words on screen |
| Completion problem | 3:00–5:00 | ~1:30 (45 s read + 30 s pick + 15 s feedback) | 4-option MCQ; single-attempt |
| Solo problem | 5:00–8:00 | ~3:00 (90 s signal-pick + 60 s draft + 5 s silence + 25 s reveal read) | 3 sub-screens; hint affordance optional |
| Feedback (rubric) | 8:00–9:00 | ~45 s | Single-row interactive; M2/M3 rows disabled |
| Quiz (3 items) | 9:00–9:30 | ~1:15 (25 s each) | One scenario stem per LO |
| Retention card | 9:30–10:00 | ~25 s | Read + click |
| **Total** | **≤ 10:00** | **≈ 9:00–9:45** | Within budget; 15–30 s headroom for slow readers |

Timing assumes 200 wpm reading + no hint use. Hint use in solo adds ≤ 10 s.
Reduced-motion users save ~ 1 s of animation across the run.

## 7 · Engineering trade-offs

1. **Stage-overlay over shell-window approach.** The Gagné modals live in
   `#m1-stage` (a module-owned overlay layer) rather than as additional
   mini-OS windows. Rationale: storyboard-defined dialogs are linear
   teaching artefacts, not workspace tools — they shouldn't be draggable
   or close-able. The mini-OS apps (Gong, LinkedIn-CH, Outreach, Phone)
   open *behind* the modal and are visible/explorable between steps.
2. **Phone-dialler silence simulation.** The shell's phone-dialler app
   already provides a silence-counter; we duplicated the countdown into the
   module modal so the moment is *front and centre*, not buried in a
   background window. `eventLog.record("silence_observed")` is emitted once
   from the modal tick handler to avoid double-counting.
3. **Specificity scoring is heuristic.** The `signal + who-Q + length`
   triple-gate is a coarse 0–3 scale. Phase 5 cohort-1 telemetry will
   calibrate; for v1 it drives only the rubric anchor hint (not the SCORM
   score, which comes from the 3-item quiz).
4. **Top-bar progress clock.** Added a `#module-progress` element to
   `index.html` and a 1 Hz updater in `module.js`. Honest pacing signal to
   the rep, no surveillance — the value never leaves the page.

## 8 · Outstanding issues / Phase 4 backlog

- Calendar app intentionally not opened in M1 (M3 territory per storyboard);
  shell taskbar shows only Phone, Gong, LinkedIn-CH, Outreach.
- The hint affordance currently auto-fills the draft textarea; an alternative
  pattern would be a pop-up of M.G.'s exemplar without auto-fill. Held to
  Phase 4 K.M. review — peer-to-peer voice (§18.2) favours
  showing-then-letting-rep-edit.
- L1 pulse fires post-completion in a separate Sana-side instrument
  (`05-evaluate/l1-pulse-survey.md`), not from inside the SCO. Documented
  here so reviewers don't flag the absence.
- The shell `coachMarks.show()` anchors to `#help-button`; if Sana's iframe
  wrapper occludes the top bar on small viewports the coach-mark may render
  off-screen. Mitigated by the inline `.m1-callout` inside the worked-example
  modal — same job-aid information surfaced without depending on the shell
  positioning logic.

## 9 · References

- Brief §§5 (success measures), 7 (constraints), 9 (A.S.), 10.1 (M.G.),
  10.4 (P.B.), 11 (GC-01, GC-17, GC-19, GC-20), 12.1 (Maria), 12.3 (Emma),
  18.2 (brand voice), 18.3 (visual brand).
- Storyboard: `02-design/module-storyboards/M1-diagnostic-opener.md`.
- Learning outcomes: `02-design/learning-outcomes-abcd-bloom.md` §4.1
  (LO-M1.1 / LO-M1.2 / LO-M1.3).
- UX system: `02-design/ux-design-system.md` §1 (tokens), §6 (signalling),
  §7 (motion), §9 (WCAG).
- Shell API: `03-develop/scorm-shell/README.md` §§3–5; event-log spec
  `03-develop/scorm-shell/event-log-spec.md`.
- Decisions: `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS).
- Frameworks: Gagné (1985); Merrill (2002); Renkl & Atkinson (2003);
  Mayer (2014); Sweller, Ayres & Kalyuga (2011); Van Merriënboer & Kirschner (2018).
