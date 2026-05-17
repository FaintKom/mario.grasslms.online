> Why this artefact: Master assessment design across all four Kirkpatrick levels. Documents the *design rationale* for each instrument — Phase 5 (`05-evaluate/`) holds the ready-to-use instruments; this file holds the why-this-shape-and-not-another argument. Reconciles every outcome ID minted in `02-design/learning-outcomes-abcd-bloom.md` against every item type in `05-evaluate/l1-pulse-survey.md` + `l2-quiz-blueprint.md` + `l3-call-rubric.md` + `l4-ramp-retention-tracking.md`. Item-writing rules follow Haladyna & Downing (2013) assessment-validity guidance — scenario items, not factual recall. Frameworks: Backwards Design Stage 2 (Wiggins & McTighe 2005); Bloom revised (Anderson & Krathwohl 2001); ABCD (Mager 1962/1997); LTEM tier-3 (Thalheimer 2018).

# Assessment design

## 1 · L1 instrument design

### 1.1 · Live artefact

`05-evaluate/l1-pulse-survey.md` is the production instrument. Three items, ≤ 30 s, fires on every module's `cmi.core.lesson_status = completed` event.

### 1.2 · Design rationale (per `D-003`)

L1 is **not** a smile-sheet. It is a Thalheimer LTEM tier-3 *decision-relevance* instrument. The reasoning chain:

- Brief §5 already worded the L1 target as application-intent (*"I could use this on a call today ≥ 4.0/5"*), not satisfaction.
- Brief §8 (K.M.): *"Another Articulate slide-deck no one finishes"* — sponsor primed against engagement-as-success-metric.
- Brief §18.2 (internal brand voice): *"Honest about hard parts"* — the instrument must invite honest negative feedback, not validation.

### 1.3 · The three items + why each item

| Item | LTEM tier | What it measures | Why it stays | Why other items were rejected |
|---|---|---|---|---|
| Q1 *"I could use this on a call today"* (Likert 1–5) | Tier 3 (decision-relevant feedback) | Application-intent | Brief §5 target is worded exactly this way | Standard satisfaction Likert was rejected — invites the K.M.-flagged failure mode |
| Q2 *"Name the move you are most likely to forget when the call is live"* (open) | Tier 3 | Schema-fragility per cohort | Surfaces which specific outcome the +7-d spaced retrieval needs to target | "How engaging was this module?" rejected — not actionable |
| Q3 *"What one thing would you remove from this module?"* (open) | Tier 3 | Extraneous-load violations | Drives Phase 6 sprint 6.1.D (UX-trim pass) | Net Promoter Score rejected — not decision-relevant for content iteration |

### 1.4 · Anti-failure guards (per `l1-pulse-survey.md` §6)

- No item is reworded to fish for higher scores — if Q1 trends down, content needs work, not the question.
- Open responses reported to sponsor verbatim in the monthly dashboard review.
- Manager pressure to "improve scores" explicitly out of bounds (signed off by A.S. + K.M. at kickoff per §8).

---

## 2 · L2 quiz design

### 2.1 · Live artefact

`05-evaluate/l2-quiz-blueprint.md` is the production blueprint. Two instruments per module: end-of-module quiz (5–7 items, ≥ 80 % first-attempt mastery per `cmi.core.score.raw`) and +7-day spaced-retrieval mini-quiz (3 items, ≥ 70 %).

### 2.2 · Placeholder reconciliation

`l2-quiz-blueprint.md` §3 line-by-line uses placeholder outcome IDs. **This section is the canonical reconciliation.** Every placeholder ID resolves to a real outcome in `02-design/learning-outcomes-abcd-bloom.md`:

