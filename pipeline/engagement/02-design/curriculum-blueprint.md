> Why this artefact: Curriculum blueprint built per Wiggins & McTighe's *Backwards Design* (2005) — Stage 1 (desired results) → Stage 2 (acceptable evidence) → Stage 3 (learning experiences). Inside Stage 3 each module follows Merrill's First Principles of Instruction (2002) inside a 4C/ID whole-task progression (`D-002`, Van Merriënboer & Kirschner 2018). The course-architecture table maps the six 4C/ID task classes from `01-analyze/task-inventory.md` §2 to the six modules, with variability axes per `frameworks-applied.md` §2 and spaced-retrieval drop schedule per §11.

# Curriculum blueprint · Backwards Design × 4C/ID × Merrill

## 1 · Stage 1 · Desired results

### 1.1 · Program terminal (T1)

Inherits `learning-outcomes-abcd-bloom.md` §2 verbatim:

> A newly-hired SDR executes the M1 + M2 + M3 keystone sequence on a live cold call against an SMB ICP buyer (Maria / Tom / Emma / Lukas) inside the rep's actual workstation, achieving ≥ 80 % Gong-tag adherence by week 8 of tenure.

### 1.2 · Module-level terminals (T2–T7)

| ID | Module | Terminal | Task class | Keystone |
|---|---|---|---|---|
| T2 | M1 Diagnostic Opener | Opens with buyer-specific diagnostic; tolerates 5-s silence | Class 2 — Cold receptive | M1 |
| T3 | M2 Objection Acknowledge | Restates in buyer's own words; surfaces broken thing | Class 3 — Cold hostile | M2 |
| T4 | M3 Calendar Close | Two slots aloud + invite sent during call | Class 1 + 2 close pattern | M3 |
| T5 | ICP Buyer Fit | Discriminates 4 archetypes; runs M1+M2+M3 under interleaved variability | Classes 2/3/4 integrated | M1+M2+M3 × ICP |
| T6 | Product Prop Mapping | Pain→prop mapping; multi-stakeholder dual diagnostic | Class 5 — Multi-stakeholder | M1+M2+M3 × Prop |
| T7 | Regulatory Deflection | §19 verbatim deflection; answer-vs-escalate decision | Class 6 — Reg deflection | Reg |

### 1.3 · Threshold concepts that must be crossed (per `frameworks-applied.md` §19)

- **"The diagnostic creates the pitch."** The rep does not pre-decide what to pitch — the buyer's answer to M1 selects which prop to deploy. Surfaced explicitly in M1.
- **"5 seconds of silence is where the deal happens."** Tolerating silence after the diagnostic — M.G. §10.1 verbatim. Threshold concept exposed in M1; reinforced in M4 / M5 interleaving.
- **"Acknowledge before respond."** Restate-then-question dissolves the argumentation reflex. Threshold in M2.
- **"Calendar in second tab is a habit, not a tool."** M3 sub-skill that habituates before the live close.
- **"Deflect to proof, never invent."** Regulatory questions are evidence-positions, not sales pitches. Threshold in M6.

---

## 2 · Stage 2 · Acceptable evidence (assessment alignment)

This is the column that pairs 1:1 with `05-evaluate/l2-quiz-blueprint.md` + `05-evaluate/l3-call-rubric.md` + `05-evaluate/l1-pulse-survey.md`. Wiggins's rule: never plan activities before evidence.

