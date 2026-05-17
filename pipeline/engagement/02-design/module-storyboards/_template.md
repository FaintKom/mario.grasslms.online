> Why this artefact: Reusable module-storyboard scaffold. Every M1–M6 storyboard inherits this template. Built per Gagné's Nine Events (1985) for tactical micro-structure, Merrill's First Principles (2002) for the activate→demonstrate→apply→integrate arc, Renkl & Atkinson (2003) for worked-example→completion→solo fading, and Mayer (2014) for signalling / spatial-contiguity / pre-training / segmenting. Honors the ≤ 10-min cohort tolerance per brief §7 and the no-audio constraint per `D-006`. Cross-checked against `master-plan.md` §2 storyboard gate criterion ("trigger scenario · worked example · completion problem · solo problem · debrief · spaced-retrieval hook").

# Storyboard template

## Storyboard header

| Field | Value |
|---|---|
| Module ID | Mx (one of M1 / M2 / M3 / M4-ICP / M5-PP / M6-REG) |
| Terminal outcome | Tx from `learning-outcomes-abcd-bloom.md` §3 |
| Enabling outcomes | LO-Mx.y IDs from `learning-outcomes-abcd-bloom.md` §4 |
| Task class | Class N from `01-analyze/task-inventory.md` §2 |
| Time budget | ≤ 10 min (brief §7) |
| Mini-OS apps used | (subset of) Outreach · Gong · Salesforce · LinkedIn / Companies House · Calendar · Phone-dialler · Slack |
| Pre-requisite outcomes | (which prior modules' outcomes the rep must have hit before entering this one) |
| Spaced-retrieval drop | +7 days (`l2-quiz-blueprint.md` §1) |

## Gagné event timeline · seconds-level pacing

| Time | Gagné event | Activity | Mayer principle applied |
|---|---|---|---|
| 0:00–0:30 | 1 · Gain attention | Trigger scenario — failure-mode Gong-style transcript for this task class fires on screen. Buyer line + rep's wrong move highlighted in muted red signal. | Signalling (highlight on the move that's about to be taught) |
| 0:30–1:00 | 2 · State outcome | One-sentence cohort-facing outcome (per §18.2 brand voice — peer-to-peer, no L&D-speak). e.g. "By the end of these 10 minutes you open every cold call with a buyer-specific diagnostic and tolerate 5 seconds of silence." | Pre-training (the rep knows what schema is coming) |
| 1:00–1:30 | 3 · Recall prior | Callback to previous module's keystone (e.g. "Last module you opened the call. This module assumes the buyer pushed back."). | Pre-training + segmenting |
| 1:30–3:00 | 4 + 5 · Present stimulus & guide | Worked example: full Gong-style transcript inside a mini-OS Gong window. M-move highlighted with: (1) primary-green token chip; (2) Phosphor icon at line start; (3) text label `[M1]` `[M2]` `[M3]` `[silence 0:04]` time annotation. Worked example uses one §10 SME pattern + one §12 buyer archetype. | Signalling (3 cues per Mayer rule) + spatial contiguity (annotation alongside transcript line, not in a separate panel) |
| 3:00–5:00 | 6 · Elicit performance (completion) | Same buyer, same transcript, but the M-move line is redacted (`______`). Rep picks the correct continuation from 4 options. Distractors drawn from documented §11 Gong failure patterns (`l2-quiz-blueprint.md` §5). | Worked-example fading (Renkl/Atkinson) — completion stage |
| 5:00–8:00 | 6 · Elicit performance (solo) | Mini-OS live solo problem: rep operates LinkedIn / Companies House → Outreach dial → Phone-dialler → Salesforce log → (Module 3+) Calendar. Buyer profile is a different §12 archetype to drive variability. Mini-OS event log captures behaviours that map to outcome `D` criteria (e.g. silence duration, calendar-open-before-dial). | Worked-example fading — solo stage; coherence (no decorative motion); modality compensation per `D-006` (no audio; rich on-screen text + signalling) |
| 8:00–9:00 | 7 · Feedback | Rep self-scores the solo problem against the L3 rubric row for this module's keystone. Manager-rubric preview shown alongside (per `l3-call-rubric.md` §1). Self-determination framing: rubric is *self-coaching tool* not surveillance (`frameworks-applied.md` §18). | Signalling (rubric anchor that matches the rep's behaviour is highlighted) |
| 9:00–9:30 | 8 · Assess performance | 3-item end-of-module quiz · scenario-classification + worked-example-completion + decision-card-lookup as appropriate (`l2-quiz-blueprint.md` §2). Score → `cmi.core.score.raw`. | Coherence; segmenting (one item per screen) |
| 9:30–10:00 | 9 · Enhance retention/transfer | Key-takeaway card (≤ 30 words; M.G. or L.D. verbatim if available); +7-day spaced quiz auto-scheduled in Sana; L1 pulse survey fires (`l1-pulse-survey.md` §1). | Pre-training of next module + retrieval-mode practice scheduling |

