# Module 4 · ICP Buyer Fit · design-log

> Why this artefact: documents the Phase 3 development decisions specific to
> Module 4. Pairs with `02-design/module-storyboards/M4-icp-buyer-fit.md`
> (the storyboard) and `02-design/4cid-blueprint.md` §3.3 (variability of
> practice rationale). Reviewed by Mario at every build gate.

## 1 · Packaging

The module ships as a single SCORM 1.2 SCO (`FTC.SDR.M4.icp-buyer-fit.v1`). The
manifest references the shell at `../scorm-shell/` relatively; the packaging
script (`scripts/package.sh` in the launch comms plan) copies `/scorm-shell/`
alongside the module folder before zip. Same pattern as Module 1 — kept
identical for consistency across the 6 modules.

`adlcp:masteryscore=80` — same threshold across all modules per
`02-design/learning-outcomes-abcd-bloom.md` §5 + brief §5 L2 target.

## 2 · The 3-vs-2-interleaved-calls decision (Phase 2 critic finding)

The storyboard prescribes **3 interleaved calls** in the Solo block (5:30–8:30).
The Phase 2 critic surfaced a risk: if a real dry-run overruns the ≤10 min
cohort tolerance (brief §7), the module must degrade gracefully.

**Decision:** ship with `INTERLEAVED_CALLS = 3` (module.js line 35) as the
default. Fallback is a single-constant change to `2`, which:

- drops Solo block from ~3 min to ~2 min;
- preserves variability (2 archetypes interleaved is still non-blocked per
  Van Merriënboer Ch. 5);
- keeps LO-ICP.3 (run M1+M2+M3 × 3+ archetypes) **partially** met — D4 drill
  already validates LO-ICP.1 across all 4 archetypes, so Solo is the only
  step that drops.

**Dry-run protocol.** Phase 5 cohort-1 first cohort runs the 3-call default.
If 2+ reps in the cohort exceed 10:30 module-time (instrumented via
`time_in_module_ms`), Phase 6 iteration drops to 2 calls. Threshold
chosen at 2 reps (not 1) to avoid one-off slow learner skewing the rollout.

**Final cut for v1 shipped build: 3 interleaved calls** (per storyboard).

## 3 · Randomisation seed strategy (manager-calibration replay)

Phase 5 manager calibration requires the ability to replay a learner's run
exactly — same archetype order, same drill shuffle, same call permutation.

**Implementation:** mulberry32 PRNG (`makeRng`) seeded from
`URLSearchParams.seed` or `DEFAULT_SEED = 20260517` (= 2026-05-17 build date).

- Drill D4 card order ← `shuffle(real, rng)`.
- Solo block call order ← `shuffle(allArche, rng).slice(0, INTERLEAVED_CALLS)`.
- Take-away card surfaces the seed and the replay URL pattern:
  `?seed=<int>`.

This keeps the run deterministic without rebuilding. Manager rubric
calibration in week 6 (per brief §8 K.M. weekly cadence) uses this for the
"score the same 3 sample calls" exercise.

## 4 · Distractor design (data/prospects.json near-misses)

Four CH near-miss distractors (M4-D-001..M4-D-004), one per archetype slot.
Each shares **one** strong surface signal with a real archetype but flips on a
**load-bearing axis** that requires reading the second-or-third field:

| Distractor      | Mimics    | Surface match   | Load-bearing miss                              |
|-----------------|-----------|-----------------|------------------------------------------------|
| Pine Mills      | Emma      | "Mill", food-adj| 1 site, 38 FTE, owner runs Sage himself        |
| Helio Rivers    | Tom       | Recent funding  | Series-C, 180 FTE — out of SMB ICP             |
| OakRow Bakery   | Lukas     | Hospitality     | 1 location, UK not DE, €6K spend < €10K floor  |
| TwoPins Studios | Maria     | "2 locations"   | Studios are client sites, not retail stores    |

**Why this design:** §12 archetypes can be pattern-matched on the surface
signal alone in a fast drill. Distractors force the rep to read the FTE,
spend, and stage fields — which is exactly the disambiguation A.S. asks for
in brief §9 (*"top reps pick off one specific observable signal"* — but only
after triangulating).

Distractors don't appear in the D4 drill (which is timed and accuracy-graded);
they appear in the Solo block's pre-call LinkedIn-CH preview to teach
disambiguation under cognitive load. (Phase 6 iteration backlog: add
distractor cards to D4 once base archetype-match accuracy clears 90% across
2 cohorts — expertise-reversal-aware, per Kalyuga 2007.)

## 5 · Dry-run timing budget (target vs measured)

Target budget per Gagné event (per storyboard):

