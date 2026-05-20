# Module 6 · Regulatory Deflection · design log

> Decisions, trade-offs and open issues for the M6 build.
> Companion to `02-design/module-storyboards/M6-regulatory-deflection.md`
> and `02-design/4cid-blueprint.md` §3.1 (Class 6).
> Engineering target: SCORM 1.2 · vanilla HTML/CSS/ES2022 · ≤ 10 min · WCAG 2.1 AA.

## 1 · The defining decision · always-visible job aid

**Decision.** The §19 deflection table is rendered as a sticky right-rail
panel that is visible across every Gagné segment of the module —
including the trigger, the worked example, the drill, the solo problem,
the feedback timeline, **and the quiz**. The panel defaults open and is
collapsible (but not closable).

**Why.** Per Rossett & Schafer (2007) *Job Aids and Performance Support*,
the learning objective for Class-6 work is **performance with the aid in
hand**, not memorisation. Module 6 inverts the canonical mastery pattern
that the other modules use — there is no "ok now you've practised, close
the cheat-sheet and do it from memory" beat. The §19 carve-out (brief
§19, "Honest carve-out for sales reps: if a regulatory question goes
deeper than the table above, the rep should defer to compliance — never
invent answers") makes memorisation actively wrong: a rep who has
internalised §19 is a rep who will improvise PSD2 specifics on a live
call and lose the deal to procurement (see `data/transcripts.json`
contrast example).

**Consequence.** The quiz items in `data/quiz.json` carry an
`open_job_aid: true` flag, and `module.js` `step9_quiz()` renders a
green "OPEN-JOB-AID" banner above each stem so the rep is **explicitly
told** they can read the panel while answering. This is a deliberate
departure from M1–M5's closed-book quiz pattern.

## 2 · Layout choice · sticky right rail, not modal overlay

**Decision.** The job aid lives in `<aside id="job-aid-panel">` as a
sticky 360px right rail (CSS grid `1fr 360px`). It is *not* a
modal/dialog; it is *not* a tooltip on hover; it is *not* hidden behind
a "Show job aid" button.

**Why.** Three failure modes a non-sticky design would create:

1. *"I forgot it was there."* — if the panel is behind a button, the
   rep's working memory has to remember to open it, which inverts the
   point.
2. *"Where did it go?"* — modal overlays block the call surface. The rep
   needs to be looking at the buyer question (left) and the §19 row
   (right) **simultaneously** (Mayer spatial-contiguity, ch. 8).
3. *"I never saw it during the quiz."* — modals dismiss on answer-pick.
   The quiz is the exact moment the aid must be visible.

**A11y compromise.** The collapse button is provided for low-vision
users who use heavy zoom and need viewport space, with `aria-expanded`
state. Default is open; once collapsed the panel stays at a 60px header
strip so the rep can re-expand without hunting for a hidden control.
Below 1024px (card-stack mode per `ux-design-system.md` §3.1), the
panel moves below the desktop but remains in tab-order — never hidden.

## 3 · Open-quiz-aid · explicit signalling

**Decision.** Every quiz item shows a small green pill `OPEN-JOB-AID ·
the panel on your right stays visible` above the stem.

**Why.** Reps coming from M1–M5 have learned "closed-book quiz =
norm". Without explicit signalling, some will avoid the panel out of
test-taking habit and degrade their score. The pill resets the schema
in working memory: this is an open-book module by design, not by
oversight.

**Evidence link.** Maps to LO-REG.1 + LO-REG.2 per
`02-design/learning-outcomes-abcd-bloom.md` §4.6 (the LOs are explicit
that the deflection is delivered "with the regulatory deflection job
aid open in the mini-OS pinned-Slack channel").

## 4 · Escalate-button affordance · Slack DM scaffold pattern

**Decision.** The Escalate-to-Compliance button is rendered twice:
once inside the always-visible job-aid panel (global affordance) and
once inline within the solo problem's response options (situational
affordance). Clicking either reveals a modal containing a copy-ready
Slack DM scaffold.

**Why.** Two failure modes the scaffold prevents:

1. *Escalation-decision-without-action* — a rep ticks "escalate" in
   their head, finishes the call, and forgets to actually message
   compliance. The scaffold makes the action concrete, copy-able,
   and 5-seconds-away.
2. *Wrong-channel escalation* — without the template, reps tend to
   email compliance after the call ("I'll send a note later"), which
   collapses into the same M3 follow-up failure pattern (brief §10.4
   P.B.: "I'll send pricing"). The Slack DM template forces *during-the-call*
   escalation, addressed to `#compliance`, with a calendar booking implied.

**Telemetry.** `reg_question_escalated` event (per
`scorm-shell/event-log-spec.md` §2) fires when the button is clicked,
with `payload.invitee = "#compliance"`. Phase 5 Gong validation can
correlate this event with actual Slack DM volume.

## 5 · Phase 5 validation-hook annotation

**Decision.** The "State outcome" segment (`step2_statedOutcome`) renders
an explicit Evidence Note pill: *"Reg scenarios derived from §19; Phase
5 validates against the first cohort's Gong reg-question corpus."*

**Why.** Per `02-design/module-storyboards/M6-regulatory-deflection.md`
top-of-file blockquote and `01-analyze/critic-log.md` Phase 1 Pass 1
issue (c) — §11 of the brief contains zero Gong calls with
regulatory-deflection content. The deflection task class is derived
from §19 + §12.4 substrate alone. Phase 5 cohort-1 Gong listening
(A.S. + M.B., weeks 5–8) generates the actual base-rate corpus.