| Module | `l2-quiz-blueprint.md` §3 placeholder | Now resolves to (this design file as proof) | Item type used |
|---|---|---|---|
| 1 (M1) | LO-M1.1 | **LO-M1.1** — Extract diagnostic-worthy signal | Scenario-classification (§4.1 item 1) |
| 1 (M1) | LO-M1.2 | **LO-M1.2** — Phrase diagnostic ≤ 15 words | Worked-example completion (§4.1 item 2 / +7-d item) |
| 1 (M1) | LO-M1.3 | **LO-M1.3** — Tolerate 5-s silence | Scenario-classification |
| 2 (M2) | LO-M2.1 | **LO-M2.1** — Classify objection family ≤ 3 s | Scenario-classification (§4.2 item 1) |
| 2 (M2) | LO-M2.2 | **LO-M2.2** — Restate in buyer's own words | Worked-example completion (§4.2 +7-d item) |
| 2 (M2) | LO-M2.3 | **LO-M2.3** — Follow-up question that surfaces broken thing | Scenario-classification |
| 3 (M3) | LO-M3.1 | **LO-M3.1** — Open calendar pre-dial (habit) | Scenario-classification |
| 3 (M3) | LO-M3.2 | **LO-M3.2** — Two slots + send invite during call | Worked-example completion (§4.3 item 1) |
| 4 (ICP) | LO-ICP.1 | **LO-ICP.1** — Discriminate 4 archetypes ≤ 5 s | Decision-card lookup (§4.4 item 1) |
| 4 (ICP) | LO-ICP.2 | **LO-ICP.2** — Select archetype's ideal opener | Decision-card lookup |
| 4 (ICP) | LO-ICP.3 | **LO-ICP.3** — Run M1+M2+M3 × 3+ archetypes interleaved | Scenario-classification |
| 4 (ICP) | LO-ICP.4 | **LO-ICP.4** — Pick best-fit prop per archetype | Decision-card lookup |
| 5 (PP) | LO-PP.1 | **LO-PP.1** — Map pain → prop | Scenario-classification (§4.5 item) |
| 5 (PP) | LO-PP.2 | **LO-PP.2** — Frame in buyer's language | Scenario-classification (anti-jargon detector) |
| 5 (PP) | LO-PP.3 | **LO-PP.3** — Dual diagnostic on multi-stakeholder call | Scenario-classification (cohort-1 Gong hook) |
| 5 (PP) | LO-PP.4 | **LO-PP.4** — Multi-stakeholder calendar invite | Worked-example completion |
| 6 (REG) | LO-REG.1 | **LO-REG.1** — Match buyer Q to §19 row ≤ 3 s | Decision-card lookup (§4.6 item) |
| 6 (REG) | LO-REG.2 | **LO-REG.2** — Deliver §19 verbatim + escalate decision | Decision-card lookup |

**Reconciliation rule.** Any L2 item that cannot be tied to a live outcome ID in this design file is rewritten or rejected before Phase 3 build. Phase 5 is responsible for keeping the `l2-quiz-blueprint.md` text fresh; this file is the canonical ID source.

### 2.3 · Why three item types only (no fact-recall MCQ)

Per Haladyna & Downing (2013) and brief §10.4 (P.B.) *"It loaded knowledge. Not moves."* — recall-only items are explicitly rejected. The three types used are:

| Type | What it tests | Bloom level reached |
|---|---|---|
| Scenario-classification | "Which M-move applies?" given a buyer line | Apply / Analyse |
| Worked-example completion | Fill blank in real rep transcript | Apply (Procedural) |
| Decision-card lookup | "Which card does the rep reach for?" | Analyse (Conceptual) |

All three are **performance-of-knowledge** items, not knowledge-recall.

### 2.4 · Spaced retrieval design (per Roediger & Karpicke 2006)

The +7-day mini-quiz uses **same outcome, different stem**. This is the difference between recognition and retrieval. Re-attempts on identical items within the +7-day window are blocked by Sana (per `l2-quiz-blueprint.md` §6).

### 2.5 · Mastery thresholds (per brief §5)

- End-of-module: ≥ 80 % first attempt (brief §5 target).
- +7-day: ≥ 70 % first attempt (brief §5 target).
- Drill D1–D6: ≥ 95 % first attempt (per `01-analyze/task-inventory.md` §6).

---

## 3 · L3 rubric design

### 3.1 · Live artefact

`05-evaluate/l3-call-rubric.md` is the production rubric. 3 rows × 5 anchored levels, single A4 page, manager uses 4 calls/rep/month.

### 3.2 · Design rationale (per `D-004`)

#### Why 3 rows

- Brief §8 K.M. verbatim: *"a single sheet with 3 rows (one per move) and 1–5 scoring with anchored descriptors."*
- Brief §10.6 J.T. (highest-cadence pod manager) verbatim: *"Three rows — opener / objection / close — each scored 1–5 with 3 example anchors per row."*
- Sponsor + reference manager already converged on the design. Designing differently overrides documented user-research evidence.

#### Why 5 columns (granularity vs grader cognitive load · Sweller 2011)