| Event                     | Target     | Notes                              |
|---------------------------|------------|------------------------------------|
| 0:00–0:30 Gain attention  | 30 s       | 4-card lineup, hover only          |
| 0:30–1:00 State outcome   | 30 s       | Single CTA                         |
| 1:00–1:30 Recall          | 30 s       | Two short lists                    |
| 1:30–3:00 Worked example  | 90 s       | 2 archetypes side-by-side          |
| 3:00–5:30 Drill D4        | 150 s      | 4 cards × ≤ 5 s flash + transitions|
| 5:30–8:30 Solo            | 180 s      | 3 × 60 s mini-calls                |
| 8:30–9:00 Feedback matrix | 30 s       | 3×3 self-score                     |
| 9:00–9:30 Quiz            | 30 s       | 3 items                            |
| 9:30–10:00 Take-away      | 30 s       | Key line + spaced retrieval hook   |
| **Total**                 | **600 s**  | = 10:00                            |

**Measured (Mario solo dry-run, 2026-05-17, debug=1):** 8:48 first attempt,
9:22 second attempt (after pausing on worked example to read both cards).
Within budget with ~30 s headroom. Phase 5 cohort-1 confirms before cohort-2
cuts.

## 6 · Accessibility (WCAG 2.1 AA) — module-specific notes

Inherits the shell's a11y baseline (per `03-develop/scorm-shell/a11y-audit.md`).
Module-specific items:

- **Drill cards keyboard-navigable.** Cards mount with `tabindex="0"` and
  auto-focus on render so screen readers announce. Number keys `1`–`4` map
  to archetype picks (Maria/Tom/Emma/Lukas) with visible `<kbd>` glyphs.
  Buttons remain clickable; keyboard is in addition, not in place of.
- **Timer is announced.** Drill timer is wrapped in `aria-live="polite"` so
  remaining seconds reach screen readers. `.urgent` class adds colour at ≤ 2 s
  (colour + text, never colour alone — per WCAG 1.4.1).
- **Solo block side-rail.** The Solo panel is `role="region"` with an
  `aria-label="Call N of M"` boundary announcement at each call switch — per
  storyboard a11y checklist line 5.
- **Extended-time mode.** Reps requiring extended time can append
  `?ext-time=1.5` to the URL — Phase 6 backlog (not yet wired; flagged on the
  iteration playbook). For v1, learners with extended-time accommodations
  use the manager-led "pause and resume" pattern via SCORM `suspend_data`.
- **Reduced-motion honoured.** All `m4-fade` and `m4-pulse` animations are
  suppressed via `prefers-reduced-motion: reduce` (styles.css line 458).
- **3×3 fit matrix.** Each cell is a `role="radiogroup"` with `aria-label`
  combining row (M1/M2/M3) and call (archetype name) — labelled axes per
  storyboard a11y checklist line 6.
- **Distractor reads.** Distractor `signals[]` entries include a
  parenthetical "(Disambiguation: …)" prose hint in the `ideal_opener` field
  that's hidden from real drill cards but read aloud in the Solo pre-dial
  preview for any rep who Tabs through the LinkedIn-CH window — supports
  cognitive accessibility (CAST UDL Guideline 3).

## 7 · UX-UI quality bar — what "максимально приятный" means here

Per the user's verbatim instruction. Three concrete design moves carry it:

1. **Mayer signalling stays loud but coherent.** Each archetype gets its own
   colour cue (Maria #d97706, Tom #7c3aed, Emma #2563eb, Lukas #00875f) but
   the **M1 label** stays brand-green across both worked-example cards — so
   the *cue colour for the move* is constant, and only the *frame colour for
   the buyer* varies. Same principle in the call-strip pills at the top of
   the Solo block.

2. **No modal traps in the drill loop.** Drill cards transition card → flash
   → next via 420 ms timeout. No "continue" button between cards. The rep is
   in flow for the entire 150 s.

3. **The side-rail Solo panel is non-blocking.** Mini-OS windows (LinkedIn-CH
   etc.) host the workspace; the side-rail panel only holds the step
   coach + call-strip. Real workspace, real flow — not a slideware overlay
   covering it.

## 8 · References

- Brief §§7, 12.1–12.4, 13.1, 18.2, 18.3.
- `02-design/module-storyboards/M4-icp-buyer-fit.md`.
- `02-design/4cid-blueprint.md` §3.3 + §6.
- `02-design/learning-outcomes-abcd-bloom.md` §4.4.
- `02-design/ux-design-system.md` §6 signalling + §9 a11y.
- `03-develop/scorm-shell/README.md` + `event-log-spec.md`.
- Van Merriënboer & Kirschner (2018) Ch. 5 (variability) + Ch. 10 (part-task).
- Kalyuga (2007) — expertise reversal note for distractor schedule.
- Mayer (2014) Ch. 6 (signalling) + Ch. 11 (redundancy).
- Decisions `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS).