| Outcome | Evidence type | Instrument | L-level | Dashboard line |
|---|---|---|---|---|
| T1 | Behavioural performance on the rep's live calls | Gong `tag:diagnostic-opener` + `tag:objection-acknowledged` + `tag:calendar-booked` (brief §15.3) | L3 + L4 | Talk-track adherence ≥ 80 % (brief §5) |
| T2 | Manager-scored simulated calls in M1 module solo block + live calls | L3 rubric M1 row (1–5 anchors per `l3-call-rubric.md` §1) | L3 | Pod-rollup M1 anchor avg |
| T3 | Manager-scored sim + live | L3 rubric M2 row | L3 | M2 rubric avg ≥ 3.5 (brief §5) |
| T4 | Manager-scored sim + live + Salesforce `Next_Step_Booked__c = TRUE` | L3 rubric M3 row + Salesforce instrumentation | L3 + L4 | M3 close rate (mid-band ≥ 60 %) |
| T5 | Module 4 SCORM + drill D4 + interleaved solo problem | L2 first-attempt mastery + L3 across rows | L2 + L3 | L2 ≥ 80 % first attempt (brief §5) |
| T6 | Module 5 SCORM + drill D5 + multi-stakeholder sim | L2 + L3 + cohort-1 Gong validation hook | L2 + L3 | L2 ≥ 80 % first attempt; cohort-1 Gong substantiation |
| T7 | Module 6 SCORM + drill D6 + escalate-vs-answer decision | L2 decision-card lookup + cohort-1 Gong base-rate | L2 + (v2 rubric row backlog) | L2 ≥ 80 % first attempt |
| LO-M1.1..3 | Drill D1 + end-of-module quiz + +7-d mini-quiz | `l2-quiz-blueprint.md` §4.1 items | L2 | L2 first attempt ≥ 80 %, +7-d ≥ 70 % |
| LO-M2.1..3 | Drill D2 + quizzes | §4.2 items | L2 | Same |
| LO-M3.1..2 | Drill D3 + mini-OS event log + quizzes | §4.3 items + Salesforce | L2 + L4 proxy | Same + `Next_Step_Booked__c` |
| LO-ICP.1..4 | Drill D4 + interleaved sim + quizzes | §4.4 items | L2 | Same |
| LO-PP.1..4 | Drill D5 + multi-stakeholder sim + quizzes | §4.5 items | L2 + L3 cohort-1 hook | Same |
| LO-REG.1..2 | Drill D6 + escalate decision + quizzes | §4.6 items | L2 + cohort-1 Gong hook | Same |
| L1 (per module) | "I could use this on a call today" Likert + two open prompts | `l1-pulse-survey.md` | L1 (LTEM tier 3) | Q1 ≥ 4.0 / 5 (brief §5) |
| L4 ramp | Cohort comparison vs baseline | Salesforce `Ramp_Time__c` | L4 | ≤ 71 d 6-mo target |
| L4 retention | HRIS `Day_120_Retained` | HRIS rollup | L4 | ≥ 92 % 6-mo target |

**Backwards Design discipline.** Every outcome above has at least one evidence row. Any outcome that *cannot* produce evidence inside the existing tooling (per brief §7: no new tools) is rewritten or rejected. None were rejected; T6 + T7 carry cohort-1 Gong validation hooks for the v2 rubric extension question.

---

## 3 · Stage 3 · Learning experiences

### 3.1 · The canonical module structure (every module uses this)

Per Merrill's First Principles (2002), every module runs: **activate → demonstrate → apply → integrate** — anchored in a real-world problem. Inside the demonstrate/apply slices, Renkl & Atkinson's worked-example → completion → solo fading sequence runs (per `D-002` + `cognitive-load-analysis.md` §6). Gagné's Nine Events provides the second-level timing structure (see `module-storyboards/_template.md`).

| Merrill phase | Inside the 10-min module | Time slice | Gagné event |
|---|---|---|---|
| **Trigger (problem)** | Show the failure-mode call for this task class. Real Gong-style transcript with the move missing. | 0:00–0:30 | 1 Gain attention |
| **Activate** | One-sentence outcome state + callback to prior module's keystone | 0:30–1:30 | 2 State outcome · 3 Recall prior |
| **Demonstrate** | Worked-example transcript (M.G. or L.D. pattern). M-move highlighted via Mayer signalling. | 1:30–3:00 | 4 Present stimulus · 5 Guide |
| **Apply (completion)** | Same transcript, M-move redacted. Rep fills in. | 3:00–5:00 | 6 Elicit performance |
| **Apply (solo)** | New buyer profile inside mini-OS. Rep makes the call. | 5:00–8:00 | 6 Elicit performance (transfer level) |
| **Integrate (debrief)** | Rubric self-score + manager-rubric preview | 8:00–9:00 | 7 Feedback |
| **Assess** | 3-item end-of-module quiz | 9:00–9:30 | 8 Assess performance |
| **Retain** | Key-takeaway card + +7-day spaced quiz scheduled | 9:30–10:00 | 9 Enhance retention/transfer |

This is the storyboard-template scaffold every module inherits. See `02-design/module-storyboards/_template.md` for the seconds-level detail.

### 3.2 · Module-by-module narrative

#### Module 1 · M1 Diagnostic Opener