**Total: 10:00 minutes maximum.** Per brief §7 + `cognitive-load-analysis.md` §7.

---

## Worked-example specification

| Field | Detail |
|---|---|
| Buyer profile | One of §12.1–§12.4 archetypes (Maria / Tom / Emma / Lukas), named explicitly. Anonymised first-name only. |
| SME pattern | One of M.G. (§10.1) or L.D. (§10.2) verbatim phrasing. Gong call ID cited (e.g. GC-01 / GC-06). |
| Call timeline | Annotated transcript from `Buyer:` / `Rep:` turn-by-turn, with timestamps `[0:00]`, `[0:14]`, `[0:38]`, `[silence 0:04]`. |
| M-move highlight points | Each M-move flagged with three Mayer signalling cues: (1) primary-green chip on the rep line; (2) Phosphor icon at line start (`Eye` for M1 diagnostic; `ArrowsClockwise` for M2 acknowledge; `Calendar` for M3 close); (3) text label `[M1]` etc. |
| Mayer principles applied | **Signalling** (3 cues per M-move); **Spatial contiguity** (annotation on the same line as the move, not in a sidebar); **Segmenting** (each turn is its own screen-line, paced reading); **Pre-training** (3-move card + ICP card already in working memory per `curriculum-blueprint.md` §5); **Coherence** (no decorative motion, no off-topic content) |
| Length | ≤ 90 s reading time at ~ 200 wpm = ~ 300 words max |

## Completion-problem specification

| Field | Detail |
|---|---|
| Stem | Same buyer, same transcript context, but the M-move line is redacted to `______` |
| Options | 4 multiple-choice; one correct; three distractors drawn from documented §11 Gong failure patterns + §10.4 P.B. failure-mode statements |
| Scoring rubric | One correct answer = pass; partial-credit not awarded (cohort cadence + cognitive-load budget too tight) |
| Feedback on incorrect | Single sentence: "This is the pattern in GC-XX which led to call ending at YY seconds." No long explanation — short feedback per cognitive-load minimisation |
| Time allowance | ≤ 2 minutes (per `cognitive-load-analysis.md` §7) |

## Solo-problem specification

| Field | Detail |
|---|---|
| Buyer profile | **Different** §12 archetype from the worked example — drives variability per 4C/ID `4cid-blueprint.md` §3.3 |
| Success criteria | Outcome `D` criteria from `learning-outcomes-abcd-bloom.md` (e.g. M1 silence ≥ 4 s; M3 invite sent during call) instrumented in the mini-OS event log |
| Hint affordances | One "show me the move" hint per call (peeks at the worked-example pattern). Use ≥ 1 hint → solo flagged as completion-stage, not solo-stage, in mini-OS event log. Hint cost is transparent to the rep, no penalty — surfaces actual confidence rather than gamed scoring. |
| Time allowance | ≤ 3 minutes |
| Mini-OS apps active | Module-dependent (see header) |
| Event-log instrumentation | Captures: app open order, silence duration (where M1/M2 relevant), calendar-open-before-dial (M3+), calendar invite sent during call (M3+), Salesforce `Next_Step_Booked__c` toggle |

## Mini-OS app set used

The active app set per module is listed in the storyboard header. Apps not in the set are *not visible* in the taskbar — coherence principle (Mayer 2014) reduces extraneous load.

Standard app set vocabulary:

