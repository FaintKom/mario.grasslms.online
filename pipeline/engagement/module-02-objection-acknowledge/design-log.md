# Module 2 · design log

> Why this artefact: a single page of the choices baked into M2, the evidence
> traces behind each choice, the dry-run timing of the 10-minute budget, and the
> open issues for the next reviewer. Owned by Mario; reviewed by A.S. for
> behavioural fidelity and K.M. for cohort tolerance.

## Identifier

- SCORM identifier: `FTC.SDR.M2.objection-acknowledge.v1`
- Storyboard: `02-design/module-storyboards/M2-objection-acknowledge.md`
- Outcomes: T3 · LO-M2.1 · LO-M2.2 · LO-M2.3 (`02-design/learning-outcomes-abcd-bloom.md`)
- Shell: `03-develop/scorm-shell/` (D-005 custom SCORM, D-007 mini-OS)

## File map

| File | Purpose | Approx. lines |
|---|---|---|
| `imsmanifest.xml` | SCORM 1.2 package manifest | 50 |
| `index.html` | SCO entry · mounts shell DOM + `#m2-stage` panel | 55 |
| `module.js` | Gagné timeline · 10 stages · event-log emissions | 450 |
| `styles.css` | Overlay styles · objection-bank UI · debrief cards | 280 |
| `data/transcripts.json` | GC-06 · GC-06b · GC-09 · GC-19 | 65 |
| `data/prospects.json` | Tom + secondary Sven | 40 |
| `data/objection-bank.json` | 5 archetype objections × ideal phrases + anti-patterns | 70 |
| `data/quiz.json` | 3 LO-evidenced items | 45 |
| `design-log.md` | this file | 110 |

## Decisions

### D-M2.01 · Two worked examples, not one

**Choice.** Show GC-06 (L.D. + Tom · Brex) *and* GC-06b (M.G. + Maria · Visa)
back-to-back before the completion problem.

**Why.** Van Merriënboer's 4C/ID variability-of-demonstration principle:
schema transfer is unreliable from a single exemplar. Pairing a competitor-
displacement objection (Class 4 variant) with a bank-card objection (Class 3
canonical) forces the rep to abstract the *acknowledge-then-ask* shape.

**Evidence.** Brief §10.1 (M.G. verbatim), §10.2 (L.D. verbatim), §11 GC-01 +
GC-06 outcomes; Renkl & Atkinson (2003).

### D-M2.02 · Restate scoring by word-overlap, not by exact match

**Choice.** `restate_word_overlap` event fires the live count of buyer-noun
tokens echoed in the rep's restate, plus a rebuttal-token detector.
Threshold: ≥ 2 overlap + 0 rebuttal tokens = anchor 4 on M2 rubric.

**Why.** A typed-string-exact-match scorer would penalise valid synonyms and
reward parroting. The rep cohort uses voice paraphrase; we score the
*pattern* (re-uses buyer nouns; contains no "but/however/cheaper/lower"), not
the spelling. Matches L3 rubric anchor 4–5 (`l3-call-rubric.md` row M2) without
requiring NLP.

**Stopword list + rebuttal-token list** kept inline in `module.js` so cohort 1
managers can tune without redeploying the shell.

### D-M2.03 · Anti-pattern toggle, not anti-pattern by default

**Choice.** GC-19 P.B. contrast clip is hidden by default behind a "Show what
NOT to do" toggle in the solo problem. Reps with anchor 4–5 can skip it; reps
with anchor 1–3 self-select into it.

**Why.** Per `cognitive-load-analysis.md` extraneous-load rule + Sweller's
worked-example effect: showing both the right and the wrong move
simultaneously doubles the schema load. Failure-mode framing belongs *before*
the worked example (trigger scenario, stage 1) and *as optional contrast*
after the attempt — not in the middle.

**Evidence.** §10.4 P.B. — *"I argue. I know I'm not supposed to. I just
don't have anything better loaded."* — quoted verbatim in the toggle and the
debrief stage.

### D-M2.04 · Solo problem is random across 5 families

**Choice.** Each solo attempt picks one of 5 objection families at random
(`bank_visa`, `competitor_brex`, `accountant_friction`, `trust_fintech`,
`comp_distraction`). Re-take attempts produce a different objection.

**Why.** Variability of practice + interleaving (Van Merriënboer 2018 ch. 7;
Rohrer & Taylor 2007). Blocked practice on one objection family overfits the
rep to one verbatim restate.

### D-M2.05 · Mini-OS apps launched: Gong + Phone-dialler + Slack

**Choice.** M2 boots three mini-OS apps. Outreach and LinkedIn/Companies House
are intentionally omitted — pre-dial signal-scanning is M1's job.

**Why.** Mayer coherence: only show apps used in the scenario. Gong hosts the
worked-example transcript; Phone-dialler hosts the live solo turn; Slack
exposes the pinned 5-family objection-inventory job aid (Rossett & Schafer
2007).

## Evidence sources

