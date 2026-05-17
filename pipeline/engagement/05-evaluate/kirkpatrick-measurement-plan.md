# Kirkpatrick measurement plan · L1–L4 master

> Why this artefact: brief §5 lays out a Kirkpatrick-shaped success-measures table; the plan below is its operational counterpart, with a named instrument, source, owner, cadence, and interpretation rule per row. Frameworks: Kirkpatrick four levels (frameworks-applied #3), Thalheimer LTEM (#12) for the L1 reframe, Phillips evaluation methodology for the L4 attribution stance per D-008.

This is the master document. Each level has its own deliverable in this folder; this file is the integration spine.

---

## 0 · Reading the table

Every row contains:

- **Instrument** — the concrete artefact a learner / manager / system encounters.
- **Data source** — the system the value lives in (no new tooling per §7).
- **Owner** — named individual accountable for the metric (anonymised initials).
- **Cadence** — how often the value refreshes / is sampled.
- **Baseline** — pre-program value (where available).
- **6-month target** — per brief §5.
- **12-month target** — per brief §5.
- **Interpretation rule** — what we do with the value when it lands.

---

## 1 · Level 1 · Reaction (reframed as LTEM tier 3)

> D-003 is binding here. L1 is **not** a smile-sheet. It is one decision-relevance Likert + two open items. The full instrument lives in `l1-pulse-survey.md`.

| Instrument | Data source | Owner | Cadence | Baseline | 6-mo target | 12-mo target | Interpretation rule |
|---|---|---|---|---|---|---|---|
| Post-module micro-pulse · "I could use this on a call today" (1–5) | Sana survey block | M.B. (designer) → A.S. on hand-off | Per module completion | n/a (new) | ≥ 4.0 / 5 mean across modules | ≥ 4.2 / 5 | < 3.5 on any module → flag that module for Phase 6 sprint 6.1 |
| Open item · "Name the move you are most likely to forget when the call is live." | Sana free-text | M.B. weekly coding | Per module completion | n/a | Themed weekly; ≥ 1 actionable theme per cohort | Themed continuously | Theme repeated in ≥ 30 % of responses → that move becomes a Phase 6 spaced-retrieval target |
| Open item · "What one thing would you remove from this module?" | Sana free-text | M.B. weekly coding | Per module completion | n/a | Themed weekly | Themed continuously | Same removal cited by ≥ 3 learners → review for cut in next refresh sprint |

**Why LTEM tier 3, not satisfaction.** Per D-003 + K.M. verbatim §8: *"Another Articulate slide-deck no one finishes."* A satisfaction score that says "the module was nice" provides no decision input for iteration. Application-intent ("I could use this on a call today") + open feedback drives the Phase 6 sprints.

---

## 2 · Level 2 · Learning

Two instruments per module: first-attempt mastery quiz and a +7-day spaced retrieval mini-quiz. Full blueprint in `l2-quiz-blueprint.md`. Spaced retrieval is per framework #11 (Roediger & Karpicke) and brief §5 explicit L2 target.

| Instrument | Data source | Owner | Cadence | Baseline | 6-mo target | 12-mo target | Interpretation rule |
|---|---|---|---|---|---|---|---|
| End-of-module quiz · 5–7 items · first attempt | Sana `cmi.core.score.raw` | LMS admin (data) · M.B. (item design) | Per module completion | n/a | ≥ 80 % mean first-attempt score | ≥ 85 % | < 70 % on an item → item review (distractor or stem); < 75 % on a module → content review |
| +7-day mini-quiz · 3 items · different stem, same outcome | Sana `cmi.core.score.raw` (separate SCO) | LMS admin · M.B. | Auto-scheduled +7 days | n/a | ≥ 70 % mean | ≥ 75 % | < 60 % retention → spaced-retrieval sequence not working for that outcome; flag for sprint 6.1 |

**Outcome linkage.** Each quiz item is tagged with an outcome ID from `02-design/learning-outcomes-abcd-bloom.md` (file will be created in Phase 2). Items map to M1/M2/M3 or to the ICP / regulatory decision cards (Modules 4 + 6). See `l2-quiz-blueprint.md` for the linkage table.

---

## 3 · Level 3 · Behaviour

The 3-row manager call-review rubric (D-004) is the L3 instrument. Full anchors in `l3-call-rubric.md`. Two flows: Gong NLP auto-tag (cheap, noisy) + manager rubric scoring (expensive, calibrated).

| Instrument | Data source | Owner | Cadence | Baseline | 6-mo target | 12-mo target | Interpretation rule |
|---|---|---|---|---|---|---|---|
| Talk-track adherence (M1 opener) — auto-tag | Gong `tag:diagnostic-opener` | J.V. (RevOps) | Nightly aggregate per rep weeks 4–8 | ~52 % | ≥ 80 % | ≥ 85 % | Pod-level adherence < 70 % → calibration session with that pod's manager |
| Talk-track adherence (M2 acknowledge) — auto-tag | Gong `tag:objection-acknowledged` | J.V. | Nightly | ~52 % proxy | ≥ 80 % | ≥ 85 % | Same |
| Talk-track adherence (M3 calendar-close) — auto-tag | Gong `tag:calendar-booked` + Salesforce `Next_Step_Booked__c` | J.V. | Nightly | ~52 % proxy | ≥ 80 % | ≥ 85 % | Cross-check Gong tag vs Salesforce; gap > 10 pp → tag drift, recalibrate |
| Manager rubric score (M1/M2/M3 each 1–5) | Gong scorecard → Salesforce `Call_Review__c` | Pod manager (scorer) · A.S. (rollup) | 4 calls per rep per month | ~2.4 / 5 (objection-handling proxy, §5) | ≥ 3.5 / 5 per row | ≥ 4.0 / 5 per row | Rubric < 3.0 on any row → that rep on focused-coaching list for the next 2 weeks |

**Calibration.** Inter-rater reliability is established at the week-6 calibration session (per `04-implement/` plan). Same 3 sample calls scored by every manager; disagreements surfaced; rubric anchors clarified. Repeat quarterly.

---

## 4 · Level 4 · Results (attribution-bounded · D-008)

Two headline KPIs from brief §5. Three-line interpretation method per D-008. Full spec in `l4-ramp-retention-tracking.md`.

| Instrument | Data source | Owner | Cadence | Baseline | 6-mo target | 12-mo target | Interpretation rule |
|---|---|---|---|---|---|---|---|
| Mean ramp to first paid quota · rolling-4-cohort avg | Salesforce `Ramp_Time__c` + `First_Paid_Quota_Date__c` | J.V. | Nightly · monthly review | 95 d | ≤ 71 d (−25 %) | ≤ 65 d (−32 %) | See three-line method below |
| Day-120 retention · per hire cohort | HRIS `Day_120_Retained` + Salesforce `Tenure_Cohort__c` | D.R. (data) · J.V. (rollup) | Daily computed; reported monthly | ~83 % | ≥ 92 % | ≥ 95 % | Per-cohort < 88 % → exit-interview pull + qualitative review |

### 4.1 · The three-line method (D-008)

Per K.M. verbatim §8: *"If we miss it, I need to know whether the cause was training or lead quality or comp."* The L4 chart carries three lines, not one:

1. **Program-cohort ramp** — reps who shipped through the new program (post-1-July cohorts).
2. **Baseline ramp** — pre-program hires still ramping (uses §5 baseline of 95 d as anchor, with the running tail of legacy reps inside their first 120 days).
3. **Marketing-lead-quality index** — RevOps composite of close-rate, response-rate, and SQL-ratio per CMO source. Provides the confound visibility.

**Interpretation matrix:**

| Program cohort ramp | Baseline ramp | Lead-quality index | Read |
|---|---|---|---|
| ↓ (improving) | ≈ flat | ≈ flat | Strong signal program works |
| ↓ | ↓ also | flat | Org-wide tailwind; program contribution unclear |
| ↓ | flat | ↑ improving | Lead-quality + program co-vary; cannot isolate cleanly |
| flat | flat | ↓ deteriorating | Lead-quality drag is masking program effect; surface to CMO |
| ↑ (worse) | flat | flat | Program is not landing; trigger Phase 6 sprint 6.1 + 6.2 |
| Any | Any | SPIF activity flag = ON | Confound active; comp-plan distortion (§17); note in monthly report |

### 4.2 · Confounds surfaced (per K.M. §8 + brief §17, §20)

- **Lead-quality drift** — marketing-sourced inbound close-rate already moved 12 % → 8 % over last two quarters. Tracked as the third line above.
- **Comp-plan SPIF** — monthly SPIF rewards closed-won regardless of source; new reps in months 2–4 chase stale leads. Surfaced as a binary flag in the dashboard: `Sequence_Completion_Rate` (Outreach) anomalously high while net-new pipeline flat = SPIF-chasing signature.
- **Sponsor turnover risk (§20)** — every signed phase-gate doc preserves the decision trail; this plan survives a K.M. exit.

### 4.3 · No-confidence branch

If at the 6-month review the lead-quality index is moving and the SPIF flag is on, the L4 read is *not-attributable*. Phase 6 ships an "attribution recovery" sprint instead of a content sprint: pull a comparison sample of cohort-1 reps vs a matched-pre-program cohort and run a qualitative deep-dive. **L4 numbers are reported with the caveat band**, never as standalone causal claims.

---

## 5 · Cadence calendar

| When | What | Who |
|---|---|---|
| Per module completion (continuous) | L1 + L2 instruments fire | Sana auto |
| +7 days post-module (continuous) | L2 mini-quiz fires | Sana scheduled |
| Weekly | L1 open-response themes coded | M.B. |
| Weekly (per rep) | Gong auto-tags refreshed | J.V. (automated) |
| Monthly (per rep) | 4 manager rubric scores filed | Pod managers |
| Monthly | Sponsor dashboard review | K.M. + M.B. + J.V. |
| Quarterly | Rubric inter-rater calibration | A.S. + all 9 pod managers |
| Quarterly | Confound review · lead-quality + SPIF | K.M. + R.K. (CMO) + RevOps |

---

## 6 · Phase-6 iteration triggers (decision rules)

These trigger the iteration sprints in `06-iterate/`:

| Signal | Trigger |
|---|---|
| L1 module score < 3.5 | Sprint 6.1.A — that module's worked-example pass |
| L2 first-attempt < 70 % on any item | Sprint 6.1.B — item rewrite or content gap |
| L2 +7-day < 60 % retention | Sprint 6.1.C — spaced-retrieval sequence redesign |
| L3 pod adherence < 70 % | Sprint 6.2.A — that pod's manager calibration |
| L3 rubric < 3.0 on a row | Sprint 6.2.B — that move's job-aid rebuild (framework #20) |
| L4 program-cohort ramp not improving and confounds quiet | Sprint 6.3 — full content review |
| L4 confound flags active | Sprint 6.4 — attribution-recovery deep-dive, not content change |

---

## References

- `case-study-tz.md` §5, §7, §8, §15, §17, §20
- `00-project-management/decisions-log.md` D-003, D-004, D-008
- `00-project-management/frameworks-applied.md` #3, #11, #12, #20
- `00-project-management/master-plan.md` §5
- Kirkpatrick & Kirkpatrick (2016) · Phillips (2003) · Thalheimer (2018, LTEM) · Roediger & Karpicke (2006)