- 3-anchor rubric (J.T.'s prototype): too compressed; 1-2-3 collapses to binary in practice.
- 7-anchor: high granularity, low inter-rater reliability without long calibration cycles.
- **5-anchor: tradeoff sweet spot per Sweller's cognitive-load-on-the-grader logic.** Inter-rater reliability achievable in a single week-6 calibration session (per brief §8 + master plan §2 calibration cadence).

#### Anchor-writing rules

Per `l3-call-rubric.md` §6:

- Every anchor at score 4 and 5 must be a **specific, observable behaviour** traceable to a §10 SME quote or §11 Gong call.
- M1 anchor 5 traces to: M.G. §10.1 (5-second silence verbatim) + L.D. §10.2 (quant-anchored opener) + GC-03, GC-06, GC-08.
- M2 anchor 5 traces to: L.D. §10.2 Brex displacement + M.G. §10.1 (*"so you've got the card-issuing side sorted"*) + GC-03, GC-06.
- M3 anchor 5 traces to: M.G. §10.1 (*"I do not say 'I'll send you something'"*) + GC-01, GC-02, GC-07, GC-08.

#### Why 5-anchor scale per row (not pass/fail)

- Pass/fail loses the coaching signal (J.T. §10.6: *"reps know what I'm grading them on so they self-correct between calls"*).
- 5-anchor surfaces the *lowest row* as the coaching focus (per `l3-call-rubric.md` §1 totals box).

### 3.3 · Traceback to §10.6 J.T. + §10.8

§10.6 J.T.'s self-built rubric is the prototype this design supersedes. Three differences:

| Feature | J.T.'s v0 | This rubric v1 |
|---|---|---|
| Rows | 3 (opener / objection / close) | 3 (M1 / M2 / M3 — same) |
| Anchors per row | 3 example anchors | 5 levelled anchors (1–5) with explicit anchor descriptors |
| Cross-pod calibration | None | Week-2 + week-6 calibration sessions (`04-implement/manager-calibration-session-plan.md`) |
| Schema versioning | Informal | `06-iterate/rubric-version-log.md` per `06-iterate/iteration-playbook.md` |

§10.8 both-managers ask (*"both managers asked unprompted for a shared, calibrated 3-row rubric"*) is satisfied by the calibration session structure.

### 3.4 · Calibration design

Per `l3-call-rubric.md` §7 + `04-implement/manager-calibration-session-plan.md`:

- **Week 2 (post-launch).** All 9 pod managers attend; introduces rubric, scores 1 sample call together.
- **Week 6.** All 9 managers score 3 sample calls cold (one each at score 5 / 3 / 1), then debate. Disagreements close by clarifying anchor wording, not by vote.
- **Quarterly.** Repeat week-6 cadence. Anchor changes trigger rubric version-bump (v1.1, v1.2, etc.).

### 3.5 · v2 evolution path (per `06-iterate/iteration-playbook.md`)

The current 3-row constraint is a `D-004` boundary. Two v2 candidates are tracked:

- **4th row · "Regulatory deflection."** Pending cohort-1 Gong validation per Module 6 Evidence note. If buyer reg questions appear in ≥ 30 % of cohort-1 calls and manager scoring of deflection quality diverges by > 1 point between pods, the 4th row is added.
- **Per-stakeholder columns on M1/M2.** Pending cohort-1 multi-stakeholder Gong validation per Module 5 Evidence note. If LO-PP.3 multi-stakeholder dual-diagnostic execution warrants separate scoring, the rubric expands to two columns per row.

Neither change happens in v1 — `D-004` constraint holds.

---

## 4 · L4 measurement design

### 4.1 · Live artefact

`05-evaluate/l4-ramp-retention-tracking.md` is the production dashboard spec.

### 4.2 · Design rationale (per `D-008`)

L4 is **associative, not causal**. Three confounds (`gap-analysis.md` §3 environment-only items) are pre-acknowledged by sponsor:

- Marketing lead-quality decline (§8, §20).
- Comp-plan SPIF distortion (§17).
- Manager-cadence variance (§8 — partly addressed by rubric layer).

### 4.3 · Three-line dashboard rationale

Per `l4-ramp-retention-tracking.md` §4. The chart carries:

- Line A · program-cohort ramp.
- Line B · pre-program baseline ramp.
- Line C · marketing lead-quality index (RevOps existing job).

**Interpretation matrix** in `l4-ramp-retention-tracking.md` §4 makes the joint-read explicit. Confound lines are not subtracted from program effect; they are surfaced so the CRO conversation is honest (per K.M. §8 *"the conversation with the CRO is honest either way"*).

### 4.4 · Attribution boundaries

Quasi-experimental design (rejecting RCT per `D-008`):

- Cohort comparison (pre-program baseline vs cohort 1-4).
- Pod-level slice (controlled against pod-cadence variable).
- Time-series rolling-4-cohort average (per brief §21).

This gives an **honest direction-of-effect**, not a clean causal claim.

### 4.5 · SPIF confound flag (per brief §17)

`SPIF_Activity_Flag` per rep-month, TRUE when:
- `Sequence_Completion_Rate > 90 %` (Outreach grind), AND
- Net-new pipeline below pod median for that month, AND
- A SPIF is active in the comp calendar.

Surfaced as percentage of cohort flagged on the confound watch panel. Not punitive against reps; flags the comp design (per K.M. §8 ask to RevOps).

---

## 5 · Item-writing rules (per Haladyna & Downing 2013)

These rules apply to every L1 / L2 / L3 / L4 instrument:

1. **Scenario-anchored, not recall-anchored.** Every L2 item embeds a buyer line, a Gong call ID, or an archetype profile. No "what does AML stand for?" style items.
2. **Distractors from documented failure patterns.** Per `l2-quiz-blueprint.md` §5 — every wrong answer maps to a real GC failure ID or a §10 SME failure-mode quote. Random/plausible-but-arbitrary distractors are rejected.
3. **Single correct answer per item.** No "select all that apply" — increases ambiguity and cognitive load on the grader.
4. **Items written at Bloom Apply / Analyse / Evaluate / Create.** Never Remember-only (per `learning-outcomes-abcd-bloom.md` discipline).
5. **No double-barrelled prompts.** Each item tests one outcome.
6. **L1 Likert anchored to behaviour.** "I could use this on a call today" is behavioural intent, not satisfaction.
7. **L3 rubric anchors observable.** No "demonstrates confidence" or "shows ownership" — every anchor names a specific behaviour (silence ≥ 4 s · two slots stated · etc.).
8. **L4 metric source-of-truth named.** Every L4 line cites the Salesforce field + HRIS field + owner (J.V.) per `l4-ramp-retention-tracking.md` §6.
9. **Stem-options independence.** The stem must not be answerable from the options alone (e.g. no "all of the above" or "none of the above" patterns).
10. **No trick items.** If 70 % of well-prepared reps miss an item, it is rewritten — the item is the failure, not the rep (per `l2-quiz-blueprint.md` §7 quarterly item-stat review).

---

## 6 · Outcome-to-item full traceability matrix

| Outcome ID | L1 instrument | L2 end-of-module item | L2 +7-d item | L3 rubric row / anchor | L4 metric / proxy |
|---|---|---|---|---|---|
| T1 | Q1 (program-rollup) | — | — | All 3 rows (live calls weeks 4–8) | Salesforce `Ramp_Time__c` |
| T2 | M1 Q1 | LO-M1.1/2/3 items §4.1 | 3 items same outcomes | M1 row anchor ≥ 4 | (cascades to T1) |
| T3 | M2 Q1 | LO-M2.1/2/3 items §4.2 | 3 items same outcomes | M2 row anchor ≥ 4 | (cascades to T1) |
| T4 | M3 Q1 | LO-M3.1/2 items §4.3 | 3 items same outcomes | M3 row anchor ≥ 4 | Salesforce `Next_Step_Booked__c = TRUE` |
| T5 | M4 Q1 | LO-ICP.1–4 items §4.4 | 3 items same outcomes | All 3 rows × 3 archetypes | (cascades to T1) |
| T6 | M5 Q1 | LO-PP.1–4 items §4.5 | 3 items same outcomes | M1 row ×2 + M2 + M3 (multi-stakeholder) | (cascades to T1) + Salesforce |
| T7 | M6 Q1 | LO-REG.1–2 items §4.6 | 3 items same outcomes | (v2 backlog row) — manager observation in v1 | (cascades — not direct) |
| LO-M1.1 | — | §4.1 item 1 scenario-classification | +7-d novel stem | M1 anchor 4 | — |
| LO-M1.2 | — | §4.1 worked-example completion | +7-d novel stem (§4.1 verbatim Tom example) | M1 anchor 4 | — |
| LO-M1.3 | M1 Q2 (forgotten-move self-report) | §4.1 silence scenario | +7-d novel stem | M1 anchor 5 | — |
| LO-M2.1 | — | §4.2 scenario-classification (Brex example) | +7-d novel stem | M2 anchor 4 | — |
| LO-M2.2 | — | §4.2 worked-example completion (accountant example) | +7-d novel stem | M2 anchor 4 + 5 | — |
| LO-M2.3 | — | §4.2 scenario | +7-d novel stem | M2 anchor 5 | — |
| LO-M3.1 | — | §4.3 scenario (no-calendar-open consequence) | +7-d novel stem | M3 anchor 4 prerequisite | mini-OS event log (no L2 quantitative) |
| LO-M3.2 | — | §4.3 worked-example completion (two-slot close) | +7-d novel stem | M3 anchor 4 + 5 | Salesforce `Next_Step_Booked__c` |
| LO-ICP.1 | — | §4.4 decision-card | +7-d novel stem | M1 row (correct opener per archetype) | — |
| LO-ICP.2 | — | §4.4 scenario | +7-d novel stem | M1 row | — |
| LO-ICP.3 | M4 Q2 | §4.4 cross-archetype scenario | +7-d novel stem | All 3 rows × 3 archetypes | — |
| LO-ICP.4 | — | §4.4 decision-card | +7-d novel stem | — (Module 5 picks this up) | — |
| LO-PP.1 | — | §4.5 scenario-classification (Emma/receipts) | +7-d novel stem | (n/a — prop selection not directly rubric-scored) | — |
| LO-PP.2 | M5 Q3 (forced jargon flag) | §4.5 anti-jargon item | +7-d novel stem | — | — |
| LO-PP.3 | — | §4.5 multi-stakeholder scenario | +7-d novel stem | M1 row ×2 (cohort-1 Gong hook) | — |
| LO-PP.4 | — | §4.5 multi-invitee completion | +7-d novel stem | M3 row | Salesforce |
| LO-REG.1 | — | §4.6 decision-card (Lukas trust) | +7-d novel stem | (v2 backlog row) | — |
| LO-REG.2 | M6 Q2 | §4.6 escalate-decision item | +7-d novel stem | (v2 backlog row, cohort-1 Gong hook) | — |

---

## 7 · What this design sends downstream

| Sends | To |
|---|---|
| Reconciled placeholder LO-IDs | `05-evaluate/l2-quiz-blueprint.md` (Phase 5 owner: re-key §3 placeholder table to canonical IDs above) |
| Rubric design rationale + v2 backlog | `02-design/rubric-design.md` |
| Item-writing rules | `03-develop/scorm-shell/` content-authoring guide |
| Outcome-to-item traceability | `05-evaluate/kirkpatrick-measurement-plan.md` Sprint 5.1 |
| Mini-OS instrumentation requirements (event-log fields per outcome) | `03-develop/scorm-shell/event-log-spec.md` (Phase 3 build) |

## References

- Brief §§5, 7, 8, 10.1, 10.2, 10.4, 10.6, 10.8, 11, 12, 13.1, 17, 18.2, 19, 20.
- Haladyna, T. M., & Downing, S. M. (2013). *Handbook of test development* (2nd ed.). Routledge — assessment-validity guidance.
- Wiggins, G., & McTighe, J. (2005). *Understanding by Design* (2nd ed.).
- Anderson, L. W., & Krathwohl, D. R. (2001). *A taxonomy for learning, teaching, and assessing.* Longman.
- Mager, R. F. (1962/1997). *Preparing instructional objectives.*
- Thalheimer, W. (2018). *The Learning-Transfer Evaluation Model.* Work-Learning Research.
- Roediger, H. L., & Karpicke, J. D. (2006). *Perspectives on Psychological Science*, 1(3), 181–210.
- Phillips, J. J. (2003). *Return on investment in training and performance improvement programs.*
- Sweller, J., Ayres, P., & Kalyuga, S. (2011). *Cognitive load theory.*
- `01-analyze/kirkpatrick-l4-l1-cascade.md`, `01-analyze/task-inventory.md`, `01-analyze/gap-analysis.md`.
- `02-design/learning-outcomes-abcd-bloom.md`, `02-design/curriculum-blueprint.md`, `02-design/4cid-blueprint.md`, `02-design/rubric-design.md`.
- `05-evaluate/l1-pulse-survey.md`, `05-evaluate/l2-quiz-blueprint.md`, `05-evaluate/l3-call-rubric.md`, `05-evaluate/l4-ramp-retention-tracking.md`.
- Decisions `D-002`, `D-003`, `D-004`, `D-008`.