**Trigger.** Open with GC-19 / GC-20 style hang-up call (P.B. §10.4 verbatim: *"By the fourth I just started saying 'I know you're busy, but our card is cheaper than your bank's...' which I know is wrong but I don't know what else to say."*). The rep sees the failure mode they may have already done themselves.

**Activate.** State: "By the end of this 10 minutes you will open every cold call with a buyer-specific diagnostic and tolerate 5 seconds of silence." Recall prior: none (Module 1 anchors the program).

**Demonstrate.** Worked-example transcript: M.G. + Maria (retail SMB, §12.1). The diagnostic *"I noticed you've opened a second location in the last 6 months — who's approving expense reports across both stores now?"* is highlighted in green per the signalling system (`ux-design-system.md` §6). The 4-second silence is shown in the transcript as `[silence 0:04]` — Mayer signalling principle.

**Apply (completion).** Same Maria transcript, the diagnostic question redacted. Rep picks from 4 options (3 distractors are documented Gong failure patterns).

**Apply (solo).** New buyer: a different §12 archetype (Tom, Series-B founder). Rep opens mini-OS LinkedIn tab → identifies one signal → phrases the diagnostic → dials → tolerates silence. Mini-OS event log captures silence duration.

**Integrate.** Rubric self-score on M1 row. Preview: manager will score the rep's real calls on this rubric in week 2.

**Spaced-retrieval drop.** +7 days: 3 mini-quiz items, novel stems, same outcomes.

#### Module 2 · M2 Objection Acknowledge

**Trigger.** GC-09 (mid-band, H.K., argued and lost) or GC-17 (hung up at 0:22) — the argumentation failure mode.

**Activate.** "By the end of this 10 minutes you restate the buyer's objection in their own words and surface what's actually broken — instead of arguing."

**Recall prior.** "Last module you opened the call. This one assumes the buyer pushed back."

**Demonstrate.** M.G. transcript GC-01 — "so you've got the card-issuing side sorted" verbatim, M2 highlighted. L.D. GC-06 Brex displacement variant shown as second worked example. Two examples = variability, per 4C/ID.

**Apply (completion).** Buyer line: *"We already use Brex."* Rep picks the right one-sentence restatement from 4 options.

**Apply (solo).** New buyer + new objection family. Rep dials, hears objection, restates, asks the follow-up question, waits.

**Integrate.** Rubric self-score M2 row.

**Spaced-retrieval drop.** +7 days.

#### Module 3 · M3 Calendar Close

**Trigger.** GC-22 exit-interview style call ending in *"I'll follow up."* No re-engage.

**Activate.** "By the end of this 10 minutes the calendar invite goes out *during* the call."

**Recall prior.** "M1 opened. M2 kept the call alive. M3 turns it into pipeline."

**Demonstrate.** M.G. GC-01 close: *"You mentioned the bookkeeper is overwhelmed by Q-end — let me book 20 minutes Tuesday 11 to show your accountant the Xero sync."* The mini-OS Calendar app is shown side-by-side with the transcript (Mayer spatial contiguity).

**Apply (completion).** Buyer interest signal given. Rep picks the close from 4 options.

**Apply (solo).** Mini-OS: rep must open Calendar in second tab *before* dialling (instrumented). On the call, state two slots, send invite, see Salesforce `Next_Step_Booked__c` flip to TRUE.

**Integrate.** Rubric self-score M3 row.

**Spaced-retrieval drop.** +7 days.

#### Module 4 · ICP Buyer Fit

**Trigger.** Show a buyer signal-set with no archetype tag. Rep guesses; mini-OS reveals correct archetype with the §12 ideal opener.

**Activate.** "By the end of this 10 minutes you identify which of four buyers you're calling in under 5 seconds and run M1+M2+M3 against them."

**Recall prior.** M1 + M2 + M3 individually mastered. Now they get *interleaved* across archetypes.

**Demonstrate.** Four 30-second worked-example clips, one per archetype (Maria · Tom · Emma · Lukas).

**Apply (completion).** D4 drill — 20 archetype cards. ≥ 95 % required.

**Apply (solo).** Three calls back-to-back. Buyer archetype changes each call (interleaved per `task-inventory.md` §7). Same M1+M2+M3 sequence in each.

**Integrate.** Self-score across all three rubric rows × three archetypes.

**Spaced-retrieval drop.** +7 days.

