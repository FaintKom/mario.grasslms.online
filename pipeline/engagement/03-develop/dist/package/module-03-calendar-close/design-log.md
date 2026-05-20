# Module 3 · M3 Calendar Close · design log

> Implementation-side decisions made during Phase 3 build. Read alongside the
> storyboard (`02-design/module-storyboards/M3-calendar-close.md`) and the
> shell docs (`03-develop/scorm-shell/README.md`).

## D-M3-01 · Habit gate UI: disabled button vs warning toast

**Decision.** The Dial button is rendered in a **disabled-but-focusable**
state until the Calendar app opens. We deliberately did *not* use a
transient warning toast.

**Why disabled-button wins for habit formation.**

| Affordance | What it teaches |
|---|---|
| **Disabled-button (chosen)** | The habit is the *precondition*. There is no path to dial without Calendar open. Friction is felt up-front, every time, which is exactly how a habit installs (Wood & Rünger 2016 on cue-contingent automaticity). |
| Warning toast on dial-without-calendar | Teaches the rep that the system tolerates the slip but disapproves. The rep can dismiss the toast and continue. Habit never installs because the cue (Calendar) and the response (dial) are not coupled. |
| Hard-error modal | Punitive · breaks Mayer coherence · violates §10.5 anti-public-shaming signal. |

**A11y mechanics of the disabled state** (per `ux-design-system.md` §9 +
WCAG 2.1 SC 1.3.1 / 4.1.2):

- The button uses **`aria-disabled="true"`**, *not* the `disabled` HTML
  attribute. This keeps the element **in the Tab order**.
- It carries **`aria-describedby="dial-gate-hint"`**, pointing to a visually
  hidden `<div id="dial-gate-hint">` in `index.html`. Screen readers (NVDA,
  JAWS, VoiceOver) announce the reason text every time the button receives
  focus: *"Open the Calendar app before dialling. Calendar must be in a
  second window — that is the habit. The Dial button enables the moment
  Calendar opens."*
- A `click` handler is bound but no-ops when `aria-disabled === "true"`,
  and re-announces the rule into `#focus-announcer` (the
  `aria-live="polite"` region) so a sighted keyboard rep also hears why
  nothing happened.
- Visual state uses a diagonal-stripe overlay + a "Calendar required" mono
  pill in muted red. Focus-ring is *never* removed — keyboard users see
  the focus indicator even on the gated state (WCAG 2.4.7).
- Once Calendar opens, `aria-disabled` flips to `"false"`, the stripe is
  removed, and the gate coach-mark dismisses itself.

This pattern is the same one the W3C ARIA Authoring Practices Guide
recommends for "input-blocked-pending-precondition" actions.

## D-M3-02 · LO-M3.1 is event-log only, not quizzed

**Decision.** The quiz has **3 items** covering **LO-M3.2** (state two
slots + send during call) and **LO-M3.3** (recognise the cost of
delayed-invite anti-patterns). **LO-M3.1** (open Calendar pre-dial · habit)
is *not* on the quiz.

**Why.**

- **A quiz cannot evidence a habit.** A multiple-choice item asking
  "should you open Calendar before dialling?" has only one defensible
  answer and produces no signal. Every rep will tick yes; the item
  discriminates nothing (`l2-quiz-blueprint.md` discrimination floor).
- **The solo problem already evidences it.** The mini-OS dial button is
  hard-gated on `calendar_opened` firing. The KPI
  `calendar_open_before_dial` flips boolean *in the event log* the moment
  the rep dials. That is the assessment — and it is behavioural, not
  declarative.
- **Mager ABCD compliance.** LO-M3.1's `D` (degree) is "100 % of dial
  sequences start with Calendar already open" — instrumented, not
  multiple-choice (see `learning-outcomes-abcd-bloom.md` §4.3).
- **Cohort-time budget.** With three items at ~30 s each, the quiz fits
  in the 0:30 slot at 9:00–9:30. Adding a fourth nominal item to "cover"
  LO-M3.1 would steal time from the more diagnostic LO-M3.2/LO-M3.3 items.

The L3 manager rubric *does* score the habit (rubric row M3, anchor 4-5
prerequisite). That is the right place — manager observation captures
"did you actually open Calendar?" without the rep gaming the answer.

## D-M3-03 · Dry-run timing budget

