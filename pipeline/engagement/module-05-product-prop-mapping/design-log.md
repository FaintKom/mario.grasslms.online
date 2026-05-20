# Module 5 · Product Prop Mapping · design log

> Why this artefact: captures the build-time decisions the storyboard didn't pin down. Every entry names a decision, the trade-off considered, and the inputs that drove it (brief §, Phase 2 design artefact, or Phase 1 critic-log issue). Read alongside `02-design/module-storyboards/M5-product-prop-mapping.md` and `03-develop/scorm-shell/README.md`.

---

## 1 · Evidence-note placement (per Phase 2 critic issue (c))

**Decision.** The Evidence note appears twice — once briefly during *State Outcome* (0:30, learner-facing yellow callout in the overlay), once verbatim in this design log. It does **not** appear in the worked-example screen because the learner is mid-pattern-recognition there and the note would compete with the Mayer signalling cues already firing.

**Trade-off considered.**
- *Hide it entirely from cohort copy* — rejected. The brief explicitly asks for the Evidence note to be visible to the learner so cohort-1 reps know the multi-stakeholder pattern is provisional pending Gong validation. Hiding it would feel like the program over-claims base rates.
- *Show it on every screen* — rejected. Repetitive; violates Mayer coherence.
- *One brief learner-facing surface + one full design-log entry* — adopted. Surfaces honesty without overloading the cohort. Aligns with brief §18.2 *"Honest about hard parts"* and §18.1 *"Concedes weakness when it builds trust"*.

**Input.** Storyboard `> Evidence note:` blockquote + `critic-log.md` Phase 1 Pass 1 issue (c) + brief §11 (no multi-stakeholder Gong calls) + §12.2 / §12.3 (substrate archetypes).

---

## 2 · Multi-stakeholder UI affordance — Slack ping **and** phone-dialler chip (not either/or)

**Decision.** Use **both** the synthetic Slack ping in the overlay *and* the 2nd-participant chip in the phone-dialler card. The choreography is: (a) Slack ping appears first as a 1-line "S.K. joining" notification; (b) ~300 ms later the chip pops into the phone-dialler `m5-callers` row; (c) ARIA assertive live region announces it to AT users.

**Trade-off considered.**
- *Phone-dialler chip only* — rejected. The brief explicitly lists *Slack ping* + *Phone-dialler shows 2nd participant* as separate affordances. A learner who happens to be looking at the textarea for Tom would miss a silent chip change.
- *Slack ping only* — rejected. Loses the visceral "your call now has two participants" affordance that drives LO-PP.3 behaviour.
- *Both, sequenced* — adopted. The Slack ping carries the narrative ("S.K. is hopping on"), the chip carries the state ("the call is now multi-stakeholder"), the ARIA live region carries accessibility. Three cues = the Mayer redundancy compensation we already use for the no-audio constraint (`ux-design-system.md` §10).

**Cost.** ~40 extra lines in `module.js` (`triggerSecondStakeholder()`) + ~50 lines of CSS for `.m5-slack-ping` + `.m5-participant-chip[data-secondary]`. Worth it: it's the literal subject of LO-PP.3.

---

## 3 · Phase 5 cohort-1 validation hook · how it's annotated in code

**Decision.** Three surfaces carry the validation hook annotation:
1. Learner-facing *Evidence note* on the outcome screen (§1 above).
2. Code comments at the top of `module.js` and `imsmanifest.xml`.
3. The `Evidence note` in this design log + the storyboard reference card.

The KPI `m5_prop_pain_match_accuracy` is emitted to `cmi.suspend_data` via the shell event-log (`event-log-spec.md`). The Phase 5 analytics pipeline reads it alongside the cohort-1 Gong sample, generating the LO-PP.3 base-rate validation that `kirkpatrick-measurement-plan.md` Sprint 5.2 needs.

**Why it lives in code.** The validation hook is otherwise easy to drop on iteration. Putting it in `module.js` header comments + manifest XML means anyone editing M5 in v2 sees it. Aligns with brief §20 risk-register entry "Sponsor turnover — every phase summary documents decisions in writing".

---

## 4 · Dry-run timing — compressing the 90-second mid-call switch into ~10 seconds

**Decision.** The storyboard calls for *"~ 0:90 in, second stakeholder joins"*. In the SCO we compress this to **8 seconds** (`SECOND_JOIN_DELAY_MS = 8000`). The cohort budget is 10 minutes total; the solo problem block is 3 minutes; spending 90 of those 180 seconds on monologue is not a realistic schedule. Eight seconds is enough that the learner orients to Tom and starts typing a diagnostic but hasn't completed it.

**Trade-off considered.**
- *Full 90 s wait* — rejected. Cohort tolerance ≤ 10 min (brief §7) breaks. Also dead-air UX.
- *No delay, S.K. on screen from start* — rejected. Destroys the LO-PP.3 stakeholder-switch surprise that the module is built around.
- *Compressed 8 s* — adopted. Preserves the cognitive event ("a second voice arrives") without burning the cohort budget.

**Verification at cohort 1.** Manager interview will ask: *"Did the mid-call join feel surprising enough?"* If ≥ 4/5 cohort 1 reps say "I saw it coming, no surprise", the timing is reset to 12–15 s. The variable lives at the top of `module.js` precisely so this re-tune is one line.

---

## 5 · Accessibility (WCAG 2.1 AA · `ux-design-system.md` §9)

**Decision rationale per checkbox:**