| App | Purpose | Coach-marks |
|---|---|---|
| Outreach | Dial queue · disposition log | First-time mini-OS open in M1 |
| Phone-dialler | Live-call state · M1/M2/M3 indicator · silence countdown | M1 + every module after |
| Salesforce | Account record · `Next_Step_Booked__c` field · `Call_Review__c` flow | M3 onwards |
| Gong | Worked-example transcript host · tag self-review on own solo call | M1 onwards |
| LinkedIn / Companies House | Pre-dial signal scan | M1 + M2 + M4 |
| Calendar | Second-tab habit · two-slot speak · invite send | M3 + M5 |
| Slack | Pinned `#sdr-onboarding` channel with job aids (3-move card · ICP card · 4-prop card · §19 reg table) | M6 specifically + all modules for job-aid access |

## Accessibility checklist (WCAG 2.1 AA · per brief §7 + `D-006` + `ux-design-system.md`)

- [ ] Keyboard nav path: every interactive element reachable via Tab; logical tab order (visual top-to-bottom); Escape closes overlays.
- [ ] Focus indicator visible at ≥ 3:1 contrast ratio against background; never removed by CSS.
- [ ] Contrast: text ≥ 4.5:1; non-text UI components ≥ 3:1. Primary green `#00b67a` verified against white + dark surfaces.
- [ ] Alt text for every Phosphor icon used as a signalling cue (e.g. `aria-label="M1 diagnostic move"`).
- [ ] Focus order: trigger → outcome statement → worked example → completion → solo → debrief → quiz → retention card → L1 pulse.
- [ ] Live region announcements (`aria-live="polite"`) for: timer count-down, silence-tolerance feedback, score update.
- [ ] Reduced-motion media query honored: any subtle transition (e.g. window slide-in) disabled when `prefers-reduced-motion: reduce`.
- [ ] No-audio compensation: every M-move signalled via *colour + icon + text label* (3-cue redundancy per `D-006` + Mayer redundancy-when-no-modality compensation rule).
- [ ] Captions: not applicable in v1 (no audio); v2 if audio added.
- [ ] Screen-reader test pass: NVDA + JAWS sweep before SCORM Cloud upload (Phase 3 `scorm-shell/a11y-audit.md`).
- [ ] Language attribute: `lang="en"` on root.

## References

- Each storyboard names its specific Phase 1 evidence (which §10.x SME quote, which §11 Gong call ID, which §12 archetype, which §19 row).
- Decisions log entries honored: `D-002` (4C/ID configural), `D-003` (LTEM L1), `D-004` (3-row rubric), `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS), `D-008` (L4 attribution bounding).
- Frameworks cited: Gagné (1985); Merrill (2002); Renkl & Atkinson (2003); Mayer (2014); Sweller, Ayres & Kalyuga (2011); Van Merriënboer & Kirschner (2018); CAST (2018) / W3C WCAG 2.1.
- Inputs: `case-study-tz.md` §§; `01-analyze/`; `02-design/learning-outcomes-abcd-bloom.md`; `02-design/curriculum-blueprint.md`; `02-design/4cid-blueprint.md`.

---

## How to use this template

1. Copy this file to `module-storyboards/<module-id>-<short-name>.md` (e.g. `M1-diagnostic-opener.md`).
2. Fill the **Storyboard header** table with the module's specific values.
3. In the **Gagné event timeline**, replace each placeholder with the module-specific content (trigger transcript, worked-example transcript, completion redaction, solo problem profile, etc.).
4. In **Worked-example specification**, name the §10 SME and §12 archetype and quote/cite the Gong ID.
5. In **Completion-problem specification**, write the 4 multiple-choice options with citations for the 3 distractors.
6. In **Solo-problem specification**, name a *different* §12 archetype than the worked example.
7. In **Mini-OS app set used**, list only the apps active for this module (coherence principle).
8. Run the **Accessibility checklist** during Phase 3 build.
9. Add a **References** section with brief §§, framework citations, and `D-XXX` decision references.
10. For Modules 5 + 6 only: add an `> Evidence note:` blockquote near the top citing §12 / §19 brief content as evidence substrate + Phase 5 cohort-1 Gong validation hook (per critic issue (c) `critic-log.md` Phase 1 Pass 1).