#### Module 5 · Product Prop Mapping

> **Evidence note.** Task class 5 (multi-stakeholder) is derived from brief §12.3 (Emma — manufacturing operations head with bookkeeper dependency) and §12.2 (Tom — founder with finance team) rather than from a §11 Gong call. Cohort-1 Phase 5 hook: A.S. + M.B. weekly Gong sample weeks 5–8 to generate base-rate corpus for multi-stakeholder dual-diagnostic execution; degree threshold in `learning-outcomes-abcd-bloom.md` LO-PP.3 is re-validated against that corpus.

**Trigger.** A buyer says: *"Our bookkeeper re-keys every supplier receipt"* (Emma §12.3 verbatim). The rep has to pick the prop AND prepare for the accountant to join mid-call.

**Activate.** "By the end of this 10 minutes you map any stated pain to one of the 4 props in the buyer's own language, and you hold two simultaneous diagnostics on a multi-stakeholder call."

**Recall prior.** ICP archetype + M1+M2+M3 sequence locked. Now add prop-mapping + second voice.

**Demonstrate.** Worked example with Emma + her accountant joining at minute 3. Both diagnostics shown; both responses paired to props 4 + 1 (per §13.1). Job-aid (4-prop decision card) visible in mini-OS sidebar (per Rossett & Schafer 2007).

**Apply (completion).** D5 drill — 15 pain-to-prop cards.

**Apply (solo).** Multi-stakeholder simulated call. Both voices arrive on the line; rep handles each.

**Integrate.** Self-score; preview that L3 rubric M1 row will be scored *twice* (once per stakeholder) on real calls.

**Spaced-retrieval drop.** +7 days.

#### Module 6 · Regulatory Deflection

> **Evidence note.** Task class 6 is derived from brief §19 (regulatory deflection table) + §12.4 (Lukas — German hospitality, low-trust on fintechs). No §11 Gong call contains regulatory deflection content. Phase 5 hook: cohort-1 Gong listening (A.S. + M.B., weeks 5–8) generates the base-rate corpus; if buyer reg questions cover < 80 % of the §19 5-row table, v2 backlog extends the table; if a manager-rubric row is needed for "deflect-vs-escalate" decision quality, it is added as a 4th rubric row (current `D-004` constraint is 3 rows, revisited at Phase 6).

**Trigger.** Lukas §12.4 verbatim: *"I don't trust new fintechs with my money."* The rep has 3 seconds to identify this as a trust-row question (§19 KYC + bank-segregation row).

**Activate.** "By the end of this 10 minutes you respond to any KYC / AML / SCA / PSD2 / GDPR question with one sentence from a single sheet on your desktop — and you know when to escalate."

**Recall prior.** All keystone moves locked. Now: the regulatory question is *not* an objection (M2) and *not* a pain (M5). It is its own move class with its own deflection table.

**Demonstrate.** Five 20-second worked examples, one per acronym. Job aid (§19 table) visible in the mini-OS Slack-pinned channel — point-of-use, not memorised.

**Apply (completion).** D6 drill — 5 acronym cards.

**Apply (solo).** Five mini-OS calls. Two are non-reg buyer questions (distractor) — rep must *not* deflect. Three are reg-deflection cases. One contains a follow-up that requires Compliance escalation per the §19 "honest carve-out" — rep must escalate, not invent.

**Integrate.** Self-assessment; calibration with the §19 job aid.

**Spaced-retrieval drop.** +7 days.

---

## 4 · Course architecture table

| Week | Module | Task class (`task-inventory.md` §2) | Variability axis | Cohort time | Spaced-retrieval drop |
|---|---|---|---|---|---|
| W1 | M1 Diagnostic Opener | Class 2 — Cold receptive | UK behavioural-anchored vs DE quant-anchored diagnostic (per §10.1 vs §10.2) | ≤ 10 min | W2 — +7 d mini-quiz |
| W2 | M2 Objection Acknowledge | Class 3 — Cold hostile | 5 objection families (§10 / §12 spread) | ≤ 10 min | W3 — +7 d |
| W3 | M3 Calendar Close | Class 1 + 2 close pattern | Warm vs cold close stems | ≤ 10 min | W4 — +7 d |
| W4 | ICP Buyer Fit | Classes 2/3/4 integrated | 4 §12 archetypes interleaved | ≤ 10 min | W5 — +7 d |
| W5 | Product Prop Mapping | Class 5 — Multi-stakeholder | Founder+finance vs owner+accountant | ≤ 10 min | W6 — +7 d |
| W6 | Regulatory Deflection | Class 6 — Reg deflection | 5 §19 acronyms × 4 archetypes | ≤ 10 min | W7 — +7 d |
| W7 | (no new module) | — | — | — | All six +7-d quizzes complete by W7 |
| W8 | First live-call L3 rubric scoring window | — | — | — | (per `kirkpatrick-l4-l1-cascade.md` §3 — week 4–8 adherence window opens) |