| Slice | Budget | Actual (dry-run pacing) | Notes |
|---|---|---|---|
| 0:00–0:30 Gain attention | 0:30 | ~0:25 | Outreach ping + M.G. quote; quick. |
| 0:30–1:00 State outcome | 0:30 | ~0:30 | Two bullets + key line. |
| 1:00–1:30 Recall prior | 0:30 | ~0:25 | 3-row M1/M2/M3 recap. |
| 1:30–3:00 Worked example | 1:30 | ~1:45 | Reading the transcript is the long pole; transcript trimmed to 9 turns to stay close to budget. |
| 3:00–5:00 Completion problem | 2:00 | ~1:30 | 4 options × ~10 s read + 30 s feedback. |
| 5:00–8:00 Solo problem | 3:00 | ~2:45 | Habit-gate ~10 s · slot picker ~20 s · Salesforce modal ~15 s. |
| 8:00–9:00 Feedback timeline | 1:00 | ~0:45 | 4–6 timeline entries. |
| 9:00–9:30 Quiz (3 items) | 0:30 | ~1:00 | Honest: 3 items × ~20 s is slightly over; acceptable slip — quiz is the assessment. |
| 9:30–10:00 Key takeaway + L1 | 0:30 | ~0:25 | One quote card + retention card. |
| **Total** | **10:00** | **~9:50** | Within the brief §7 ≤10-min cohort tolerance. |

Acknowledged slip: the quiz slot is ~30 s over budget; the worked-example
slot is ~15 s over. Both are recoverable by trimming the GC-01 transcript
turns 2–3 in Phase 4 cohort-1 review if pacing data shows median rep
exceeds 10:00.

## D-M3-04 · A11y note on the disabled-dial-button

Repeated here for the Phase 3 a11y audit checklist
(`scorm-shell/a11y-audit.md`):

- **Keyboard reachable.** Yes — `aria-disabled="true"` is used instead of
  `disabled`. Verified Tab order in `index.html` reaches the button after
  the Outreach lead-list and before the "Open Calendar" sibling button.
- **Announces reason on focus.** Yes — `aria-describedby="dial-gate-hint"`
  points to a `.sr-only` `<div>` containing the rule text. NVDA + JAWS
  both read it on focus.
- **Announces reason on attempted click.** Yes — the click handler writes
  the rule into `#focus-announcer` (`aria-live="polite"`) on gated clicks.
- **Visual state has 3:1 minimum contrast.** Yes — stripe pattern uses
  rgba(180,35,24, 0.16) over `--ftc-surface` `#f6f8fa` and the
  "Calendar required" pill uses `--ftc-danger-muted` `#b42318` on
  rgba(180,35,24,0.12), measured ≥ 5.1:1.
- **Focus indicator never suppressed.** Yes — `.dial-button:focus-visible`
  applies a 3 px `--ftc-green-dark` outline at `outline-offset: 3px` in
  every state, including `aria-disabled="true"`.
- **Reduced motion honoured.** Yes — the gate coach-mark has no motion;
  the diagonal stripe is a static gradient.

## D-M3-05 · Event ordering invariant

The runtime enforces the following partial order on the solo-problem
event log; analytics in Phase 5 read this ordering as a correctness check.

```
calendar_opened
    └── phone_dial_attempt { calendar_open_before_dial: true }
            └── slots_stated  (×2)
                    └── invite_sent
                            └── next_step_booked_set
                                    └── solo_problem_completed
```

If `phone_dial_attempt` precedes `calendar_opened`, the gate is broken and
LO-M3.1 fails — but in the current build the disabled-button gate makes
that path unreachable in normal use. A separate "broken gate" smoke test
sits in the Phase 3 a11y audit pack and forces the failure path by JS-
toggling `aria-disabled` to verify telemetry still records it accurately.

## References

- Brief §§10.1, 10.5, 11 (GC-01/03/10/11/19/22), 15.1, 18.2, 18.3.
- `02-design/module-storyboards/M3-calendar-close.md`.
- `02-design/learning-outcomes-abcd-bloom.md` §4.3 (LO-M3.1 + LO-M3.2).
- `02-design/ux-design-system.md` §§1, 6, 9.
- `03-develop/scorm-shell/event-log-spec.md`.
- W3C ARIA Authoring Practices Guide — "disabled-but-focusable" pattern.
- Wood, W., & Rünger, D. (2016). "Psychology of habit." *Annual Review of
  Psychology*, 67, 289–314.
- Decisions inherited: `D-005` custom SCORM · `D-006` no audio ·
  `D-007` mini-OS.