| Element | Source |
|---|---|
| Worked example A (Tom/Brex) | §10.2 L.D. verbatim · §11 GC-06 · §12.2 Tom archetype |
| Worked example B (Maria/Visa) | §10.1 M.G. verbatim · §12.1 Maria archetype |
| Trigger failure clip | §11 GC-09 H.K. (mid-band, argued) |
| Anti-pattern contrast clip | §11 GC-19 P.B. (bottom-quartile, argued on fees) |
| Anti-pattern verbatim | §10.4 P.B. "I argue. I know I'm not supposed to." |
| Completion-problem options | GC-06 (correct) · GC-19 (A) · GC-12 deflect (C) · §10.4 dismiss (D) |
| Solo objection bank | §12.1–§12.4 archetype top objections + §11 patterns |
| LOs + ABCD/Bloom tagging | `02-design/learning-outcomes-abcd-bloom.md` §4.2 |
| Brand voice | §18.2 peer-to-peer · §18.3 green `#00b67a` + Phosphor icons |
| WCAG 2.1 AA | brief §7 · `02-design/ux-design-system.md` §9 |

## Dry-run timing (Mario, solo walkthrough, no a11y reader)

| Stage | Budget | Observed | Note |
|---|---|---|---|
| 1 · trigger (GC-09) | 0:30 | 0:28 | within budget |
| 2 · outcome | 0:30 | 0:18 | one-screen card |
| 3 · recall (M1) | 0:30 | 0:22 | |
| 4 · worked A (Brex) | 0:45 | 0:48 | slight over · acceptable |
| 5 · worked B (Visa) | 0:45 | 0:42 | |
| 6 · completion (Tom) | 2:00 | 1:35 | feedback re-reads add a few seconds for slower reps |
| 7 · solo (random) | 3:00 | 2:48 | classify + type-restate combined |
| 8 · debrief | 1:00 | 0:45 | self-score radio |
| 9 · quiz (3 items) | 0:30 | 0:55 | over by 25 s · acceptable for first L2 attempt |
| 10 · retention card | 0:30 | 0:20 | |
| **Total** | **10:00** | **9:19** | inside the brief §7 cohort tolerance |

NVDA pass adds an estimated +60–90 s for reps using a screen reader; still
inside budget at ~ 10:30 worst case. To be confirmed in the Phase 3 a11y
sweep against `03-develop/scorm-shell/a11y-audit.md`.

## Event-log emissions (Phase 5 analytics surface)

| Event | LO | When |
|---|---|---|
| `module_started` | — | boot |
| `worked_example_completed` | pacing | stages 4 + 5 |
| `objection_family_picked` | LO-M2.1 | solo stage classify |
| `restate_word_overlap` | LO-M2.2 | solo stage submit |
| `objection_restated` | LO-M2.2 (positive) | completion + solo |
| `objection_argued` | LO-M2.2 (negative) | completion + solo |
| `completion_problem_completed` | pacing | stage 6 |
| `solo_problem_completed` | pacing | stage 7 |
| `quiz_completed` | LO-M2.1/2/3 | stage 9 |
| `module_completed` | All LOs · score | retention card |

Persisted to `cmi.suspend_data` per `03-develop/scorm-shell/event-log-spec.md`
§1. KPI summary updated on every `record()`.

## Accessibility — explicit conformance points

- All interactive elements `role`-tagged · `aria-pressed` on family chooser ·
  `aria-checked` on option radios · `aria-expanded` on anti-pattern toggle.
- Restate input has `aria-describedby` pointing at the overlap meter, which is
  itself `aria-live="polite"`.
- Tab order: progress bar → heading → quote → family chooser → restate input →
  overlap meter → anti-pattern toggle → submit. Matches narrative order.
- Reduced-motion media query disables transitions on `.m2-stage`, `.m2-option`,
  `.btn`.
- Contrast: every token used is verified against `ux-design-system.md` §1
  (text ≥ 4.5:1, non-text UI ≥ 3:1). Failure-mode tint `#fff5f4` is background
  only; failure text uses `--ftc-danger-muted` `#b42318` (5.1:1 on white).

## Open issues / next reviewer

1. **NVDA + JAWS sweep.** Pending Phase 3 a11y audit. Suspect the
   family-chooser `aria-pressed` toggle states need a discrete announcement.
2. **Cohort 1 calibration of the rebuttal-token list.** Five tokens may
   under-detect "we'd actually" type rebuttals. Tune from cohort-1 Gong.
3. **Random solo pick reproducibility.** L3 rubric calibration needs the same
   objection across reps; consider a manager-set `?seed=` query param so
   pod-review sessions all hit the same objection.
4. **DE-language variant.** L.D.'s German-pod opener is in the §10.2 source;
   currently English-only. Queued for v2 post-pilot (brief §3 · ES + DE).
5. **Anti-pattern toggle adoption.** Phase 5 should track open rate; if < 20 %
   of reps open it, surface it earlier (e.g. inside completion feedback).

## References

- Brief §§5, 7, 10.1, 10.2, 10.4, 11 (GC-06, GC-09, GC-19), 12.1, 12.2, 12.3,
  12.4, 18.2, 18.3.
- `02-design/module-storyboards/M2-objection-acknowledge.md`.
- `02-design/learning-outcomes-abcd-bloom.md` §4.2 (LO-M2.1/2/3).
- `02-design/ux-design-system.md` §§1, 2, 5, 6, 8, 9.
- `03-develop/scorm-shell/README.md`, `event-log-spec.md`, `a11y-audit.md`.
- Decisions: D-005 (custom SCORM), D-006 (no audio), D-007 (mini-OS).
- Frameworks: Gagné (1985), Merrill (2002), Renkl & Atkinson (2003), Mayer
  (2014), Sweller, Ayres & Kalyuga (2011), Van Merriënboer & Kirschner (2018),
  Rohrer & Taylor (2007), CAST (2018), W3C WCAG 2.1.