- [x] **Second-voice arrival announced via `aria-live="assertive"`.** Implemented via `#m5-stakeholder-announcer`. Assertive (not polite) per storyboard checklist — the new stakeholder *interrupts* the prior cognitive thread; assistive tech users need the same interruption.
- [x] **`Users`-equivalent icon `aria-label="Second stakeholder joined the call"`.** The 2nd-participant chip uses `data-secondary="true"` + textual content "S.K. (finance)" so screen readers announce the speaker directly. The 👥 glyph on `.m5-stakeholder-join` is decorative (`::before`) and not in the AT tree.
- [x] **4-prop decision card reachable.** `<ol>` rows; the sticky sidebar is in normal tab order via the overlay's `tabindex="0"` transcript region.
- [x] **Jargon detector flag uses `aria-live="polite"`.** Implemented on `#m5-jargon-tom` / `#m5-jargon-sarah`.
- [x] **Multi-stakeholder rubric matrix has labelled columns.** The feedback table uses `<th scope="row">` per row and `<th>` headers per column.
- [x] **Tab order.** Trigger → outcome → recall → worked-example transcript → drill (pains then slots) → solo (Tom prompt → S.K. prompt → invite) → feedback → quiz → takeaway → L1 pulse → finish.
- [x] **Drill is keyboard-operable without drag.** Each `.m5-pain` is `tabindex="0"` + `role="button"`; pressing `1`/`2`/`3`/`4` commits the mapping. The pointer drag is a bonus, not the primary interaction.
- [x] **Contrast.** All text on `--ftc-paper` background uses `--ftc-ink` (19.2:1) or `--ftc-ink-2` (7.6:1). Primary green CTA on white = 4.55:1 (AA verified, `ux-design-system.md` §1).
- [x] **`prefers-reduced-motion: reduce`.** Honored — the `.m5-participant-chip[data-secondary="true"]` pop animation switches to instant render.
- [x] **Focus visible.** `.m5-overlay :focus-visible { outline: 3px solid var(--ftc-green-primary); }` never overridden.
- [x] **Skip links.** Two skip links in `index.html` (skip to main, skip to module stage).

---

## 6 · What was deliberately *not* built in v1

| Not built | Why | When |
|---|---|---|
| Secondary pairing variant (Emma + A.B. bookkeeper) as full solo problem | Prospects + transcripts + drill bank reference it; full-fidelity scenario would double SCO size. v1 ships the founder + finance variant only. | v2 after cohort-1 validation. Profile + signalling are wired so the variant only needs scenario branching in `module.js`. |
| Phone-dialler silence countdown overlay | M5 isn't an M1 silence-tolerance module. Drawing the silence widget would confuse the dominant cognitive task (prop mapping under stakeholder load). | Stays in M1 — never re-shown in M5. |
| Audio version of multi-voice transcript | `D-006` no audio. | v2 if budget allows; per `ux-design-system.md` §10. |
| Adaptive sequencing (skip drill if D5 ≥ 95 % on first 3 cards) | Cohort size 10–15 doesn't power per-rep adaptation per `4cid-blueprint.md` §3.2. | Phase 6 iteration backlog. |

---

## 7 · File inventory + line-count budget

| File | Purpose | Approx LOC |
|---|---|---|
| `imsmanifest.xml` | SCORM 1.2 manifest | ~75 |
| `index.html` | Boot HTML + DOM contract | ~40 |
| `styles.css` | M5 overlays + drill + 2nd-participant chip | ~470 |
| `module.js` | Gagné timeline + drill + solo + quiz | ~560 |
| `data/transcripts.json` | Worked + contrast multi-voice | ~50 |
| `data/prospects.json` | Tom + S.K. + Emma + A.B. profiles | ~75 |
| `data/prop-pain-bank.json` | 6 pains + 3 distractors + props ref | ~70 |
| `data/quiz.json` | 3 scenario items LO-PP.1/.2/.3 | ~40 |
| `design-log.md` | This file | ~145 |

Runtime (HTML+CSS+JS) ≈ 1,070 lines — within the 700–1,100-line target. Data + manifest + design-log are out-of-band.

---

## 8 · References

- Brief §§ 5, 7, 9, 10.2 (L.D.), 11, 12.2 (Tom), 12.3 (Emma), 13.1 (4 props), 18.1, 18.2, 18.3, 20.
- `02-design/module-storyboards/M5-product-prop-mapping.md` (storyboard + Evidence note).
- `02-design/module-storyboards/_template.md`.
- `02-design/learning-outcomes-abcd-bloom.md` §4.5 (LO-PP.1 / LO-PP.2 / LO-PP.3 / LO-PP.4) + §5 (T6 traceability + cohort-1 Gong validation hook on LO-PP.3).
- `02-design/4cid-blueprint.md` §3.1 Class 5, §6 D5 drill, §7 configural map.
- `02-design/ux-design-system.md` §3 (window manager), §6 (signalling), §9 (WCAG), §10 (no-audio compensation).
- `03-develop/scorm-shell/README.md` §3 (consumer surface), §4 (BootApi), §5 (event-log fields).
- `03-develop/scorm-shell/event-log-spec.md` (event names + KPI table).
- Decisions: `D-002`, `D-005`, `D-006`, `D-007`, `D-008`.
- Frameworks: Gagné (1985); Merrill (2002); Renkl & Atkinson (2003); Mayer (2014); Van Merriënboer & Kirschner (2018); Sweller (2011); CAST UDL; W3C WCAG 2.1.