**Module ordering rationale.**

- M1 → M2 → M3 sequenced **simple-to-complex by element-interactivity** (per `cognitive-load-analysis.md` §8). M1 = 5 elements; M2 = 6; M3 = 6; M4 = 7 (interleaved); M5 = 7 (multi-voice); M6 = 7 (reg overhead).
- Module 4 (ICP × variability) is the integration module — must follow M1+M2+M3 so the keystone schemas exist before being interleaved.
- Module 5 (multi-stakeholder) is gated behind Class 3 mastery per `cognitive-load-analysis.md` §8 — the rep cannot hold a second voice if M2 is not automated.
- Module 6 (regulatory deflection) comes last because the deflection move is *additive* to the keystone, not a replacement; it lands cleanest when the rep can already execute M1+M2+M3.

**Cohort time discipline.** Each module ≤ 10 min per brief §7. Per `cognitive-load-analysis.md` §7 the slice is ≈ 1 min activate + 3 min worked example + 2 min completion + 3 min solo + 1 min reflection.

**Spaced-retrieval drop schedule.** All six +7-day mini-quizzes are auto-scheduled by Sana on `cmi.core.lesson_status = completed`. No manual cohort management. Per `l2-quiz-blueprint.md` §8.

---

## 5 · Pre-training (Mayer pre-training principle)

Before Module 1 fires, the rep receives:

- The **ICP archetype card** (Maria / Tom / Emma / Lukas one-pager). 30 seconds of reading. Reduces extraneous load in Modules 1 + 4.
- The **3-move model card** (M1 / M2 / M3 + one-sentence definition each). 20 seconds. Recall scaffold for Module 1.

Both deliverables are 1-page job aids (Rossett & Schafer 2007). They live in the mini-OS pinned-Slack channel + the rep's actual desktop after launch.

---

## 6 · What this blueprint sends downstream

| Sends | To |
|---|---|
| Stage-2 evidence per outcome | `02-design/assessment-design.md` traceability matrix |
| Stage-3 narrative per module | `02-design/module-storyboards/M1..M6` (one per module) |
| Pre-training assets list (ICP card + 3-move card) | `02-design/ux-design-system.md` job-aid system |
| Module ordering + variability axes | `02-design/4cid-blueprint.md` task-class progression |
| Cohort-1 Gong validation hooks for M5 + M6 | `05-evaluate/kirkpatrick-measurement-plan.md` (Phase 5 sprint 5.2) |

## References

- Brief §§5, 7, 9, 10.1, 10.2, 10.4, 11, 12, 13.1, 18.1, 19.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.).
- Van Merriënboer, J. J. G., & Kirschner, P. A. (2018). *Ten steps to complex learning* (3rd ed.).
- Merrill, M. D. (2002). "First principles of instruction." *ETR&D*, 50(3), 43–59.
- Gagné, R. M. (1985). *The conditions of learning* (4th ed.).
- Mayer, R. E. (2014). *Cambridge Handbook of Multimedia Learning* (2nd ed.).
- Renkl, A., & Atkinson, R. K. (2003). *Educational Psychologist*, 38(1), 15–22.
- Roediger, H. L., & Karpicke, J. D. (2006). *Perspectives on Psychological Science*, 1(3), 181–210.
- Meyer, J. H. F., & Land, R. (2005). *Higher Education*, 49(3), 373–388.
- Rossett, A., & Schafer, L. (2007). *Job aids and performance support.*
- `01-analyze/task-inventory.md`, `01-analyze/cognitive-load-analysis.md`, `01-analyze/kirkpatrick-l4-l1-cascade.md`.
- `02-design/learning-outcomes-abcd-bloom.md`.
- Decisions `D-002`, `D-004`, `D-005`, `D-006`, `D-007`.