The annotation is shown to the rep *because* honesty about the
evidence chain is itself part of the brand voice (§18.1: "concedes
weakness when it builds trust"). If, by Phase 6, the cohort-1 corpus
shows the 5-row table covers < 80% of buyer reg questions, the v2
backlog (`02-design/rubric-design.md` §5) extends the table.

## 6 · Dry-run timing · 10:00 budget

| Segment | Budget | Notes |
|---|---|---|
| 1 · Gain attention | 0:00–0:30 | One trigger card; one "Continue" click. |
| 2 · State outcome | 0:30–1:00 | Three-line outcome list + Evidence Note. |
| 3 · Recall prior | 1:00–1:30 | M2 callback; one paragraph. |
| 4-5 · Worked example | 1:30–3:00 | Side-by-side worked + contrast cards; 90s reading. |
| 6 · D6 drill | 3:00–5:30 | 5 cards × 30s = 2:30. Tight but feasible (drill = 5 taps). |
| 6 · Solo problem | 5:30–8:30 | 3 sequential Lukas questions × ~60s. |
| 7 · Feedback | 8:30–9:00 | Timeline table; no input required. |
| 8 · Quiz | 9:00–9:30 | 3 items × 10s with the panel open. |
| 9 · Key takeaway | 9:30–10:00 | Takeaway card + score + +7d hook. |

Total: **10:00**, with ~30s slack absorbed by between-segment "Continue"
clicks. Stays within brief §7 cohort tolerance (≤ 10 min). Manifest
declares `maxtimeallowed=00:10:30` to absorb tab-switch overhead under
SCORM 1.2 timing.

## 7 · Accessibility (WCAG 2.1 AA) notes

- **Job-aid panel** is a semantic `<aside>` with `aria-label` + a
  semantic `<table>` with `<th scope="row">` per acronym (per
  M6-regulatory-deflection.md §accessibility-checklist row 1).
- **Collapse control** has `aria-expanded` + `aria-controls`. Default
  open; the collapsed state retains the header strip so users can
  re-expand without hunting.
- **Escalate-modal** is `role="dialog" aria-modal="true"`; closes on
  Escape (WCAG 2.1.2 No Keyboard Trap); the scaffold `<pre>` is
  `tabindex="0"` so screen-reader users can read it inline.
- **Drill + solo + quiz options** are real `<button>` elements (never
  `<div onclick>` per `ux-design-system.md` §9.4 "Robust").
- **Live regions** — `#focus-announcer` (inherited from shell) +
  `#module-progress` carry `aria-live="polite"` so timer + section
  changes are announced without interrupting input.
- **Contrast** — verified against `--ftc-green-primary` 4.55:1 on white
  (AA) per ux-design-system.md §1.
- **Reduced-motion** — `prefers-reduced-motion: reduce` disables hover
  transitions on options + drill cards (styles.css final block).
- **Keyboard** — every interactive element reachable via Tab; first
  focusable element auto-focuses on each segment (`setStage` final
  line); the global F6 / Ctrl+Tab window-cycle handler is inherited
  from shell.js.

## 8 · Open issues / v2 backlog

| # | Issue | Action |
|---|---|---|
| O-1 | The escalate-button label is text-only. A second-language pod (DE, ES) will hit a translation gap before v2. | Backlog for v2 ES + DE per brief §3 v1.0 EN-only constraint. |
| O-2 | Per `02-design/rubric-design.md` §5, the L3 manager rubric has 3 rows (M1/M2/M3) per `D-004`. A 4th row for "regulatory deflection" is on the v2 backlog pending cohort-1 Gong validation. M6 telemetry is in place; rubric integration is downstream. | Phase 6. |
| O-3 | The drill set is 5 cards (one per §19 acronym + one escalate distractor). If Phase 5 surfaces > 1 frequent reg question per acronym, the drill expands to 8–10 cards in v2. | Drill-card schema in `data/quiz.json` is extensible — only `module.js` `DRILL_CARDS` const needs update. |
| O-4 | The `data/prospects.json` "Priya" record is currently unused by v1 module.js (only Lukas drives the trigger + solo). Reserved for v2 variability practice when the cohort budget allows a 12-min Module 6 expansion. | Phase 7. |
| O-5 | `+7-day mini-quiz` is described in the takeaway card but is implemented by the LMS scheduler (Sana cohort-API), not by this module. The module fires the L1 pulse trigger via `module_completed` event; the LMS picks it up. | Out of module scope; documented in `05-evaluate/l1-pulse-survey.md`. |

## 9 · Frameworks + evidence references

- **Rossett & Schafer (2007)** · *Job Aids and Performance Support* — the
  defining citation for §1 (always-visible aid). The §19 table is the
  job aid; the module's job is to teach point-of-use lookup, not recall.
- **Mayer (2014)** · *Cambridge Handbook of Multimedia Learning* — ch. 6
  signalling (job-aid row highlight); ch. 8 spatial contiguity (aid sits
  alongside the call surface); ch. 13 segmenting (one Gagné segment at a
  time); ch. 14 pre-training (the aid renders before segment 1 fires).
- **Gagné (1985)** · *The Conditions of Learning* — nine-event timeline
  scaffold (the 9 segments in `module.js`).
- **Van Merriënboer & Kirschner (2018)** · *Ten Steps to Complex Learning*
  3rd ed. — class-6 task placement + part-task drill D6 + supportive
  information (the table is supportive info, not memorised knowledge).
- **Brief evidence substrate** — §19 (the canonical 5-row table + honest
  carve-out); §12.4 (Lukas trigger line + low-trust profile); §13.4
  (regulatory positioning bridge); §18.1 (brand voice for the trust tone);
  §7 (≤ 10-min, WCAG 2.1 AA, no PII).
- **Decisions honored** · `D-002` (4C/ID), `D-004` (3-row v1 rubric with
  v2 escape), `D-005` (custom SCORM), `D-006` (no audio), `D-007` (mini-OS
  + job aids).
